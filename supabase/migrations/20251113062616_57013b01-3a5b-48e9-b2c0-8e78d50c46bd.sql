-- Add Tag Management to admin navigation
INSERT INTO admin_navigation (
  label,
  route,
  icon,
  group_name,
  order_index,
  group_order,
  visible_to_roles,
  is_active
) VALUES (
  'Tag Management',
  '/admin/tag-management',
  'Tags',
  'System',
  10,
  60,
  ARRAY['admin', 'editor']::app_role[],
  true
);