-- Canonical network cleanup: keep XETHKIOZ official channel identity aligned with current project settings.

delete from public.ads_campaigns
where lower(coalesce(target_url, '')) in (
  'https://kick.com/xethkioz',
  'https://www.twitch.tv/xethkioz'
)
or lower(coalesce(title, '')) like '%directos%kick%';

delete from public.streams
where lower(platform) in ('kick', 'twitch')
   or lower(channel_url) in (
     'https://kick.com/xethkioz',
     'https://www.twitch.tv/xethkioz'
   );

do $$
begin
  if to_regclass('public.social_links') is not null then
    execute $sql$
      delete from public.social_links
      where lower(coalesce(url, '')) in (
        'https://kick.com/xethkioz',
        'https://www.twitch.tv/xethkioz'
      )
      or lower(coalesce(platform, '')) in ('kick', 'twitch')
    $sql$;
  end if;
end
$$;
