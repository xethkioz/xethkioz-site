# XETHKIOZ Fusion SQL Inventory
Generated: 2026-06-26T23:06:24.852Z

Total SQL files: 45
Duplicate content files: 27

## CMS
- database/migrations/20260625_alpha3_chat_cms.sql | sha=ea2a90c185 | tables=4 | policies=7
  - creates: public.comments, public.article_reactions, public.chat_rooms, public.chat_messages
- database/migrations/20260625_rc16_content_system_final_qa.sql | sha=a99e51c6dd | tables=5 | policies=5
  - creates: public.portal_content_lanes, public.editorial_queue, public.portal_qa_checks, public.wisp_discovery_events, public.content_distribution_targets
- database/migrations/20260625_rc23_content_ready_ux_polish.sql | sha=dac9c5ee5e | tables=3 | policies=3
  - creates: public.xeth_editorial_slots, public.xeth_publishing_lanes, public.xeth_content_quality_gates
- database/migrations/20260625_v4_alpha2_chat_cms_foundation.sql | sha=5e8e83f31e | tables=3 | policies=3
  - creates: public.chat_rooms, public.chat_messages, public.cms_drafts
- supabase/migrations/20260625_alpha4_cms_chat_foundation.sql | sha=fc0ee401bf | tables=3 | policies=0
  - creates: public.chat_rooms, public.article_reactions, public.cms_drafts
- supabase/migrations/20260625_rc16_content_system_final_qa.sql | sha=a99e51c6dd | tables=5 | policies=5 DUPLICATE_OF=database/migrations/20260625_rc16_content_system_final_qa.sql
  - creates: public.portal_content_lanes, public.editorial_queue, public.portal_qa_checks, public.wisp_discovery_events, public.content_distribution_targets
- supabase/migrations/20260625_rc23_content_ready_ux_polish.sql | sha=dac9c5ee5e | tables=3 | policies=3 DUPLICATE_OF=database/migrations/20260625_rc23_content_ready_ux_polish.sql
  - creates: public.xeth_editorial_slots, public.xeth_publishing_lanes, public.xeth_content_quality_gates
- supabase/migrations/20260625_alpha4_cms_chat_foundation.sql | sha=fc0ee401bf | tables=3 | policies=0 DUPLICATE_OF=supabase/migrations/20260625_alpha4_cms_chat_foundation.sql
  - creates: public.chat_rooms, public.article_reactions, public.cms_drafts
- supabase/migrations/20260625_rc16_content_system_final_qa.sql | sha=a99e51c6dd | tables=5 | policies=5 DUPLICATE_OF=database/migrations/20260625_rc16_content_system_final_qa.sql
  - creates: public.portal_content_lanes, public.editorial_queue, public.portal_qa_checks, public.wisp_discovery_events, public.content_distribution_targets
- supabase/migrations/20260625_rc23_content_ready_ux_polish.sql | sha=dac9c5ee5e | tables=3 | policies=3 DUPLICATE_OF=database/migrations/20260625_rc23_content_ready_ux_polish.sql
  - creates: public.xeth_editorial_slots, public.xeth_publishing_lanes, public.xeth_content_quality_gates

## COMMUNITY
- database/migrations/20260625_rc20_realtime_chat_wisp_evolution.sql | sha=24b2e9d528 | tables=4 | policies=8
  - creates: public.xeth_chat_rooms, public.xeth_chat_messages, public.xeth_presence_routes, public.xeth_wisp_events
- database/migrations/20260625_rc24_realtime_community_daily_loop.sql | sha=d52b20ba0d | tables=4 | policies=8
  - creates: public.xeth_chat_messages, public.xeth_presence_routes, public.xeth_wisp_events, public.xeth_daily_content_slots
- supabase/migrations/20260625_rc20_realtime_chat_wisp_evolution.sql | sha=24b2e9d528 | tables=4 | policies=8 DUPLICATE_OF=database/migrations/20260625_rc20_realtime_chat_wisp_evolution.sql
  - creates: public.xeth_chat_rooms, public.xeth_chat_messages, public.xeth_presence_routes, public.xeth_wisp_events
- supabase/migrations/20260625_rc24_realtime_community_daily_loop.sql | sha=d52b20ba0d | tables=4 | policies=8 DUPLICATE_OF=database/migrations/20260625_rc24_realtime_community_daily_loop.sql
  - creates: public.xeth_chat_messages, public.xeth_presence_routes, public.xeth_wisp_events, public.xeth_daily_content_slots
- supabase/migrations/20260625_rc20_realtime_chat_wisp_evolution.sql | sha=24b2e9d528 | tables=4 | policies=8 DUPLICATE_OF=database/migrations/20260625_rc20_realtime_chat_wisp_evolution.sql
  - creates: public.xeth_chat_rooms, public.xeth_chat_messages, public.xeth_presence_routes, public.xeth_wisp_events
- supabase/migrations/20260625_rc24_realtime_community_daily_loop.sql | sha=d52b20ba0d | tables=4 | policies=8 DUPLICATE_OF=database/migrations/20260625_rc24_realtime_community_daily_loop.sql
  - creates: public.xeth_chat_messages, public.xeth_presence_routes, public.xeth_wisp_events, public.xeth_daily_content_slots

## CORE
- database/migrations/20260625_rc15_network_database_baseline.sql | sha=126656a6d7 | tables=16 | policies=21
  - creates: public.network_modules, public.content_tags, public.article_tag_links, public.science_sources, public.science_reports, public.news_sources, public.external_news_items, public.cms_publication_jobs, public.user_xp_events, public.achievements, public.user_badges, public.moderation_assignments, ...
- supabase/migrations/20260625_rc15_network_database_baseline.sql | sha=126656a6d7 | tables=16 | policies=21 DUPLICATE_OF=database/migrations/20260625_rc15_network_database_baseline.sql
  - creates: public.network_modules, public.content_tags, public.article_tag_links, public.science_sources, public.science_reports, public.news_sources, public.external_news_items, public.cms_publication_jobs, public.user_xp_events, public.achievements, public.user_badges, public.moderation_assignments, ...
- supabase/migrations/20260625_rc15_network_database_baseline.sql | sha=126656a6d7 | tables=16 | policies=21 DUPLICATE_OF=database/migrations/20260625_rc15_network_database_baseline.sql
  - creates: public.network_modules, public.content_tags, public.article_tag_links, public.science_sources, public.science_reports, public.news_sources, public.external_news_items, public.cms_publication_jobs, public.user_xp_events, public.achievements, public.user_badges, public.moderation_assignments, ...
- supabase/schema.sql | sha=2316bd63da | tables=11 | policies=16
  - creates: public.profiles, public.categories, public.authors, public.articles, public.comments, public.chat_messages, public.streams, public.media_items, public.social_links, public.newsletter_subscribers, public.site_settings

## GREEN_NODE
- database/migrations/20260625_rc1_4_network_integrity_wisp.sql | sha=1f4dc5620f | tables=3 | policies=4
  - creates: public.network_modules, public.green_node_unlocks, public.science_sources
- database/migrations/20260625_rc13_network_link_wisp_audit.sql | sha=aceb0e07ab | tables=4 | policies=4
  - creates: public.network_modules, public.link_registry, public.green_node_access_logs, public.science_report_sources
- database/migrations/20260625_rc17_layout_isolation_green_node.sql | sha=7ddc7e52d5 | tables=0 | policies=0
- supabase/migrations/20260625_rc1_4_network_integrity_wisp.sql | sha=1f4dc5620f | tables=3 | policies=4 DUPLICATE_OF=database/migrations/20260625_rc1_4_network_integrity_wisp.sql
  - creates: public.network_modules, public.green_node_unlocks, public.science_sources
- supabase/migrations/20260625_rc13_network_link_wisp_audit.sql | sha=aceb0e07ab | tables=4 | policies=4 DUPLICATE_OF=database/migrations/20260625_rc13_network_link_wisp_audit.sql
  - creates: public.network_modules, public.link_registry, public.green_node_access_logs, public.science_report_sources
- supabase/migrations/20260625_rc17_layout_isolation_green_node.sql | sha=7ddc7e52d5 | tables=0 | policies=0 DUPLICATE_OF=database/migrations/20260625_rc17_layout_isolation_green_node.sql
- supabase/migrations/20260625_rc1_4_network_integrity_wisp.sql | sha=1f4dc5620f | tables=3 | policies=4 DUPLICATE_OF=database/migrations/20260625_rc1_4_network_integrity_wisp.sql
  - creates: public.network_modules, public.green_node_unlocks, public.science_sources
- supabase/migrations/20260625_rc13_network_link_wisp_audit.sql | sha=aceb0e07ab | tables=4 | policies=4 DUPLICATE_OF=database/migrations/20260625_rc13_network_link_wisp_audit.sql
  - creates: public.network_modules, public.link_registry, public.green_node_access_logs, public.science_report_sources
- supabase/migrations/20260625_rc17_layout_isolation_green_node.sql | sha=7ddc7e52d5 | tables=0 | policies=0 DUPLICATE_OF=database/migrations/20260625_rc17_layout_isolation_green_node.sql

## LEGACY_REVIEW
- database/migrations/20260625_rc18_network_architecture_cleanup.sql | sha=5f83fd9727 | tables=2 | policies=0
  - creates: public.network_modules, public.editorial_policies
- database/migrations/20260625_rc19_milestones_data_governance.sql | sha=894345c3ba | tables=4 | policies=4
  - creates: public.platform_milestones, public.platform_milestone_tasks, public.service_backlog, public.community_progression_rules
- supabase/migrations/20260624071821_improve_rls_policies.sql.sql | sha=8f6c103e25 | tables=0 | policies=2
- supabase/migrations/20260625_rc18_network_architecture_cleanup.sql | sha=5f83fd9727 | tables=2 | policies=0 DUPLICATE_OF=database/migrations/20260625_rc18_network_architecture_cleanup.sql
  - creates: public.network_modules, public.editorial_policies
- supabase/migrations/20260625_rc19_milestones_data_governance.sql | sha=894345c3ba | tables=4 | policies=4 DUPLICATE_OF=database/migrations/20260625_rc19_milestones_data_governance.sql
  - creates: public.platform_milestones, public.platform_milestone_tasks, public.service_backlog, public.community_progression_rules
- supabase/migrations/20260624071821_improve_rls_policies.sql.sql | sha=8f6c103e25 | tables=0 | policies=2 DUPLICATE_OF=supabase/migrations/20260624071821_improve_rls_policies.sql.sql
- supabase/migrations/20260625_rc18_network_architecture_cleanup.sql | sha=5f83fd9727 | tables=2 | policies=0 DUPLICATE_OF=database/migrations/20260625_rc18_network_architecture_cleanup.sql
  - creates: public.network_modules, public.editorial_policies
- supabase/migrations/20260625_rc19_milestones_data_governance.sql | sha=894345c3ba | tables=4 | policies=4 DUPLICATE_OF=database/migrations/20260625_rc19_milestones_data_governance.sql
  - creates: public.platform_milestones, public.platform_milestone_tasks, public.service_backlog, public.community_progression_rules

## ROLES_XP
- database/migrations/20260625_v4_rc1_dynamic_news_roles.sql | sha=c0528164a6 | tables=7 | policies=6
  - creates: public.news_sources, public.external_news_items, public.user_xp_events, public.user_badges, public.moderation_assignments, public.article_comments, public.article_reactions
- supabase/migrations/20260625_v4_rc1_dynamic_news_roles.sql | sha=c0528164a6 | tables=7 | policies=6 DUPLICATE_OF=database/migrations/20260625_v4_rc1_dynamic_news_roles.sql
  - creates: public.news_sources, public.external_news_items, public.user_xp_events, public.user_badges, public.moderation_assignments, public.article_comments, public.article_reactions
- supabase/migrations/20260625_v4_rc1_dynamic_news_roles.sql | sha=c0528164a6 | tables=7 | policies=6 DUPLICATE_OF=database/migrations/20260625_v4_rc1_dynamic_news_roles.sql
  - creates: public.news_sources, public.external_news_items, public.user_xp_events, public.user_badges, public.moderation_assignments, public.article_comments, public.article_reactions

## SCIENCE
- database/migrations/20260625_rc11_network_science_green_node.sql | sha=1738540a27 | tables=4 | policies=4
  - creates: public.network_portals, public.science_reports, public.green_node_entries, public.green_node_access_logs
- supabase/migrations/20260625_rc11_network_science_green_node.sql | sha=1738540a27 | tables=4 | policies=4 DUPLICATE_OF=database/migrations/20260625_rc11_network_science_green_node.sql
  - creates: public.network_portals, public.science_reports, public.green_node_entries, public.green_node_access_logs
- supabase/migrations/20260625_rc11_network_science_green_node.sql | sha=1738540a27 | tables=4 | policies=4 DUPLICATE_OF=database/migrations/20260625_rc11_network_science_green_node.sql
  - creates: public.network_portals, public.science_reports, public.green_node_entries, public.green_node_access_logs

## SUPPORT
- supabase/migrations/20260625_rc12_network_polish.sql | sha=282c935702 | tables=3 | policies=3
  - creates: public.green_node_commands, public.science_evidence_sources, public.network_portal_events
- supabase/migrations/20260625_rc12_network_polish.sql | sha=282c935702 | tables=3 | policies=3 DUPLICATE_OF=supabase/migrations/20260625_rc12_network_polish.sql
  - creates: public.green_node_commands, public.science_evidence_sources, public.network_portal_events

## Safety notes
- This report does not execute SQL.
- Duplicate hashes indicate identical migration contents across database/ and supabase/.
- Keep current migrations frozen until Supabase target schema is explicitly selected.
