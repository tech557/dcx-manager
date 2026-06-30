import { useQuery } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { QUERY_KEYS } from '@/queries/QUERY_KEYS';
import { checkDCXAccess, getMyAccess } from '@/services/access.service';
import { LoginRedirect } from './LoginRedirect';
import { NoAccessScreen } from './NoAccessScreen';

interface RouteGuardProps extends PropsWithChildren {
  dcxId: string;
}

export function RouteGuard({ dcxId, children }: RouteGuardProps) {
  const accessQuery = useQuery({
    queryKey: QUERY_KEYS.access.me,
    queryFn: getMyAccess,
  });

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
