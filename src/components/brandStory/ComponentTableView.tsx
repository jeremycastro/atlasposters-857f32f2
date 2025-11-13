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
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { BrandStoryComponent, COMPONENT_TYPE_LABELS } from "@/types/brandStory";
import { StatusBadge } from "./StatusBadge";

interface ComponentTableViewProps {
  components: BrandStoryComponent[];
  onViewComponent: (component: BrandStoryComponent) => void;
  onEditComponent?: (component: BrandStoryComponent) => void;
  onDeleteComponent?: (component: BrandStoryComponent) => void;
}

export const ComponentTableView = ({ 
  components, 
  onViewComponent, 
  onEditComponent,
  onDeleteComponent 
}: ComponentTableViewProps) => {
  return (
    <div className="border border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No components yet. Create your first component to get started!
              </TableCell>
            </TableRow>
          ) : (
            components.map((component) => (
              <TableRow
                key={component.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewComponent(component)}
              >
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {COMPONENT_TYPE_LABELS[component.component_type]}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium max-w-xs">
                  <div className="line-clamp-1">{component.title}</div>
                  {component.subtitle && (
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {component.subtitle}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={component.status} />
                </TableCell>
                <TableCell>
                  <span className="text-sm">v{component.version_number}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {component.brand_id ? "Brand" : "Global"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {component.tags.length > 0 ? (
                    <div className="flex gap-1">
                      {component.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {component.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{component.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No tags</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {format(new Date(component.updated_at), "MMM d, yyyy")}
                  </span>
                </TableCell>
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
                          onViewComponent(component); 
                        }}
                      >
                        View
                      </DropdownMenuItem>
                      {onEditComponent && (
                        <DropdownMenuItem 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onEditComponent(component); 
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDeleteComponent && (
                        <DropdownMenuItem
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onDeleteComponent(component); 
                          }}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
