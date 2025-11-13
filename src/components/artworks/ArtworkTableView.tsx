import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ArrowUpDown, Copy, Settings2, GripVertical, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Artwork = Database["public"]["Tables"]["artworks"]["Row"] & {
  brand?: {
    id: string;
    brand_name: string;
    partner?: {
      id: string;
      partner_name: string;
    } | null;
  } | null;
  created_by_profile?: {
    full_name: string | null;
    email: string;
  } | null;
  artwork_files?: Array<{
    id: string;
    file_path: string;
    is_primary: boolean;
    file_type: string;
    mime_type: string | null;
  }>;
};

interface ArtworkTableViewProps {
  artworks: Artwork[];
  onView: (artwork: Artwork) => void;
  onEdit: (artwork: Artwork) => void;
  onArchive: (artwork: Artwork) => void;
  searchBar?: React.ReactNode;
}

type SortField = "asc_code" | "title" | "artist_name" | "status" | "created_at" | null;
type SortDirection = "asc" | "desc";

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  canHide: boolean;
  sortable: boolean;
  sortField?: SortField;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "thumbnail", label: "Thumbnail", visible: true, canHide: false, sortable: false },
  { id: "asc_code", label: "ASC Code", visible: true, canHide: false, sortable: true, sortField: "asc_code" },
  { id: "title", label: "Title", visible: true, canHide: true, sortable: true, sortField: "title" },
  { id: "artist_name", label: "Artist", visible: true, canHide: true, sortable: true, sortField: "artist_name" },
  { id: "brand", label: "Brand", visible: true, canHide: true, sortable: false },
  { id: "partner", label: "Partner", visible: true, canHide: true, sortable: false },
  { id: "status", label: "Status", visible: true, canHide: true, sortable: true, sortField: "status" },
  { id: "year_created", label: "Year", visible: true, canHide: true, sortable: false },
  { id: "rights_period", label: "Rights Period", visible: true, canHide: true, sortable: false },
  { id: "created_at", label: "Created", visible: true, canHide: true, sortable: true, sortField: "created_at" },
  { id: "actions", label: "Actions", visible: true, canHide: false, sortable: false },
];

const STORAGE_KEY = "artwork-table-columns";

interface SortableHeaderProps {
  column: ColumnConfig;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

function SortableHeader({ column, sortField, sortDirection, onSort }: SortableHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableHead ref={setNodeRef} style={style} className="relative group">
      <div className="flex items-center gap-2">
        <button
          className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-muted-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {column.sortable ? (
          <button
            onClick={() => onSort(column.sortField!)}
            className="flex items-center gap-1 hover:text-foreground"
          >
            {column.label}
            {sortField === column.sortField && (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span>{column.label}</span>
        )}
      </div>
    </TableHead>
  );
}

export function ArtworkTableView({ artworks, onView, onEdit, onArchive, searchBar }: ArtworkTableViewProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load column preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { order, visibility } = JSON.parse(stored);
        
        // Restore order and visibility
        const restoredColumns = order.map((id: string) => {
          const defaultCol = DEFAULT_COLUMNS.find(c => c.id === id);
          if (!defaultCol) return null;
          return {
            ...defaultCol,
            visible: visibility[id] ?? defaultCol.visible,
          };
        }).filter(Boolean);

        // Add any new columns that weren't in stored config
        DEFAULT_COLUMNS.forEach(col => {
          if (!order.includes(col.id)) {
            restoredColumns.push(col);
          }
        });

        setColumns(restoredColumns);
      } catch (e) {
        console.error("Failed to restore column preferences", e);
      }
    }
  }, []);

  // Save column preferences to localStorage
  const saveColumnPreferences = (cols: ColumnConfig[]) => {
    const order = cols.map(c => c.id);
    const visibility = cols.reduce((acc, col) => {
      acc[col.id] = col.visible;
      return acc;
    }, {} as Record<string, boolean>);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ order, visibility }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumns((cols) => {
        const oldIndex = cols.findIndex(c => c.id === active.id);
        const newIndex = cols.findIndex(c => c.id === over.id);
        const newColumns = arrayMove(cols, oldIndex, newIndex);
        saveColumnPreferences(newColumns);
        return newColumns;
      });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(cols => {
      const newColumns = cols.map(col =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      );
      saveColumnPreferences(newColumns);
      return newColumns;
    });
  };

  const resetColumns = () => {
    setColumns(DEFAULT_COLUMNS);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Column settings reset to default");
  };

  const sortedArtworks = [...artworks].sort((a, b) => {
    if (!sortField) return 0;

    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      draft: "outline",
      active: "default",
      archived: "secondary",
    };
    return variants[status] || "outline";
  };

  const getThumbnailUrl = (artwork: Artwork) => {
    if (!artwork.artwork_files || artwork.artwork_files.length === 0) return null;

    // Look for primary file first, then any image file
    const primaryImage = artwork.artwork_files.find(f => f.is_primary);
    const fallbackImage = artwork.artwork_files.find(f => 
      f.mime_type?.startsWith('image/')
    );
    const file = primaryImage || fallbackImage;

    if (!file) return null;

    const { data } = supabase.storage.from("brand-assets").getPublicUrl(file.file_path);
    return data.publicUrl;
  };

  const visibleColumns = columns.filter(c => c.visible);

  const renderCell = (column: ColumnConfig, artwork: Artwork) => {
    switch (column.id) {
      case "thumbnail":
        const thumbnailUrl = getThumbnailUrl(artwork);
        return (
          <TableCell onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onView(artwork)}
              className="w-12 h-12 rounded border border-border flex items-center justify-center overflow-hidden bg-muted hover:border-primary transition-colors"
            >
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </button>
          </TableCell>
        );

      case "asc_code":
        return (
          <TableCell className="font-mono">
            <div className="flex items-center gap-2">
              <span>{artwork.asc_code}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(artwork.asc_code);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </TableCell>
        );

      case "title":
        return <TableCell className="font-medium">{artwork.title}</TableCell>;

      case "artist_name":
        return <TableCell>{artwork.artist_name || "—"}</TableCell>;

      case "brand":
        return <TableCell>{artwork.brand?.brand_name || "—"}</TableCell>;

      case "partner":
        return <TableCell>{artwork.brand?.partner?.partner_name || "—"}</TableCell>;

      case "status":
        return (
          <TableCell>
            <Badge variant={getStatusVariant(artwork.status || "draft")}>
              {artwork.status}
            </Badge>
          </TableCell>
        );

      case "year_created":
        return <TableCell>{artwork.year_created || "—"}</TableCell>;

      case "rights_period":
        return (
          <TableCell>
            {artwork.rights_start_date && artwork.rights_end_date
              ? `${format(new Date(artwork.rights_start_date), "MMM yyyy")} - ${format(new Date(artwork.rights_end_date), "MMM yyyy")}`
              : "—"}
          </TableCell>
        );

      case "created_at":
        return (
          <TableCell>
            {format(new Date(artwork.created_at!), "MMM d, yyyy")}
          </TableCell>
        );

      case "actions":
        return (
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(artwork);
                  }}
                >
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(artwork);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(artwork);
                  }}
                  className="text-destructive"
                >
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        );

      default:
        return <TableCell>—</TableCell>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {searchBar && <div className="flex-1">{searchBar}</div>}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {columns.filter(c => c.canHide).map(column => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.visible}
                onCheckedChange={() => toggleColumnVisibility(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={resetColumns}>
              Reset to Default
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={visibleColumns.map(c => c.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {visibleColumns.map(column => (
                    <SortableHeader
                      key={column.id}
                      column={column}
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedArtworks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="text-center text-muted-foreground py-8"
                >
                  No artworks found
                </TableCell>
              </TableRow>
            ) : (
              sortedArtworks.map((artwork) => (
                <TableRow
                  key={artwork.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onView(artwork)}
                >
                  {visibleColumns.map(column => renderCell(column, artwork))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
