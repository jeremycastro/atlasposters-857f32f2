import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDomain } from '@/contexts/DomainContext';
import { Button } from '@/components/ui/button';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut,
  Shield,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/account', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/account/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/account/settings', label: 'Settings', icon: Settings },
];

export default function CustomerAccountLayout() {
  const { profile, signOut, availableRoles } = useAuth();
  const { getExternalDashboardUrl, isDevelopment } = useDomain();
  const location = useLocation();

  const hasAdminAccess = availableRoles.some(r => 
    ['admin', 'editor', 'viewer', 'partner'].includes(r)
  );

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleAdminDashboard = () => {
    const url = getExternalDashboardUrl();
    if (isDevelopment) {
      // In development, use client-side navigation
      window.location.href = url;
    } else {
      // In production, open external domain
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 flex flex-col">
        <div className="p-6">
          <Link to="/" className="block">
            <h2 className="text-lg font-bold">Atlas Posters</h2>
          </Link>
          <p className="text-sm text-muted-foreground">My Account</p>
        </div>

        <RoleSwitcher className="mx-4 mb-4" />
        
        <nav className="flex-1 space-y-1 px-4">
          {navItems.map(({ path, label, icon: Icon, exact }) => (
            <Link key={path} to={path}>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start",
                  isActive(path, exact) && "bg-accent"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
          
          {hasAdminAccess && (
            <>
              <div className="my-4 border-t" />
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={handleAdminDashboard}
              >
                <span className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </nav>

        <div className="p-4 border-t">
          <div className="mb-4">
            <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
          </div>
          <Button variant="outline" className="w-full" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
