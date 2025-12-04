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

const eraColors: Record<string, string> = {
  "The Printing Revolution & Early Broadsides": "from-amber-900/20 to-amber-800/10 border-amber-700/30",
  "The Birth of the Modern Poster": "from-rose-900/20 to-rose-800/10 border-rose-700/30",
  "Art Nouveau & the Golden Age": "from-emerald-900/20 to-emerald-800/10 border-emerald-700/30",
  "World War I: The Poster as Weapon": "from-red-900/20 to-red-800/10 border-red-700/30",
  "World War II: The Home Front": "from-blue-900/20 to-blue-800/10 border-blue-700/30",
  "The Psychedelic Revolution": "from-purple-900/20 to-purple-800/10 border-purple-700/30",
  "The Digital Age & Beyond": "from-cyan-900/20 to-cyan-800/10 border-cyan-700/30",
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
    // Simple markdown-like rendering
    return content.split("\n\n").map((paragraph, idx) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h3 key={idx} className="font-serif text-xl font-semibold text-amber-100 mb-4 mt-6">
            {paragraph.replace("## ", "")}
          </h3>
        );
      }
      if (paragraph.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-serif text-lg font-medium text-amber-200/80 mb-3 mt-5 uppercase tracking-wider text-sm">
            {paragraph.replace("### ", "")}
          </h4>
        );
      }
      if (paragraph.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-2 border-amber-500/50 pl-4 py-2 my-4 italic text-amber-100/90 bg-amber-500/5 rounded-r">
            {paragraph.replace("> ", "").replace(/\*\*/g, "")}
          </blockquote>
        );
      }
      if (paragraph.startsWith("- ")) {
        const items = paragraph.split("\n").map((item) => item.replace("- ", ""));
        return (
          <div key={idx} className="flex flex-wrap gap-2 my-4">
            {items.map((item, i) => (
              <Badge key={i} variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-200">
                {item}
              </Badge>
            ))}
          </div>
        );
      }
      return (
        <p key={idx} className="text-amber-100/80 leading-relaxed mb-4">
          {paragraph.split("**").map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="text-amber-100 font-semibold">
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
      <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-16 w-3/4 mx-auto bg-stone-800" />
          <Skeleton className="h-8 w-1/2 mx-auto bg-stone-800" />
          <Skeleton className="h-64 w-full bg-stone-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      {/* Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section */}
      <header className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(120,80,20,0.1)_100%)]" />
        
        <p className="text-amber-500/70 text-sm tracking-[0.4em] uppercase mb-4 animate-fade-in">
          An Exhibition by Atlas
        </p>
        
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mb-6" />
        
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-amber-100 tracking-wide mb-4">
          {storyComponent?.title || "The History of Posters"}
        </h1>
        
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent my-6 relative">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 text-xs">◆</span>
        </div>
        
        <p className="font-serif text-lg md:text-xl text-amber-200/70 italic max-w-2xl">
          {storyComponent?.subtitle}
        </p>

        {/* Tags */}
        {storyComponent?.tags && (
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {storyComponent.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="bg-transparent border-amber-500/30 text-amber-300/70 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-400/60 animate-pulse">
          <span className="text-xs tracking-[0.2em] uppercase">Begin the Journey</span>
          <ChevronDown className="h-5 w-5" />
        </div>
      </header>

      {/* Introduction */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <Card className="bg-stone-900/50 border-amber-500/20 p-8 backdrop-blur">
          <p className="text-amber-100/80 leading-relaxed text-lg font-serif">
            {storyComponent?.content.split("\n\n")[0]}
          </p>
        </Card>
      </section>

      {/* Visual Timeline Bar */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="font-serif text-2xl text-amber-100 text-center mb-8 tracking-wide">
          A Visual Timeline
        </h2>
        
        <div className="relative">
          {/* Track */}
          <div className="h-1 bg-gradient-to-r from-stone-800 via-amber-500/40 to-stone-800 rounded-full" />
          
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
                  "w-6 h-6 rounded-full border-2 border-amber-500 transition-all",
                  expandedEras.has(event.id) 
                    ? "bg-amber-500 shadow-[0_0_20px_rgba(201,162,39,0.4)]" 
                    : "bg-stone-900 group-hover:bg-amber-500/50"
                )} />
                <span className="font-serif text-xs text-amber-200 mt-2">{formatYear(event.event_date)}</span>
                <span className="text-[10px] text-amber-300/50 text-center max-w-16 leading-tight mt-1 hidden md:block">
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
            className={cn(
              "overflow-hidden transition-all duration-500 border backdrop-blur",
              `bg-gradient-to-br ${eraColors[event.title] || "from-stone-900/50 to-stone-800/30 border-stone-700/30"}`
            )}
          >
            {/* Header */}
            <button
              onClick={() => toggleEra(event.id)}
              className="w-full flex items-center gap-4 p-6 text-left hover:bg-white/5 transition-colors"
            >
              <div className="text-amber-500/70">
                {eraIcons[event.title] || <Calendar className="h-6 w-6" />}
              </div>
              
              <div className="flex-1">
                <p className="font-serif text-sm text-amber-400/70 tracking-wider">
                  {formatYear(event.event_date)}
                </p>
                <h3 className="font-serif text-xl md:text-2xl text-amber-100 tracking-wide">
                  {event.title}
                </h3>
              </div>
              
              <div className={cn(
                "w-10 h-10 rounded-full border border-amber-500/50 flex items-center justify-center text-amber-400 transition-transform duration-300",
                expandedEras.has(event.id) ? "rotate-45 bg-amber-500 text-stone-900" : ""
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
                <Separator className="bg-amber-500/20" />
                <div className="p-6 md:p-8">
                  {renderContent(event.content)}
                  
                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-amber-500/10">
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="bg-stone-900/50 border-amber-500/20 text-amber-200/60 text-xs"
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
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mb-8" />
        
        <h2 className="font-serif text-2xl md:text-3xl text-amber-100 mb-6">
          The Art Endures
        </h2>
        
        <p className="text-amber-100/70 leading-relaxed font-serif text-lg">
          From Gutenberg's indulgences to Instagram feeds, the poster has adapted and evolved 
          while remaining a powerful medium for visual communication. As we look to the future, 
          the traditions established by Chéret, Mucha, and the great poster artists continue 
          to inspire new generations of visual storytellers.
        </p>
        
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-12 mb-8" />
        
        <p className="text-amber-400/50 text-sm tracking-wider uppercase">
          An exhibition curated by Atlas
        </p>
        <p className="text-amber-400/30 text-xs mt-2">
          Research compiled from museum archives and historical records
        </p>
      </section>
    </div>
  );
};

export default PosterHistoryExhibition;
