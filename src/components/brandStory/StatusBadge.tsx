import { Badge } from "@/components/ui/badge";
import { BrandStoryStatus, STATUS_LABELS } from "@/types/brandStory";
import { CheckCircle2, Clock, FileCheck, Archive } from "lucide-react";

interface StatusBadgeProps {
  status: BrandStoryStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "draft":
        return <Clock className="h-3 w-3 mr-1" />;
      case "in_review":
        return <FileCheck className="h-3 w-3 mr-1" />;
      case "approved":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "archived":
        return <Archive className="h-3 w-3 mr-1" />;
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case "draft":
        return "secondary" as const;
      case "in_review":
        return "outline" as const;
      case "approved":
        return "default" as const;
      case "archived":
        return "secondary" as const;
    }
  };

  return (
    <Badge variant={getStatusVariant()} className="text-xs">
      {getStatusIcon()}
      {STATUS_LABELS[status]}
    </Badge>
  );
};
