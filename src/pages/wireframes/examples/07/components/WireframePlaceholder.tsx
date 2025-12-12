interface WireframePlaceholderProps {
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "wide";
  label?: string;
}

export function WireframePlaceholder({ 
  className = "", 
  aspectRatio = "square",
  label 
}: WireframePlaceholderProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    wide: "aspect-[16/9]",
  };

  return (
    <div 
      className={`relative bg-muted border-2 border-dashed border-muted-foreground/30 ${aspectClasses[aspectRatio]} ${className}`}
    >
      {/* X Pattern */}
      <svg 
        className="absolute inset-0 w-full h-full text-muted-foreground/20"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" />
      </svg>
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
