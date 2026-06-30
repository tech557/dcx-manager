import { createBrowserRouter } from 'react-router-dom';
import { BuilderPage } from './builder/BuilderPage';
import { RouteGuard } from '@/ui/auth/RouteGuard';
import { HomePage } from './pages/home/HomePage';
import { RootLayout } from './pages/RootLayout';
import { VersionPage } from './pages/version/VersionPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'version/:versionId', element: <VersionPage /> },
      {
        path: 'builder/:versionId',
        element: (
          <RouteGuard dcxId="dcx-1">
            <BuilderPage />
          </RouteGuard>
        ),
      },
    ],
  },
]);
