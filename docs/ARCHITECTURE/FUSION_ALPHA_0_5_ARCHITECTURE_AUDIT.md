# XETHKIOZ Fusion Alpha 0.5 Architecture Audit
Generated: 2026-06-27T00:03:12.679Z

## Public route map
- / -> Home
- /gaming -> GamingHub
- /science -> ScienceLab
- /fun -> FunPortal
- /green-node -> GreenNode
- /news -> Navigate
- /community -> Navigate
- /admin -> Navigate
- /cms -> Navigate
- * -> NotFound

## Legacy redirects
- /news -> /gaming
- /community -> /fun
- /admin -> /
- /cms -> /

## Global shell components
- Header
- Analytics
- ScrollToTop
- AppErrorBoundary

## Page classification
- src/pages/About.tsx | LEGACY_OR_INTERNAL
- src/pages/Admin.tsx | LEGACY_OR_INTERNAL
- src/pages/AILab.tsx | LEGACY_OR_INTERNAL
- src/pages/ArticlePage.tsx | LEGACY_OR_INTERNAL
- src/pages/AuthorProfile.tsx | LEGACY_OR_INTERNAL
- src/pages/Authors.tsx | LEGACY_OR_INTERNAL
- src/pages/ChatOverlayPage.tsx | LEGACY_OR_INTERNAL
- src/pages/CmsStudio.tsx | LEGACY_OR_INTERNAL
- src/pages/ComingSoon.tsx | LEGACY_OR_INTERNAL
- src/pages/Community.tsx | LEGACY_OR_INTERNAL
- src/pages/CommunityFeature.tsx | LEGACY_OR_INTERNAL
- src/pages/Contact.tsx | LEGACY_OR_INTERNAL
- src/pages/ContentSystem.tsx | LEGACY_OR_INTERNAL
- src/pages/CreatorAccount.tsx | LEGACY_OR_INTERNAL
- src/pages/CreatorDashboard.tsx | LEGACY_OR_INTERNAL
- src/pages/CreatorStudio.tsx | LEGACY_OR_INTERNAL
- src/pages/FinalQA.tsx | LEGACY_OR_INTERNAL
- src/pages/FunPortal.tsx | PUBLIC_ROUTE
- src/pages/GamingHub.tsx | PUBLIC_ROUTE
- src/pages/GreenNode.tsx | PUBLIC_ROUTE
- src/pages/Home.tsx | PUBLIC_ROUTE
- src/pages/LiveChecklist.tsx | LEGACY_OR_INTERNAL
- src/pages/Maintenance.tsx | LEGACY_OR_INTERNAL
- src/pages/Media.tsx | LEGACY_OR_INTERNAL
- src/pages/Milestones.tsx | LEGACY_OR_INTERNAL
- src/pages/Network.tsx | LEGACY_OR_INTERNAL
- src/pages/News.tsx | LEGACY_OR_INTERNAL
- src/pages/NewsEngine.tsx | LEGACY_OR_INTERNAL
- src/pages/NotFound.tsx | PUBLIC_ROUTE
- src/pages/RolesDashboard.tsx | LEGACY_OR_INTERNAL
- src/pages/ScienceLab.tsx | PUBLIC_ROUTE
- src/pages/Streaming.tsx | LEGACY_OR_INTERNAL
- src/pages/Support.tsx | LEGACY_OR_INTERNAL
- src/pages/TechLab.tsx | LEGACY_OR_INTERNAL

## Counts
- pages: 34
- public route pages: 6
- legacy/internal pages: 28
- components: 35
- libs: 15

## Safety decision
- Do not delete legacy/internal files in Alpha 0.5. They remain quarantined until Fusion 0.6/0.7 decides which modules are recovered, archived, or rewritten.
- Public runtime must stay limited to Home, Gaming, Science, Fun, Green Node, global controls and safe redirects.
