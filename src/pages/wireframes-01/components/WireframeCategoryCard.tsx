import { Link } from "react-router-dom";

interface WireframeCategoryCardProps {
  title: string;
  image: string;
  itemCount?: number;
}

export function WireframeCategoryCard({
  title,
  image,
  itemCount,
}: WireframeCategoryCardProps) {
  return (
    <Link to="/wireframes-01/collection" className="group block">
      <div className="relative aspect-square overflow-hidden bg-muted rounded-sm">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-['Playfair_Display'] text-lg font-semibold text-background">
            {title}
          </h3>
          {itemCount && (
            <p className="text-sm text-background/80">{itemCount} items</p>
          )}
        </div>
      </div>
    </Link>
  );
}
