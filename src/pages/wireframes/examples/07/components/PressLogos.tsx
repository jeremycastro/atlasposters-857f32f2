import { Skeleton } from "@/components/ui/skeleton";

const publications = [
  "Architectural Digest",
  "Elle Decor",
  "Dwell",
  "House Beautiful",
  "Apartment Therapy",
];

export function PressLogos() {
  return (
    <section className="py-8 px-4 bg-muted/20">
      {/* Header */}
      <p className="text-center text-xs uppercase tracking-wider text-muted-foreground mb-6">
        As Seen In
      </p>

      {/* Logo Row */}
      <div className="flex items-center justify-center gap-6 flex-wrap">
        {publications.map((pub) => (
          <div
            key={pub}
            className="flex items-center justify-center"
          >
            <Skeleton className="h-6 w-20 sm:w-24 bg-muted-foreground/10" />
          </div>
        ))}
      </div>
    </section>
  );
}
