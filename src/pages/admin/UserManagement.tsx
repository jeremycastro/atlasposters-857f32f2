import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Shield, Edit, Briefcase, Eye, User } from 'lucide-react';
import { RoleManagementDialog } from '@/components/admin/RoleManagementDialog';
import { toast } from '@/hooks/use-toast';

type AppRole = Database['public']['Enums']['app_role'];

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: AppRole[];
}

const roleConfig: Record<AppRole, { label: string; icon: typeof Shield; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  admin: { label: 'Admin', icon: Shield, variant: 'destructive' },
  editor: { label: 'Editor', icon: Edit, variant: 'default' },
  partner: { label: 'Partner', icon: Briefcase, variant: 'secondary' },
  viewer: { label: 'Viewer', icon: Eye, variant: 'outline' },
  customer: { label: 'Customer', icon: User, variant: 'outline' },
};

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('is_active', true);

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles: UserProfile[] = profiles?.map(profile => ({
        ...profile,
        roles: userRoles?.filter(ur => ur.user_id === profile.id).map(ur => ur.role) || [],
      })) || [];

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error loading users',
        description: 'Failed to fetch user data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          user =>
            user.email.toLowerCase().includes(query) ||
            user.full_name?.toLowerCase().includes(query) ||
            user.roles.some(role => role.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, users]);

  const handleManageRoles = (user: UserProfile) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleRolesUpdated = () => {
    fetchUsers();
    setDialogOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage user roles and permissions</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name || 'Unknown'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length === 0 ? (
                        <span className="text-sm text-muted-foreground">No roles</span>
                      ) : (
                        user.roles.map((role) => {
                          const config = roleConfig[role];
                          const Icon = config.icon;
                          return (
                            <Badge key={role} variant={config.variant}>
                              <Icon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                          );
                        })
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManageRoles(user)}
                    >
                      Manage Roles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <RoleManagementDialog
          user={selectedUser}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onRolesUpdated={handleRolesUpdated}
        />
      )}
    </div>
  );
}
