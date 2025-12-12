import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  return (
    <section className="px-4 py-10 bg-muted/50">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold mb-2">Stay Inspired</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Join 50,000+ art lovers. Get new arrivals, exclusive offers, and stories from the archive.
        </p>
        
        <form className="flex gap-2">
          <Input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 h-11"
          />
          <Button className="bg-amber-600 hover:bg-amber-700 text-white h-11 px-6">
            Subscribe
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-3">
          Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
