import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Scroll, 
  Palette, 
  Crown, 
  Flag, 
  Factory, 
  Sparkles, 
  Monitor,
  ChevronDown,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const eraIcons: Record<string, React.ReactNode> = {
  "The Printing Revolution & Early Broadsides": <Scroll className="h-6 w-6" />,
  "The Birth of the Modern Poster": <Palette className="h-6 w-6" />,
  "Art Nouveau & the Golden Age": <Crown className="h-6 w-6" />,
  "World War I: The Poster as Weapon": <Flag className="h-6 w-6" />,
  "World War II: The Home Front": <Factory className="h-6 w-6" />,
  "The Psychedelic Revolution": <Sparkles className="h-6 w-6" />,
  "The Digital Age & Beyond": <Monitor className="h-6 w-6" />,
};

interface TimelineEvent {
  id: string;
  title: string;
  content: string;
  event_date: string;
  tags: string[];
}

interface BrandComponent {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  tags: string[];
}

const PosterHistoryExhibition = () => {
  const [expandedEras, setExpandedEras] = useState<Set<string>>(new Set());

  // Fetch the main story component
  const { data: storyComponent, isLoading: storyLoading } = useQuery({
    queryKey: ["poster-history-story"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_story_components")
        .select("*")
        .eq("scope", "atlas_global")
        .eq("title", "The History of Posters")
        .single();
      if (error) throw error;
      return data as BrandComponent;
    },
  });

  // Fetch timeline events
  const { data: timelineEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["poster-history-timeline"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_story_timeline")
        .select("*")
        .eq("scope", "atlas_global")
        .eq("is_published", true)
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data as TimelineEvent[];
    },
  });

  const toggleEra = (id: string) => {
    setExpandedEras((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear().toString();
  };

  const renderContent = (content: string) => {
    return content.split("\n\n").map((paragraph, idx) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h3 key={idx} className="font-serif text-xl font-semibold text-foreground mb-4 mt-6">
            {paragraph.replace("## ", "")}
          </h3>
        );
      }
      if (paragraph.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-serif text-sm font-medium text-muted-foreground mb-3 mt-5 uppercase tracking-wider">
            {paragraph.replace("### ", "")}
          </h4>
        );
      }
      if (paragraph.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-2 border-atlas-gold pl-4 py-2 my-4 italic text-foreground/90 bg-atlas-gold/5 rounded-r">
            {paragraph.replace("> ", "").replace(/\*\*/g, "")}
          </blockquote>
        );
      }
      if (paragraph.startsWith("- ")) {
        const items = paragraph.split("\n").map((item) => item.replace("- ", ""));
        return (
          <div key={idx} className="flex flex-wrap gap-2 my-4">
            {items.map((item, i) => (
              <Badge key={i} variant="outline" className="bg-atlas-gold/10 border-atlas-gold/30 text-foreground">
                {item}
              </Badge>
            ))}
          </div>
        );
      }
      return (
        <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
          {paragraph.split("**").map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="text-foreground font-semibold">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  if (storyLoading || eventsLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-gradient-to-b from-atlas-gold/5 to-background">
        <p className="text-atlas-gold text-sm tracking-[0.4em] uppercase mb-4 animate-fade-in">
          An Exhibition by Atlas
        </p>
        
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-atlas-gold/50 to-transparent mb-6" />
        
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
          {storyComponent?.title || "The History of Posters"}
        </h1>
        
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-atlas-gold/50 to-transparent my-6 relative">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-atlas-gold text-xs">◆</span>
        </div>
        
        <p className="font-serif text-lg md:text-xl text-muted-foreground italic max-w-2xl">
          {storyComponent?.subtitle}
        </p>

        {/* Tags */}
        {storyComponent?.tags && (
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {storyComponent.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="bg-transparent border-atlas-gold/30 text-muted-foreground text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-atlas-gold/60 animate-pulse">
          <span className="text-xs tracking-[0.2em] uppercase">Begin the Journey</span>
          <ChevronDown className="h-5 w-5" />
        </div>
      </header>

      {/* Introduction */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <Card className="bg-card border-border p-8">
          <p className="text-muted-foreground leading-relaxed text-lg">
            {storyComponent?.content.split("\n\n")[0]}
          </p>
        </Card>
      </section>

      {/* Visual Timeline Bar */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="font-serif text-2xl text-foreground text-center mb-8 tracking-wide">
          A Visual Timeline
        </h2>
        
        <div className="relative">
          {/* Track */}
          <div className="h-1 bg-gradient-to-r from-border via-atlas-gold/40 to-border rounded-full" />
          
          {/* Markers */}
          <div className="flex justify-between relative -mt-3">
            {timelineEvents?.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  toggleEra(event.id);
                  document.getElementById(`era-${event.id}`)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex flex-col items-center group cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 border-atlas-gold transition-all",
                  expandedEras.has(event.id) 
                    ? "bg-atlas-gold shadow-[0_0_20px_hsl(var(--atlas-gold)/0.4)]" 
                    : "bg-background group-hover:bg-atlas-gold/50"
                )} />
                <span className="font-serif text-xs text-foreground mt-2">{formatYear(event.event_date)}</span>
                <span className="text-[10px] text-muted-foreground text-center max-w-16 leading-tight mt-1 hidden md:block">
                  {event.title.split(":")[0].replace("The ", "").substring(0, 20)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Era Cards */}
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        {timelineEvents?.map((event) => (
          <Card
            key={event.id}
            id={`era-${event.id}`}
            className="overflow-hidden transition-all duration-500 border-border bg-card"
          >
            {/* Header */}
            <button
              onClick={() => toggleEra(event.id)}
              className="w-full flex items-center gap-4 p-6 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="text-atlas-gold">
                {eraIcons[event.title] || <Calendar className="h-6 w-6" />}
              </div>
              
              <div className="flex-1">
                <p className="font-serif text-sm text-atlas-gold tracking-wider">
                  {formatYear(event.event_date)}
                </p>
                <h3 className="font-serif text-xl md:text-2xl text-foreground tracking-wide">
                  {event.title}
                </h3>
              </div>
              
              <div className={cn(
                "w-10 h-10 rounded-full border border-atlas-gold/50 flex items-center justify-center text-atlas-gold transition-transform duration-300",
                expandedEras.has(event.id) ? "rotate-45 bg-atlas-gold text-atlas-gold-foreground" : ""
              )}>
                <span className="text-xl leading-none">+</span>
              </div>
            </button>

            {/* Expanded Content */}
            <div className={cn(
              "grid transition-all duration-500",
              expandedEras.has(event.id) ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}>
              <div className="overflow-hidden">
                <Separator className="bg-border" />
                <div className="p-6 md:p-8">
                  {renderContent(event.content)}
                  
                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="bg-muted/50 border-border text-muted-foreground text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* Closing Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-atlas-gold/50 to-transparent mx-auto mb-8" />
        
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
          The Art Endures
        </h2>
        
        <p className="text-muted-foreground leading-relaxed text-lg">
          From Gutenberg's indulgences to Instagram feeds, the poster has adapted and evolved 
          while remaining a powerful medium for visual communication. As we look to the future, 
          the traditions established by Chéret, Mucha, and the great poster artists continue 
          to inspire new generations of visual storytellers.
        </p>
        
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-atlas-gold/50 to-transparent mx-auto mt-12 mb-8" />
        
        <p className="text-atlas-gold/70 text-sm tracking-wider uppercase">
          An exhibition curated by Atlas
        </p>
        <p className="text-muted-foreground/50 text-xs mt-2">
          Research compiled from museum archives and historical records
        </p>
      </section>
    </div>
  );
};

export default PosterHistoryExhibition;
