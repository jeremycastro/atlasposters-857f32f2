import { useState } from 'react';
import { useAllNavigation } from '@/hooks/useNavigation';
import { useNavigationMutations } from '@/hooks/useNavigationMutations';
import { NavigationItemDialog } from '@/components/admin/NavigationItemDialog';
import { RenameGroupDialog } from '@/components/admin/RenameGroupDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, GripHorizontal, Pencil } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as LucideIcons from 'lucide-react';

type NavigationItem = Database['public']['Tables']['admin_navigation']['Row'];

const SortableNavItem = ({ item, onEdit, onDelete }: { item: NavigationItem; onEdit: () => void; onDelete: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Circle;

  return (
    <div ref={setNodeRef} style={style} className="bg-card border rounded-lg p-4 flex items-center gap-3">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <IconComponent className="h-5 w-5 text-muted-foreground" />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.label}</span>
          {!item.is_active && <EyeOff className="h-4 w-4 text-muted-foreground" />}
        </div>
        <p className="text-sm text-muted-foreground">{item.route}</p>
      </div>

      <div className="flex gap-1 flex-wrap">
        {item.visible_to_roles.map(role => (
          <Badge key={role} variant="secondary" className="text-xs">
            {role}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

const SortableGroupCard = ({ 
  groupName, 
  items, 
  onEdit, 
  onDelete,
  onRename,
}: { 
  groupName: string; 
  items: NavigationItem[]; 
  onEdit: (item: NavigationItem) => void;
  onDelete: (item: NavigationItem) => void;
  onRename: (groupName: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: `group-${groupName}` 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleItemDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      // This will be handled by the parent component
    }
  };

  return (
    <Card ref={setNodeRef} style={style}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripHorizontal className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>{groupName}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => onRename(groupName)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            <CardDescription>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd}>
          <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map(item => (
                <SortableNavItem
                  key={item.id}
                  item={item}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

export default function NavigationManager() {
  const { data, isLoading } = useAllNavigation();
  const { reorderNavItems, reorderGroups, deleteNavItem, renameGroup } = useNavigationMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NavigationItem | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [groupToRename, setGroupToRename] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleGroupDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id && data?.grouped) {
      const groupNames = Object.keys(data.grouped);
      const activeGroupName = active.id.replace('group-', '');
      const overGroupName = over.id.replace('group-', '');

      const oldIndex = groupNames.indexOf(activeGroupName);
      const newIndex = groupNames.indexOf(overGroupName);

      const reorderedGroups = arrayMove(groupNames, oldIndex, newIndex);
      
      // Update group_order for all items in each group
      const updates = reorderedGroups.map((groupName, index) => ({
        groupName,
        order: index + 1,
        itemIds: data.grouped[groupName].map(item => item.id),
      }));

      reorderGroups.mutate(updates);
    }
  };

  const handleItemDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id && data?.items) {
      const oldIndex = data.items.findIndex(item => item.id === active.id);
      const newIndex = data.items.findIndex(item => item.id === over.id);

      const reorderedItems = arrayMove(data.items, oldIndex, newIndex);
      
      // Update order_index for all items
      const updates = reorderedItems.map((item, index) => ({
        id: item.id,
        order_index: index + 1,
        group_name: item.group_name,
      }));

      reorderNavItems.mutate(updates);
    }
  };

  const handleEdit = (item: NavigationItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleDelete = (item: NavigationItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteNavItem.mutateAsync(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleRenameGroup = (groupName: string) => {
    setGroupToRename(groupName);
    setRenameDialogOpen(true);
  };

  const confirmRename = async (newName: string) => {
    if (groupToRename && newName !== groupToRename) {
      await renameGroup.mutateAsync({ oldName: groupToRename, newName });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Navigation Configuration</h1>
          <p className="text-muted-foreground">
            Manage admin navigation links, groups, and visibility
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleGroupDragEnd}>
        <SortableContext 
          items={data?.grouped ? Object.keys(data.grouped).map(name => `group-${name}`) : []} 
          strategy={verticalListSortingStrategy}
        >
          {data?.grouped && Object.entries(data.grouped).map(([groupName, items]) => (
            <SortableGroupCard
              key={groupName}
              groupName={groupName}
              items={items}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRename={handleRenameGroup}
            />
          ))}
        </SortableContext>
      </DndContext>

      <NavigationItemDialog
        item={selectedItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <RenameGroupDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentName={groupToRename}
        onRename={confirmRename}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Navigation Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.label}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
