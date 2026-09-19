begin;

-- Least-privilege cleanup for browser roles. RLS remains the row-level boundary.
-- Remove dangerous table-level capabilities that frontend roles should never need.
do $$
declare
  r record;
begin
  for r in
    select n.nspname as schema_name, c.relname as table_name
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'r'
      and n.nspname = 'public'
  loop
    execute format(
      'revoke truncate, references, trigger on table %I.%I from anon, authenticated',
      r.schema_name, r.table_name
    );
  end loop;
end
$$;

-- Revoke direct DML grants that cannot currently pass any matching RLS policy.
-- Successful product flows are preserved because matching INSERT/UPDATE/DELETE
-- policies retain the corresponding grant.
do $$
declare
  r record;
begin
  for r in
    select distinct g.grantee, g.table_schema, g.table_name, g.privilege_type
    from information_schema.role_table_grants g
    where g.table_schema = 'public'
      and g.grantee in ('anon', 'authenticated')
      and g.privilege_type in ('INSERT', 'UPDATE', 'DELETE')
      and not exists (
        select 1
        from pg_policies p
        where p.schemaname = g.table_schema
          and p.tablename = g.table_name
          and p.cmd in (g.privilege_type, 'ALL')
          and (
            'public' = any(p.roles::text[])
            or g.grantee = any(p.roles::text[])
          )
      )
  loop
    execute format(
      'revoke %s on table %I.%I from %I',
      r.privilege_type, r.table_schema, r.table_name, r.grantee
    );
  end loop;
end
$$;

commit;
