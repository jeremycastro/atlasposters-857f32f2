import { cn } from "@/lib/utils";

export type DeviceType = "full" | "iphone-se" | "iphone-14" | "iphone-14-pro-max" | "ipad-mini";

interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  bezelRadius: number;
  notchWidth?: number;
}

export const deviceConfigs: Record<DeviceType, DeviceConfig> = {
  full: { name: "Full Width", width: 0, height: 0, bezelRadius: 0 },
  "iphone-se": { name: "iPhone SE", width: 375, height: 667, bezelRadius: 40 },
  "iphone-14": { name: "iPhone 14", width: 390, height: 844, bezelRadius: 48, notchWidth: 120 },
  "iphone-14-pro-max": { name: "iPhone 14 Pro Max", width: 430, height: 932, bezelRadius: 52, notchWidth: 130 },
  "ipad-mini": { name: "iPad Mini", width: 768, height: 1024, bezelRadius: 24 },
};

interface DevicePreviewProps {
  src: string;
  device: DeviceType;
  className?: string;
}

export function DevicePreview({ src, device, className }: DevicePreviewProps) {
  const config = deviceConfigs[device];

  if (device === "full") {
    return (
      <div className={cn("w-full h-full", className)}>
        <iframe
          key={src}
          src={src}
          className="w-full h-full border-0"
          title="Wireframe Preview"
        />
      </div>
    );
  }

  // Calculate scale to fit in viewport
  const maxHeight = typeof window !== "undefined" ? window.innerHeight - 200 : 800;
  const scale = Math.min(1, maxHeight / config.height);

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div
        className="relative bg-zinc-900 shadow-2xl"
        style={{
          width: config.width + 24,
          height: config.height + 24,
          borderRadius: config.bezelRadius,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {/* Device bezel */}
        <div
          className="absolute inset-3 bg-background overflow-hidden"
          style={{ borderRadius: config.bezelRadius - 8 }}
        >
          {/* Dynamic Island / Notch for newer iPhones */}
          {config.notchWidth && (
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 h-7 bg-zinc-900 z-10"
              style={{
                width: config.notchWidth,
                borderRadius: 16,
              }}
            />
          )}

          {/* Content iframe */}
          <iframe
            key={src}
            src={src}
            className="w-full h-full border-0"
            style={{
              width: config.width,
              height: config.height,
            }}
            title="Wireframe Preview"
          />
        </div>

        {/* Side button (volume) */}
        <div className="absolute left-0 top-24 w-1 h-8 bg-zinc-700 rounded-l-sm" />
        <div className="absolute left-0 top-36 w-1 h-8 bg-zinc-700 rounded-l-sm" />

        {/* Power button */}
        <div className="absolute right-0 top-28 w-1 h-12 bg-zinc-700 rounded-r-sm" />
      </div>
    </div>
  );
}
