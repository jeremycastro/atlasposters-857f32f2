import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BrandTagManager } from "./BrandTagManager";

interface BrandTagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
  brandName: string;
  brandLogoUrl?: string;
}

export const BrandTagDrawer = ({ 
  isOpen, 
  onClose, 
  brandId, 
  brandName,
  brandLogoUrl 
}: BrandTagDrawerProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        className="w-full sm:max-w-2xl overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            {brandLogoUrl && (
              <img 
                src={brandLogoUrl} 
                alt={brandName} 
                className="h-10 w-10 object-contain rounded" 
              />
            )}
            <div>
              <SheetTitle>Brand Tags</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {brandName}
              </p>
            </div>
          </div>
        </SheetHeader>
        
        <div className="pt-4" onClick={(e) => e.stopPropagation()}>
          <BrandTagManager brandId={brandId} brandName={brandName} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
