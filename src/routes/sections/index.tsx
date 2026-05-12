import type { RouteObject } from 'react-router';

import { lazy } from 'react';

import { authRoutes } from './auth';
import { timeboxRoutes } from './timebox';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/module/core/features/error/pages/404'));

export const routesSection: RouteObject[] = [
  // Auth
  ...authRoutes,

  // Dashboard (mounted at '/')
  ...dashboardRoutes,

  // Timebox (mounted at '/timebox')
  ...timeboxRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
