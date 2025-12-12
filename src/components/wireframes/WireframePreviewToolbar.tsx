import { Monitor, Smartphone, Tablet } from "lucide-react";
import { DeviceType, deviceConfigs, DeviceCategory } from "./DevicePreview";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WireframePreviewToolbarProps {
  selectedDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  className?: string;
}

const categoryLabels: Record<DeviceCategory, string> = {
  desktop: "Desktop",
  iphone: "iPhones",
  android: "Android",
  tablet: "Tablets",
};

const categoryIcons: Record<DeviceCategory, React.ReactNode> = {
  desktop: <Monitor className="h-4 w-4" />,
  iphone: <Smartphone className="h-4 w-4" />,
  android: <Smartphone className="h-4 w-4" />,
  tablet: <Tablet className="h-4 w-4" />,
};

export function WireframePreviewToolbar({
  selectedDevice,
  onDeviceChange,
  className,
}: WireframePreviewToolbarProps) {
  const devicesByCategory = Object.entries(deviceConfigs).reduce(
    (acc, [key, config]) => {
      const category = config.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(key as DeviceType);
      return acc;
    },
    {} as Record<DeviceCategory, DeviceType[]>
  );

  const selectedConfig = deviceConfigs[selectedDevice];
  const selectedIcon = categoryIcons[selectedConfig.category];

  return (
    <div className={cn("flex items-center gap-2 p-2 bg-muted/50 rounded-lg", className)}>
      <span className="text-sm text-muted-foreground">Device:</span>
      <Select value={selectedDevice} onValueChange={(value) => onDeviceChange(value as DeviceType)}>
        <SelectTrigger className="w-[220px] bg-background">
          <div className="flex items-center gap-2">
            {selectedIcon}
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-background">
          {(["desktop", "iphone", "android", "tablet"] as DeviceCategory[]).map((category) => (
            <SelectGroup key={category}>
              <SelectLabel className="flex items-center gap-2 text-muted-foreground">
                {categoryIcons[category]}
                {categoryLabels[category]}
              </SelectLabel>
              {devicesByCategory[category]?.map((device) => {
                const config = deviceConfigs[device];
                return (
                  <SelectItem key={device} value={device}>
                    <div className="flex items-center justify-between gap-4">
                      <span>{config.name}</span>
                      {device !== "full" && (
                        <span className="text-xs text-muted-foreground">
                          {config.width}×{config.height}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
