import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagPillProps {
  tag: {
    display_name: string;
    category_name?: string;
    source?: string;
    confidence_score?: number;
  };
  onRemove?: () => void;
  variant?: "default" | "secondary" | "outline" | "destructive";
  showSource?: boolean;
  className?: string;
}

export const TagPill = ({ 
  tag, 
  onRemove, 
  variant = "secondary",
  showSource = false,
  className 
}: TagPillProps) => {
  const isInherited = tag.source === 'inherited';
  const isAI = tag.source === 'ai';
  
  return (
    <Badge
      variant={variant}
      className={cn(
        "gap-1 py-1 px-2",
        isInherited && "border-dashed opacity-70",
        isAI && "border-accent bg-accent/10",
        className
      )}
    >
      <span className="text-xs">
        {tag.display_name}
        {showSource && isInherited && " (inherited)"}
        {showSource && isAI && tag.confidence_score && ` (${Math.round(tag.confidence_score * 100)}%)`}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-background/20 rounded-full p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};
