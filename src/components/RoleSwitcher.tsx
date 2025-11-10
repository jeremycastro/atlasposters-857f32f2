import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, Edit, Briefcase, Eye, User } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface RoleSwitcherProps {
  className?: string;
}

const roleConfig: Record<AppRole, { label: string; icon: typeof Shield; path: string }> = {
  admin: { label: 'Admin', icon: Shield, path: '/admin/dashboard' },
  editor: { label: 'Editor', icon: Edit, path: '/admin/dashboard' },
  partner: { label: 'Partner', icon: Briefcase, path: '/partner/dashboard' },
  viewer: { label: 'Viewer', icon: Eye, path: '/admin/dashboard' },
  customer: { label: 'Customer', icon: User, path: '/customer/dashboard' },
};

export const RoleSwitcher = ({ className }: RoleSwitcherProps) => {
  const { activeRole, availableRoles, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isSwitching, setIsSwitching] = useState(false);

  if (!activeRole || availableRoles.length <= 1) {
    return null;
  }

  const handleRoleChange = async (newRole: string) => {
    if (newRole === activeRole || isSwitching) return;

    setIsSwitching(true);
    try {
      await switchRole(newRole as AppRole);
      toast({
        title: 'Role switched',
        description: `You are now using the ${roleConfig[newRole as AppRole].label} role`,
      });
      navigate(roleConfig[newRole as AppRole].path);
    } catch (error) {
      toast({
        title: 'Failed to switch role',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const ActiveIcon = roleConfig[activeRole].icon;

  return (
    <div className={className}>
      <Select
        value={activeRole}
        onValueChange={handleRoleChange}
        disabled={isSwitching}
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <ActiveIcon className="h-4 w-4" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map((role) => {
            const Icon = roleConfig[role].icon;
            return (
              <SelectItem key={role} value={role}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{roleConfig[role].label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
