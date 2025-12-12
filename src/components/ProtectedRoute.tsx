import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { user, activeRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !user) {
    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  // Check if user has required role
  if (allowedRoles && allowedRoles.length > 0 && activeRole) {
    if (!allowedRoles.includes(activeRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page with your current role.
            </p>
            <p className="text-sm text-muted-foreground">
              Current role: <span className="font-semibold">{activeRole}</span>
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
