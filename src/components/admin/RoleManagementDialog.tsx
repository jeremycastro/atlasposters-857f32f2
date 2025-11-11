import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, Edit, Briefcase, Eye, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type AppRole = Database['public']['Enums']['app_role'];

interface RoleManagementDialogProps {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    roles: AppRole[];
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRolesUpdated: () => void;
}

const allRoles: { value: AppRole; label: string; icon: typeof Shield; description: string }[] = [
  {
    value: 'admin',
    label: 'Admin',
    icon: Shield,
    description: 'Full system access and user management',
  },
  {
    value: 'editor',
    label: 'Editor',
    icon: Edit,
    description: 'Can create and edit content',
  },
  {
    value: 'partner',
    label: 'Partner',
    icon: Briefcase,
    description: 'Partner portal access',
  },
  {
    value: 'viewer',
    label: 'Viewer',
    icon: Eye,
    description: 'Read-only access to content',
  },
  {
    value: 'customer',
    label: 'Customer',
    icon: User,
    description: 'Customer portal access',
  },
];

export function RoleManagementDialog({
  user,
  open,
  onOpenChange,
  onRolesUpdated,
}: RoleManagementDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<Set<AppRole>>(new Set(user.roles));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedRoles(new Set(user.roles));
  }, [user.roles]);

  const handleToggleRole = (role: AppRole) => {
    setSelectedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(role)) {
        newSet.delete(role);
      } else {
        newSet.add(role);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentRoles = new Set(user.roles);
      const rolesToAdd = Array.from(selectedRoles).filter(role => !currentRoles.has(role));
      const rolesToRemove = Array.from(currentRoles).filter(role => !selectedRoles.has(role));

      // Add new roles
      if (rolesToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert(
            rolesToAdd.map(role => ({
              user_id: user.id,
              role,
              is_active: true,
            }))
          );

        if (insertError) throw insertError;
      }

      // Remove roles by updating is_active to false
      if (rolesToRemove.length > 0) {
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .in('role', rolesToRemove);

        if (updateError) throw updateError;
      }

      // If user has no roles left and had a role session, update it to the first available role
      if (selectedRoles.size > 0) {
        const firstRole = Array.from(selectedRoles)[0];
        
        // Check if user has a role session
        const { data: session } = await supabase
          .from('user_role_sessions')
          .select('active_role')
          .eq('user_id', user.id)
          .single();

        // If the current active role is being removed, switch to first available role
        if (session && !selectedRoles.has(session.active_role)) {
          await supabase
            .from('user_role_sessions')
            .update({ active_role: firstRole })
            .eq('user_id', user.id);
        }
      }

      toast({
        title: 'Roles updated',
        description: `Successfully updated roles for ${user.email}`,
      });

      onRolesUpdated();
    } catch (error) {
      console.error('Error updating roles:', error);
      toast({
        title: 'Error updating roles',
        description: 'Failed to update user roles',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Roles</DialogTitle>
          <DialogDescription>
            Update roles for {user.full_name || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {allRoles.map((role) => {
            const Icon = role.icon;
            const isChecked = selectedRoles.has(role.value);

            return (
              <div
                key={role.value}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`role-${role.value}`}
                  checked={isChecked}
                  onCheckedChange={() => handleToggleRole(role.value)}
                />
                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor={`role-${role.value}`}
                    className="flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Icon className="h-4 w-4" />
                    {role.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
