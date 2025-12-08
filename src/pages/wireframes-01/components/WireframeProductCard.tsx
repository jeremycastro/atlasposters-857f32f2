import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WireframeProductCardProps {
  title: string;
  artist: string;
  price: string;
  image: string;
  isNew?: boolean;
  isLimited?: boolean;
}

export function WireframeProductCard({
  title,
  artist,
  price,
  image,
  isNew,
  isLimited,
}: WireframeProductCardProps) {
  return (
    <Link to="/wireframes-01/product" className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && (
            <Badge className="bg-foreground text-background text-xs">New</Badge>
          )}
          {isLimited && (
            <Badge variant="secondary" className="text-xs">Limited Edition</Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-background/90 hover:bg-background"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            className="w-full bg-background text-foreground hover:bg-background/90"
          >
            Quick View
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm text-muted-foreground">{artist}</p>
        <h3 className="font-medium text-foreground leading-tight line-clamp-2">
          {title}
        </h3>
        <p className="text-sm font-medium">From {price}</p>
      </div>
    </Link>
  );
}
