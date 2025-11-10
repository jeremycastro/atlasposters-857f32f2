import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, CheckSquare, Users, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { profile, activeRole, signOut } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="p-6">
          <h2 className="text-lg font-bold">Atlas Admin</h2>
          <p className="text-sm text-muted-foreground">Role: {activeRole}</p>
        </div>
        
        <nav className="space-y-2 px-4">
          <Link to="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          
          <Link to="/admin/tasks">
            <Button variant="ghost" className="w-full justify-start">
              <CheckSquare className="mr-2 h-4 w-4" />
              Task Manager
            </Button>
          </Link>
          
          {activeRole === 'admin' && (
            <Link to="/admin/users">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                User Management
              </Button>
            </Link>
          )}
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
