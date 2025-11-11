import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { LogOut } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const { profile, activeRole, signOut } = useAuth();
  const { data: navData, isLoading } = useNavigation(activeRole);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

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
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : navData?.grouped ? (
            Object.entries(navData.grouped).map(([groupName, items]) => (
              <Collapsible
                key={groupName}
                open={openGroups[groupName] !== false}
                onOpenChange={() => toggleGroup(groupName)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between text-xs font-semibold text-muted-foreground hover:text-foreground">
                    {groupName}
                    <ChevronDown className={`h-4 w-4 transition-transform ${openGroups[groupName] === false ? '' : 'rotate-180'}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {items.map(item => {
                    const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Circle;
                    return (
                      <Link key={item.id} to={item.route}>
                        <Button variant="ghost" className="w-full justify-start">
                          <IconComponent className="mr-2 h-4 w-4" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            ))
          ) : null}
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
