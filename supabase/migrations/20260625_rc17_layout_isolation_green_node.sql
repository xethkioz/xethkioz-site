-- XETHKIOZ v4.0 RC1.7
-- Layout Isolation + Green Node Video Polish metadata.
-- Safe optional migration: registers portal layout policy if tables exist.

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'network_modules') then
    insert into public.network_modules (slug, name, route, status, accent, description)
    values
      ('science-lab', 'Science Lab', '/science', 'formal-division', 'sky', 'Portal formal aislado para informes científicos, fuentes y evidencia.'),
      ('green-node', 'Green Node', '/green-node', 'hidden-portal', 'green', 'Portal oculto aislado con Wisp, video banner, terminal y ciberseguridad educativa.')
    on conflict (slug) do update set
      name = excluded.name,
      route = excluded.route,
      status = excluded.status,
      accent = excluded.accent,
      description = excluded.description;
  end if;
end $$;
