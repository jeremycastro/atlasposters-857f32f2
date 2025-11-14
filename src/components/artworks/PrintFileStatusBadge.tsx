import { Image, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PrintFileStatusBadgeProps {
  hasFile: boolean;
  hasWarnings?: boolean;
  fileName?: string;
}

export function PrintFileStatusBadge({ hasFile, hasWarnings, fileName }: PrintFileStatusBadgeProps) {
  if (!hasFile) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Image className="h-4 w-4" />
              <span className="text-xs">No</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>No print file assigned</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (hasWarnings) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-1.5 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Warning</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Print file assigned with warnings</p>
            {fileName && <p className="text-xs mt-1 text-muted-foreground">{fileName}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-1.5 text-green-600">
            <Image className="h-4 w-4" />
            <span className="text-xs font-medium">Yes</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Print file assigned</p>
          {fileName && <p className="text-xs mt-1 text-muted-foreground">{fileName}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface ProductPrintFileStatusProps {
  totalVariants: number;
  variantsWithFiles: number;
  activeOnly?: boolean;
}

export function ProductPrintFileStatus({ 
  totalVariants, 
  variantsWithFiles,
  activeOnly = true 
}: ProductPrintFileStatusProps) {
  if (totalVariants === 0) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        No Variants
      </Badge>
    );
  }

  if (variantsWithFiles === 0) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        None Assigned
      </Badge>
    );
  }

  if (variantsWithFiles === totalVariants) {
    return (
      <Badge className="bg-green-600 hover:bg-green-700">
        All Assigned ({variantsWithFiles}/{totalVariants})
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-amber-100 text-amber-900 hover:bg-amber-200">
      Partial ({variantsWithFiles}/{totalVariants})
    </Badge>
  );
}
