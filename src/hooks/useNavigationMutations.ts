import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type NavigationInsert = Database['public']['Tables']['admin_navigation']['Insert'];
type NavigationUpdate = Database['public']['Tables']['admin_navigation']['Update'];

export const useNavigationMutations = () => {
  const queryClient = useQueryClient();

  const createNavItem = useMutation({
    mutationFn: async (navItem: Omit<NavigationInsert, 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('admin_navigation')
        .insert({
          ...navItem,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      queryClient.invalidateQueries({ queryKey: ['admin-navigation-all'] });
      toast({
        title: 'Navigation item created',
        description: 'The navigation item has been added successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating navigation item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateNavItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: NavigationUpdate }) => {
      const { data, error } = await supabase
        .from('admin_navigation')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      queryClient.invalidateQueries({ queryKey: ['admin-navigation-all'] });
      toast({
        title: 'Navigation item updated',
        description: 'Changes saved successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating navigation item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteNavItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admin_navigation')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      queryClient.invalidateQueries({ queryKey: ['admin-navigation-all'] });
      toast({
        title: 'Navigation item deleted',
        description: 'The navigation item has been removed',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting navigation item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const reorderNavItems = useMutation({
    mutationFn: async (items: { id: string; order_index: number; group_name: string | null }[]) => {
      const updates = items.map(item =>
        supabase
          .from('admin_navigation')
          .update({ order_index: item.order_index, group_name: item.group_name })
          .eq('id', item.id)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        throw new Error('Failed to reorder some items');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      queryClient.invalidateQueries({ queryKey: ['admin-navigation-all'] });
      toast({
        title: 'Navigation reordered',
        description: 'Changes saved successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error reordering navigation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    createNavItem,
    updateNavItem,
    deleteNavItem,
    reorderNavItems,
  };
};
