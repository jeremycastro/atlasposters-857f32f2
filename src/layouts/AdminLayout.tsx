import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { LayoutDashboard, CheckSquare, Users, LogOut, Map, GitBranch, Code2 } from 'lucide-react';

export default function AdminLayout() {
  const { profile, activeRole, signOut } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Fixed */}
      <aside className="w-64 border-r bg-muted/40 fixed left-0 top-0 h-screen flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">Atlas Admin</h2>
          <p className="text-sm text-muted-foreground">Role: {activeRole}</p>
        </div>

        <RoleSwitcher className="mx-4 my-4" />
        
        <nav className="space-y-2 px-4 flex-1 overflow-y-auto">
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
          
          <Link to="/admin/roadmap">
            <Button variant="ghost" className="w-full justify-start">
              <Map className="mr-2 h-4 w-4" />
              Roadmap
            </Button>
          </Link>
          
          <Link to="/admin/changelog">
            <Button variant="ghost" className="w-full justify-start">
              <GitBranch className="mr-2 h-4 w-4" />
              Changelog
            </Button>
          </Link>
          
          <Link to="/admin/techstack">
            <Button variant="ghost" className="w-full justify-start">
              <Code2 className="mr-2 h-4 w-4" />
              Tech Stack
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

        <div className="p-4 border-t mt-auto">
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

      {/* Main content - Offset by sidebar width */}
      <main className="flex-1 ml-64">
        <Outlet />
      </main>
    </div>
  );
}
