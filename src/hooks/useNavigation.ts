import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type NavigationItem = Database['public']['Tables']['admin_navigation']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

export const useNavigation = (activeRole?: AppRole) => {
  return useQuery({
    queryKey: ['admin-navigation', activeRole],
    queryFn: async () => {
      let query = supabase
        .from('admin_navigation')
        .select('*')
        .eq('is_active', true)
        .order('group_order')
        .order('order_index');

      const { data, error } = await query;

      if (error) throw error;

      // Filter by role if provided
      const filteredData = activeRole
        ? data.filter(item => item.visible_to_roles.includes(activeRole))
        : data;

      // Group by section and preserve order
      const grouped = filteredData.reduce((acc, item) => {
        const group = item.group_name || 'Other';
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(item);
        return acc;
      }, {} as Record<string, NavigationItem[]>);

      // Sort groups by the minimum group_order of their items
      const sortedGroups = Object.entries(grouped).sort(([, aItems], [, bItems]) => {
        const aOrder = Math.min(...aItems.map(i => i.group_order || 999));
        const bOrder = Math.min(...bItems.map(i => i.group_order || 999));
        return aOrder - bOrder;
      });

      const sortedGrouped = Object.fromEntries(sortedGroups);

      return { items: filteredData, grouped: sortedGrouped };
    },
  });
};

export const useAllNavigation = () => {
  return useQuery({
    queryKey: ['admin-navigation-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_navigation')
        .select('*')
        .order('group_order')
        .order('order_index');

      if (error) throw error;

      // Group by section and preserve order
      const grouped = data.reduce((acc, item) => {
        const group = item.group_name || 'Other';
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(item);
        return acc;
      }, {} as Record<string, NavigationItem[]>);

      // Sort groups by the minimum group_order of their items
      const sortedGroups = Object.entries(grouped).sort(([, aItems], [, bItems]) => {
        const aOrder = Math.min(...aItems.map(i => i.group_order || 999));
        const bOrder = Math.min(...bItems.map(i => i.group_order || 999));
        return aOrder - bOrder;
      });

      const sortedGrouped = Object.fromEntries(sortedGroups);

      return { items: data, grouped: sortedGrouped };
    },
  });
};
