import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WireframePlaceholder } from "./WireframePlaceholder";

const stories = [
  { 
    title: "The Golden Age of Travel Posters", 
    tag: "History",
    excerpt: "Discover how railway companies revolutionized advertising in the 1920s and 30s...",
  },
  { 
    title: "How to Frame Your Vintage Poster", 
    tag: "Guide",
    excerpt: "Expert tips on preservation and display techniques for your art collection...",
  },
  { 
    title: "Artist Spotlight: Roger Broders", 
    tag: "Artist",
    excerpt: "The French illustrator who defined the look of Art Deco travel posters...",
  },
];

export function InspirationStories() {
  return (
    <section className="px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Inspiration & Stories</h2>
        <Button variant="ghost" size="sm" className="text-amber-600">
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Vertical List of Articles */}
      <div className="space-y-4">
        {stories.map((story) => (
          <article 
            key={story.title} 
            className="group cursor-pointer border-b border-border pb-4 last:border-0"
          >
            {/* Tag */}
            <Badge variant="outline" className="mb-2 text-xs">
              {story.tag}
            </Badge>
            
            {/* Hero Image */}
            <WireframePlaceholder 
              aspectRatio="video" 
              className="rounded-lg mb-3"
              label="Article Image"
            />
            
            {/* Title */}
            <h3 className="font-semibold text-sm mb-1 group-hover:text-amber-600 transition-colors">
              {story.title}
            </h3>
            
            {/* Excerpt */}
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {story.excerpt}
            </p>
            
            {/* Read More */}
            <Button variant="link" size="sm" className="p-0 h-auto text-amber-600 text-xs">
              Read More
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
