-- Prevent future thin articles from entering the public library.
-- Existing published rows remain editable for metadata; changing their body requires the new standard.

create or replace function public.xethkioz_enforce_news_depth()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  word_count integer;
  heading_count integer;
begin
  if new.status <> 'published' then return new; end if;
  if tg_op = 'UPDATE' and old.status = 'published' and new.content is not distinct from old.content then return new; end if;

  select
    coalesce(sum(cardinality(regexp_split_to_array(trim(block->>'text'), '\s+'))), 0),
    count(*) filter (where block->>'type' = 'heading')
  into word_count, heading_count
  from jsonb_array_elements(coalesce(new.content, '[]'::jsonb)) as blocks(block)
  where trim(coalesce(block->>'text', '')) <> '';

  if word_count < 220 then
    raise exception 'NEWS_DEPTH_REQUIRED: el dossier necesita al menos 220 palabras (actual: %)', word_count;
  end if;
  if heading_count < 3 then
    raise exception 'NEWS_STRUCTURE_REQUIRED: el dossier necesita al menos 3 capítulos (actual: %)', heading_count;
  end if;
  if coalesce(cardinality(new.source_urls), 0) < 1 then
    raise exception 'NEWS_SOURCE_REQUIRED: la publicación necesita una fuente verificable';
  end if;
  return new;
end;
$$;

drop trigger if exists news_depth_quality_gate on public.news_articles;
create trigger news_depth_quality_gate
before insert or update of status, content, source_urls on public.news_articles
for each row execute function public.xethkioz_enforce_news_depth();
