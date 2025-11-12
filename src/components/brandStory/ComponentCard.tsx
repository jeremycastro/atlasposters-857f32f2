import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandStoryComponent, COMPONENT_TYPE_LABELS } from "@/types/brandStory";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ComponentCardProps {
  component: BrandStoryComponent;
  onView?: (component: BrandStoryComponent) => void;
  onEdit?: (component: BrandStoryComponent) => void;
  onDelete?: (component: BrandStoryComponent) => void;
}

export const ComponentCard = ({ component, onView, onEdit, onDelete }: ComponentCardProps) => {
  const truncateContent = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {COMPONENT_TYPE_LABELS[component.component_type]}
              </Badge>
              <span className="text-xs text-muted-foreground">v{component.version_number}</span>
            </div>
            <CardTitle className="text-lg line-clamp-1">{component.title}</CardTitle>
            {component.subtitle && (
              <CardDescription className="line-clamp-1">{component.subtitle}</CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(component)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(component)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete(component)} className="text-destructive">
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {truncateContent(component.content)}
        </p>
        <div className="flex items-center justify-between">
          <StatusBadge status={component.status} />
          {component.tags.length > 0 && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};
