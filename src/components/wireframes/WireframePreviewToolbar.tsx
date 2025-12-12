import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeviceType, deviceConfigs } from "./DevicePreview";
import { cn } from "@/lib/utils";

interface WireframePreviewToolbarProps {
  selectedDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  className?: string;
}

const deviceIcons: Record<DeviceType, React.ReactNode> = {
  full: <Monitor className="h-4 w-4" />,
  "iphone-se": <Smartphone className="h-4 w-4" />,
  "iphone-14": <Smartphone className="h-4 w-4" />,
  "iphone-14-pro-max": <Smartphone className="h-4 w-4" />,
  "ipad-mini": <Tablet className="h-4 w-4" />,
};

export function WireframePreviewToolbar({
  selectedDevice,
  onDeviceChange,
  className,
}: WireframePreviewToolbarProps) {
  const devices: DeviceType[] = ["full", "iphone-se", "iphone-14", "iphone-14-pro-max", "ipad-mini"];

  return (
    <div className={cn("flex items-center gap-2 p-2 bg-muted/50 rounded-lg", className)}>
      <span className="text-sm text-muted-foreground mr-2">Device:</span>
      {devices.map((device) => {
        const config = deviceConfigs[device];
        const isSelected = selectedDevice === device;
        
        return (
          <Button
            key={device}
            variant={isSelected ? "default" : "ghost"}
            size="sm"
            onClick={() => onDeviceChange(device)}
            className={cn(
              "gap-2",
              isSelected && "bg-primary text-primary-foreground"
            )}
          >
            {deviceIcons[device]}
            <span className="hidden sm:inline">{config.name}</span>
            {device !== "full" && (
              <span className="text-xs opacity-70 hidden md:inline">
                {config.width}×{config.height}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
