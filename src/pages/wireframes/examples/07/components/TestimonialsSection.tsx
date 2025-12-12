import { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    rating: 5,
    quote: "The quality exceeded my expectations. The frame is beautiful and the print is stunning.",
    name: "Emily R.",
    location: "Portland, OR",
  },
  {
    id: 2,
    rating: 5,
    quote: "Fast shipping and the packaging was perfect. My poster arrived in pristine condition.",
    name: "Marcus T.",
    location: "Austin, TX",
  },
  {
    id: 3,
    rating: 5,
    quote: "I've ordered three posters now and each one is a conversation starter in my home.",
    name: "Jessica L.",
    location: "Brooklyn, NY",
  },
  {
    id: 4,
    rating: 5,
    quote: "The colors are even more vibrant in person. Absolutely love my new wall art!",
    name: "David K.",
    location: "Seattle, WA",
  },
];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const threshold = 10;
      setIsAtStart(el.scrollLeft < threshold);
      setIsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - threshold);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">What Our Customers Say</h2>
          <p className="text-sm text-muted-foreground">Join thousands of happy art lovers</p>
        </div>
        <div className="hidden sm:flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => scroll("left")} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => scroll("right")} className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={cn(
              "flex-shrink-0 w-[260px] sm:w-[300px] snap-start transition-all duration-200",
              index === 0 && isAtStart && "ml-4",
              index === testimonials.length - 1 && isAtEnd && "mr-4"
            )}
          >
            <div className="bg-card border border-border rounded-lg p-4 h-full">
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-sm text-foreground mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              {/* Customer */}
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{testimonial.name}</span>
                <span className="mx-1">•</span>
                <span>{testimonial.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
