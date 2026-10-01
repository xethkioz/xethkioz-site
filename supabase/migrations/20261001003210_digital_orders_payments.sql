-- Prepared locally; apply to an isolated test database before production.
begin;
create table public.digital_orders (
  id uuid primary key,
  request_key uuid not null unique,
  fingerprint text not null check (fingerprint ~ '^[0-9a-f]{64}$'),
  ip_hash text not null check (ip_hash ~ '^[0-9a-f]{64}$'),
  provider text not null check (provider in ('mercadopago','paypal')),
  mode text not null check (mode in ('sandbox','live')),
  snapshot jsonb not null,
  state text not null default 'created' check (state in ('created','checkout','paid')),
  provider_order_id text,
  checkout_url text,
  payment_id text,
  receipt jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  unique(provider,mode,provider_order_id),
  unique(provider,mode,payment_id),
  check (snapshot->>'id' = id::text),
  check (snapshot->>'provider' = provider and snapshot->>'mode' = mode),
  check (snapshot->>'amount' ~ '^[0-9]+\.[0-9]{2}$' and (snapshot->>'amount')::numeric > 0),
  check ((provider = 'paypal' and snapshot->>'currency' = 'USD') or (provider = 'mercadopago' and snapshot->>'currency' = 'ARS'))
);
create index digital_orders_ip_created on public.digital_orders(ip_hash,created_at desc);
create index digital_orders_email_created on public.digital_orders((snapshot->>'email'),created_at desc);
create table public.digital_order_outbox (
  key text primary key,
  order_id uuid not null references public.digital_orders(id),
  message jsonb not null,
  state text not null default 'pending' check (state in ('pending','claimed','accepted','review')),
  first_attempt_at timestamptz,
  next_attempt_at timestamptz not null default now(),
  claimed_at timestamptz,
  claim_token uuid,
  provider_message_id text,
  accepted_at timestamptz,
  check (message->>'key' = key)
);
create index digital_order_outbox_due on public.digital_order_outbox(state,next_attempt_at);
alter table public.digital_orders enable row level security;
alter table public.digital_order_outbox enable row level security;
revoke all on public.digital_orders,public.digital_order_outbox from public,anon,authenticated;
grant select,insert,update,delete on public.digital_orders,public.digital_order_outbox to service_role;
-- No browser policies: all customer reads/writes go through the bounded server API.

create function public.digital_order_create(p_snapshot jsonb,p_request_key uuid,p_fingerprint text,p_ip_hash text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare o public.digital_orders%rowtype;
begin
  perform pg_advisory_xact_lock(hashtextextended('request:'||p_request_key::text,0));
  select * into o from public.digital_orders where request_key=p_request_key;
  if found then
    if o.fingerprint<>p_fingerprint then raise exception 'REQUEST_KEY_REUSED'; end if;
    return to_jsonb(o);
  end if;
  -- Serialize the two rate-limit counts across server instances.
  perform pg_advisory_xact_lock(hashtextextended('ip:'||p_ip_hash,0));
  perform pg_advisory_xact_lock(hashtextextended('email:'||(p_snapshot->>'email'),0));
  if (select count(*) from public.digital_orders where ip_hash=p_ip_hash and created_at>now()-interval '1 hour')>=12
    or (select count(*) from public.digital_orders where snapshot->>'email'=p_snapshot->>'email' and created_at>now()-interval '1 hour')>=5
  then raise exception 'RATE_LIMITED'; end if;
  insert into public.digital_orders(id,request_key,fingerprint,ip_hash,provider,mode,snapshot)
    values((p_snapshot->>'id')::uuid,p_request_key,p_fingerprint,p_ip_hash,p_snapshot->>'provider',p_snapshot->>'mode',p_snapshot)
    returning * into o;
  return to_jsonb(o);
end $$;

create function public.digital_order_bind(p_id uuid,p_provider_id text,p_url text)
returns void language plpgsql security invoker set search_path = '' as $$
declare o public.digital_orders%rowtype;
begin
  select * into strict o from public.digital_orders where id=p_id for update;
  if o.provider_order_id is not null and (o.provider_order_id<>p_provider_id or o.checkout_url<>p_url) then
    raise exception 'PROVIDER_ORDER_MISMATCH';
  end if;
  update public.digital_orders set provider_order_id=p_provider_id,checkout_url=p_url,
    state=case when state='paid' then 'paid' else 'checkout' end where id=p_id;
end $$;

create function public.digital_order_paid(p_id uuid,p_receipt jsonb,p_messages jsonb)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare o public.digital_orders%rowtype; m jsonb; owner_key text; buyer_key text;
begin
  select * into strict o from public.digital_orders where id=p_id for update;
  if o.provider_order_id is null or p_receipt->>'orderId' is distinct from p_id::text
    or p_receipt->>'providerOrderId' is distinct from o.provider_order_id
    or p_receipt->>'provider' is distinct from o.provider
    or p_receipt->>'amount' is distinct from o.snapshot->>'amount'
    or p_receipt->>'currency' is distinct from o.snapshot->>'currency'
    or coalesce(p_receipt->>'paymentId','')='' then raise exception 'RECEIPT_MISMATCH'; end if;
  if o.state='paid' then
    if o.payment_id is distinct from p_receipt->>'paymentId' then raise exception 'RECEIPT_MISMATCH'; end if;
    return false;
  end if;
  owner_key := 'digital-order/'||p_id::text||'/owner-paid-v1';
  buyer_key := 'digital-order/'||p_id::text||'/buyer-paid-v1';
  if jsonb_typeof(p_messages)<>'array' or jsonb_array_length(p_messages)<>2 then raise exception 'INVALID_MESSAGES'; end if;
  if (select count(distinct value->>'key') from jsonb_array_elements(p_messages))<>2 then raise exception 'INVALID_MESSAGES'; end if;
  for m in select value from jsonb_array_elements(p_messages) loop
    if m->>'key'=owner_key then
      if m->>'to' is distinct from 'aidss1991@gmail.com' then raise exception 'INVALID_MESSAGES'; end if;
    elsif m->>'key'=buyer_key then
      if m->>'to' is distinct from o.snapshot->>'email' then raise exception 'INVALID_MESSAGES'; end if;
    else raise exception 'INVALID_MESSAGES'; end if;
    insert into public.digital_order_outbox(key,order_id,message) values(m->>'key',p_id,m);
  end loop;
  update public.digital_orders set state='paid',payment_id=p_receipt->>'paymentId',receipt=p_receipt,paid_at=now() where id=p_id;
  return true;
end $$;

create function public.digital_outbox_due(p_mode text)
returns setof text language sql security invoker set search_path = '' as $$
  select x.key from public.digital_order_outbox x join public.digital_orders o on o.id=x.order_id
  where o.mode=p_mode and ((x.state='pending' and x.next_attempt_at<=now()) or (x.state='claimed' and x.claimed_at<now()-interval '3 minutes'))
  order by x.next_attempt_at limit 10;
$$;
create function public.digital_outbox_claim(p_key text,p_token uuid,p_mode text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare x public.digital_order_outbox%rowtype;
begin
  update public.digital_order_outbox set state='claimed',claim_token=p_token,claimed_at=now(),first_attempt_at=coalesce(first_attempt_at,now())
  where key=p_key and order_id in (select id from public.digital_orders where mode=p_mode)
    and ((state='pending' and next_attempt_at<=now()) or (state='claimed' and claimed_at<now()-interval '3 minutes'))
  returning * into x;
  if not found then return null; end if;
  return to_jsonb(x);
end $$;
create function public.digital_outbox_finish(p_key text,p_token uuid,p_state text,p_provider_id text)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  if p_state not in ('accepted','pending','review') then raise exception 'INVALID_STATE'; end if;
  if p_state='accepted' and coalesce(p_provider_id,'')='' then raise exception 'INVALID_STATE'; end if;
  update public.digital_order_outbox set state=p_state,claim_token=null,claimed_at=null,
    next_attempt_at=now()+interval '1 minute',provider_message_id=p_provider_id,
    accepted_at=case when p_state='accepted' then now() else null end
  where key=p_key and claim_token=p_token and state='claimed';
  if not found then raise exception 'STALE_CLAIM'; end if;
end $$;

revoke all on function public.digital_order_create(jsonb,uuid,text,text),public.digital_order_bind(uuid,text,text),
  public.digital_order_paid(uuid,jsonb,jsonb),public.digital_outbox_due(text),public.digital_outbox_claim(text,uuid,text),
  public.digital_outbox_finish(text,uuid,text,text) from public,anon,authenticated;
grant execute on function public.digital_order_create(jsonb,uuid,text,text),public.digital_order_bind(uuid,text,text),
  public.digital_order_paid(uuid,jsonb,jsonb),public.digital_outbox_due(text),public.digital_outbox_claim(text,uuid,text),
  public.digital_outbox_finish(text,uuid,text,text) to service_role;
commit;
