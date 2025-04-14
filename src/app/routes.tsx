
import { RouteConfig } from '@/router/AppRouter';
import RootLayout from './layout';
import HomePage from './page';
import NotFoundPage from './not-found';

// Define all routes for the application
export const routes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
    layout: RootLayout
  },
  {
    path: '*',
    component: NotFoundPage,
    layout: RootLayout
  }
];
