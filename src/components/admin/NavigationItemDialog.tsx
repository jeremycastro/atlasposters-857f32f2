import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigationMutations } from '@/hooks/useNavigationMutations';
import { Database } from '@/integrations/supabase/types';
import { useState, useEffect } from 'react';

type NavigationItem = Database['public']['Tables']['admin_navigation']['Row'];

const LUCIDE_ICONS = [
  'LayoutDashboard', 'CheckSquare', 'Map', 'GitBranch', 'Code2',
  'Image', 'Users', 'Settings', 'Package', 'ShoppingCart',
  'FileText', 'Folder', 'Database', 'Cloud', 'Lock'
];

const navItemSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  icon: z.string().min(1, 'Icon is required'),
  route: z.string().min(1, 'Route is required').startsWith('/admin/', 'Route must start with /admin/'),
  group_name: z.string().optional(),
  order_index: z.coerce.number().int().min(0),
  is_active: z.boolean().default(true),
  visible_to_admin: z.boolean().default(true),
  visible_to_editor: z.boolean().default(false),
  visible_to_viewer: z.boolean().default(false),
});

type NavItemFormValues = z.infer<typeof navItemSchema>;

interface NavigationItemDialogProps {
  item?: NavigationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavigationItemDialog = ({ item, open, onOpenChange }: NavigationItemDialogProps) => {
  const { createNavItem, updateNavItem } = useNavigationMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NavItemFormValues>({
    resolver: zodResolver(navItemSchema),
    defaultValues: {
      label: '',
      icon: 'LayoutDashboard',
      route: '/admin/',
      order_index: 0,
      is_active: true,
      visible_to_admin: true,
      visible_to_editor: false,
      visible_to_viewer: false,
    },
  });

  // Reset form when item or dialog open state changes
  useEffect(() => {
    if (open) {
      if (item) {
        form.reset({
          label: item.label,
          icon: item.icon,
          route: item.route,
          group_name: item.group_name || undefined,
          order_index: item.order_index,
          is_active: item.is_active,
          visible_to_admin: item.visible_to_roles.includes('admin'),
          visible_to_editor: item.visible_to_roles.includes('editor'),
          visible_to_viewer: item.visible_to_roles.includes('viewer'),
        });
      } else {
        form.reset({
          label: '',
          icon: 'LayoutDashboard',
          route: '/admin/',
          order_index: 0,
          is_active: true,
          visible_to_admin: true,
          visible_to_editor: false,
          visible_to_viewer: false,
        });
      }
    }
  }, [item, open, form]);

  const onSubmit = async (values: NavItemFormValues) => {
    setIsSubmitting(true);
    try {
      const visible_to_roles: Database['public']['Enums']['app_role'][] = [];
      if (values.visible_to_admin) visible_to_roles.push('admin');
      if (values.visible_to_editor) visible_to_roles.push('editor');
      if (values.visible_to_viewer) visible_to_roles.push('viewer');

      const navData = {
        label: values.label,
        icon: values.icon,
        route: values.route,
        group_name: values.group_name || null,
        order_index: values.order_index,
        is_active: values.is_active,
        visible_to_roles,
      };

      if (item) {
        await updateNavItem.mutateAsync({ id: item.id, updates: navData });
      } else {
        await createNavItem.mutateAsync(navData);
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving navigation item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Navigation Item' : 'Create Navigation Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update the navigation item details' : 'Add a new item to the admin navigation'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label *</FormLabel>
                    <FormControl>
                      <Input placeholder="Dashboard" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LUCIDE_ICONS.map(icon => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Lucide icon name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route *</FormLabel>
                  <FormControl>
                    <Input placeholder="/admin/dashboard" {...field} />
                  </FormControl>
                  <FormDescription>Must start with /admin/</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="group_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group/Section</FormLabel>
                    <FormControl>
                      <Input placeholder="Content" {...field} />
                    </FormControl>
                    <FormDescription>Optional grouping</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Index</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Lower numbers appear first</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel>Visible to Roles</FormLabel>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="visible_to_admin"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Admin</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visible_to_editor"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Editor</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visible_to_viewer"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Viewer</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">Active (visible in navigation)</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
