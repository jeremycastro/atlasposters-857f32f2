import { cn } from "@/lib/utils";

export type DeviceType = 
  | "full" 
  | "iphone-se" 
  | "iphone-14" 
  | "iphone-14-pro-max" 
  | "iphone-15-pro"
  | "iphone-16-pro-max"
  | "pixel-8"
  | "pixel-8-pro"
  | "samsung-s24"
  | "samsung-s24-ultra"
  | "ipad-mini"
  | "ipad-pro-11"
  | "ipad-pro-13";

export type DeviceCategory = "desktop" | "iphone" | "android" | "tablet";

interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  bezelRadius: number;
  notchWidth?: number;
  dynamicIsland?: boolean;
  category: DeviceCategory;
}

export const deviceConfigs: Record<DeviceType, DeviceConfig> = {
  full: { name: "Full Width", width: 0, height: 0, bezelRadius: 0, category: "desktop" },
  // iPhones
  "iphone-se": { name: "iPhone SE", width: 375, height: 667, bezelRadius: 40, category: "iphone" },
  "iphone-14": { name: "iPhone 14", width: 390, height: 844, bezelRadius: 48, notchWidth: 120, category: "iphone" },
  "iphone-14-pro-max": { name: "iPhone 14 Pro Max", width: 430, height: 932, bezelRadius: 52, dynamicIsland: true, category: "iphone" },
  "iphone-15-pro": { name: "iPhone 15 Pro", width: 393, height: 852, bezelRadius: 50, dynamicIsland: true, category: "iphone" },
  "iphone-16-pro-max": { name: "iPhone 16 Pro Max", width: 440, height: 956, bezelRadius: 54, dynamicIsland: true, category: "iphone" },
  // Android phones
  "pixel-8": { name: "Pixel 8", width: 412, height: 915, bezelRadius: 44, category: "android" },
  "pixel-8-pro": { name: "Pixel 8 Pro", width: 448, height: 998, bezelRadius: 48, category: "android" },
  "samsung-s24": { name: "Samsung S24", width: 412, height: 915, bezelRadius: 46, category: "android" },
  "samsung-s24-ultra": { name: "Samsung S24 Ultra", width: 480, height: 1067, bezelRadius: 48, category: "android" },
  // Tablets
  "ipad-mini": { name: "iPad Mini", width: 768, height: 1024, bezelRadius: 24, category: "tablet" },
  "ipad-pro-11": { name: "iPad Pro 11\"", width: 834, height: 1194, bezelRadius: 28, category: "tablet" },
  "ipad-pro-13": { name: "iPad Pro 13\"", width: 1024, height: 1366, bezelRadius: 32, category: "tablet" },
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
          {/* Dynamic Island for newer iPhones */}
          {config.dynamicIsland && (
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 h-8 w-28 bg-zinc-900 z-10"
              style={{ borderRadius: 20 }}
            />
          )}
          {/* Notch for older iPhones */}
          {config.notchWidth && !config.dynamicIsland && (
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-7 bg-zinc-900 z-10"
              style={{
                width: config.notchWidth,
                borderRadius: "0 0 16px 16px",
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
