import {Navigate, Outlet} from 'react-router-dom';
import { useMe } from '@/hooks/use-me';
import { useAuth } from '@/lib/auth-context';

export const ProtectedRoute = () => {
    const { token } = useAuth();
    const { isLoading, isError } = useMe();

    if(!token) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        <div className="flex min-h-screen items-center justify-center text-slate-600">
        Loading…
      </div>
    }

    if (isError) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}