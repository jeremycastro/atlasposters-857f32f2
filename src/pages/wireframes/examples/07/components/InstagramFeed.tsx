import { Instagram } from "lucide-react";
import { WireframePlaceholder } from "./WireframePlaceholder";
import { Button } from "@/components/ui/button";

const posts = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  label: `UGC ${i + 1}`,
}));

export function InstagramFeed() {
  return (
    <section className="py-10 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">Join Our Community</h2>
        <p className="text-sm text-muted-foreground">#AtlasPosters</p>
      </div>

      {/* 3x2 Grid */}
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <div key={post.id} className="aspect-square">
            <WireframePlaceholder 
              aspectRatio="square" 
              label={post.label}
              className="rounded-sm"
            />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-6">
        <Button variant="outline" size="sm" className="gap-2">
          <Instagram className="w-4 h-4" />
          Follow @atlasposters
        </Button>
      </div>
    </section>
  );
}
