import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { LayoutDashboard, LogOut } from 'lucide-react';

export default function PartnerLayout() {
  const { profile, signOut } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="p-6">
          <h2 className="text-lg font-bold">Partner Portal</h2>
          <p className="text-sm text-muted-foreground">{profile?.partner_company_name}</p>
        </div>

        <RoleSwitcher className="mx-4 mb-4" />
        
        <nav className="space-y-2 px-4">
          <Link to="/partner/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="mb-4">
            <p className="text-sm font-medium">{profile?.full_name}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          </div>
          <Button variant="outline" className="w-full" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
