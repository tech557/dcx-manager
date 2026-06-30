import { Outlet, useLocation } from 'react-router-dom';

export function RootLayout() {
  const location = useLocation();
  const isBuilder = location.pathname.startsWith('/builder');
  return (
    <main className={`app-shell ${isBuilder ? 'h-screen overflow-hidden flex flex-col' : ''}`}>
      <Outlet />
    </main>
  );
}
