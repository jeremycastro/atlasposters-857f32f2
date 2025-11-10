import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FilterSidebarProps {
  onFilterChange?: (filters: any) => void;
}

export const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
  return (
    <aside className="w-full md:w-64 space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Collections</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="travel" />
            <Label htmlFor="travel" className="text-sm font-normal cursor-pointer">
              Travel
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="sport" />
            <Label htmlFor="sport" className="text-sm font-normal cursor-pointer">
              Sport
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="culture" />
            <Label htmlFor="culture" className="text-sm font-normal cursor-pointer">
              Culture
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="nature" />
            <Label htmlFor="nature" className="text-sm font-normal cursor-pointer">
              Nature
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Size</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="30x40" />
            <Label htmlFor="30x40" className="text-sm font-normal cursor-pointer">
              30x40 cm
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="50x70" />
            <Label htmlFor="50x70" className="text-sm font-normal cursor-pointer">
              50x70 cm
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="70x100" />
            <Label htmlFor="70x100" className="text-sm font-normal cursor-pointer">
              70x100 cm
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Orientation</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="portrait" />
            <Label htmlFor="portrait" className="text-sm font-normal cursor-pointer">
              Portrait
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="landscape" />
            <Label htmlFor="landscape" className="text-sm font-normal cursor-pointer">
              Landscape
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="square" />
            <Label htmlFor="square" className="text-sm font-normal cursor-pointer">
              Square
            </Label>
          </div>
        </div>
      </div>
    </aside>
  );
};
