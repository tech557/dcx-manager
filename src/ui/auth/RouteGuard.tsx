import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { QUERY_KEYS } from '@/queries/QUERY_KEYS';
import { checkDCXAccess, getMyAccess } from '@/services/access.service';
import { isRealBackendEnabled } from '@/services/supabase-client';
import { onAuthStateChange } from '@/services/supabase-auth';
import { LoginRedirect } from './LoginRedirect';
import { NoAccessScreen } from './NoAccessScreen';

interface RouteGuardProps extends PropsWithChildren {
  dcxId: string;
}

export function RouteGuard({ dcxId, children }: RouteGuardProps) {
  const queryClient = useQueryClient();
  const accessQuery = useQuery({
    queryKey: QUERY_KEYS.access.me,
    queryFn: getMyAccess,
  });

  // Real-backend only: mock's getMyAccess never depends on a live session, and
  // the Supabase client throws if VITE_SUPABASE_URL/ANON_KEY aren't set, so
  // this must stay off unless the flag is on (PAC-R2 flag contract).
  useEffect(() => {
    if (!isRealBackendEnabled()) return;
    return onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.access.me });
    });
  }, [queryClient]);

  const dcxAccessQuery = useQuery({
    queryKey: QUERY_KEYS.access.dcx(dcxId),
    queryFn: () => checkDCXAccess(dcxId),
    enabled: accessQuery.data?.isAuthenticated === true,
  });

  if (accessQuery.isPending || (accessQuery.data?.isAuthenticated && dcxAccessQuery.isPending)) {
    return (
      <section className="placeholder-screen" role="status">
        <p className="eyebrow">Checking Access</p>
        <h1>Opening Builder</h1>
        <p>Confirming authentication and DCX access before loading the workspace.</p>
      </section>
    );
  }

  if (!accessQuery.data?.isAuthenticated) {
    return <LoginRedirect />;
  }

  if (!dcxAccessQuery.data?.hasAccess) {
    return <NoAccessScreen />;
  }

  return children;
}
