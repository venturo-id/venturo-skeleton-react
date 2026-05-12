import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/shared/config';
import { TimeboxLayout } from 'src/layouts/timebox-layout';
import { LoadingScreen } from 'src/shared/ui/loading-screen';
import { AuthGuard } from 'src/module/core/features/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------
// Lazy load pages
// ----------------------------------------------------------------------

const InboxPage = lazy(() => import('src/module/timebox/features/inbox/pages'));
const TodayPage = lazy(() => import('src/module/timebox/features/today/pages'));
const UpcomingPage = lazy(() => import('src/module/timebox/features/upcoming/pages'));
const FiltersLabelsPage = lazy(() => import('src/module/timebox/features/filters/pages'));
const CompletedPage = lazy(() => import('src/module/timebox/features/completed/pages'));
const SearchPage = lazy(() => import('src/module/timebox/features/search/pages'));
const ProjectsPage = lazy(() => import('src/module/timebox/features/projects/pages'));
const ProjectDetailPage = lazy(() => import('src/module/timebox/features/projects/project-detail/pages'));
const LabelDetailPage = lazy(() => import('src/module/timebox/features/labels/label-detail/pages'));

// ----------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const timeboxLayout = () => (
  <TimeboxLayout>
    <SuspenseOutlet />
  </TimeboxLayout>
);

// ----------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------

export const timeboxRoutes: RouteObject[] = [
  {
    path: '/timebox',
    element: CONFIG.auth.skip ? timeboxLayout() : <AuthGuard>{timeboxLayout()}</AuthGuard>,
    children: [
      // Overview views
      { element: <InboxPage />, path: 'inbox' },
      { element: <TodayPage />, path: 'today' },
      { element: <UpcomingPage />, path: 'upcoming' },
      { element: <FiltersLabelsPage />, path: 'filters-labels' },
      { element: <CompletedPage />, path: 'completed' },
      { element: <SearchPage />, path: 'search' },

      // Projects
      { element: <ProjectsPage />, path: 'projects' },
      { element: <ProjectDetailPage />, path: 'project/:id' },

      // Labels
      { element: <LabelDetailPage />, path: 'label/:id' },

      // Default redirect to inbox
      { index: true, element: <InboxPage /> },
    ],
  },
];
