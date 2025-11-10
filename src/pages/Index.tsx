import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mountain, Palette, Users, Compass, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-001.jpg";

const Index = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("email_signups").insert([
        {
          email,
          name: name || null,
          source: "coming_soon",
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already signed up!",
            description: "This email is already on our list. We'll keep you posted!",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome aboard! 🎉",
          description: "You're now on the list. We'll share our journey with you soon.",
        });
        setEmail("");
        setName("");
      }
    } catch (error) {
      console.error("Email signup error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section - Image Background */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-20 md:py-32 overflow-hidden">
        {/* Hero background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-atlas-gold/10 via-transparent to-atlas-ocean/10" />

        <div className="container max-w-6xl relative z-10">
          <div className="text-center space-y-8 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-atlas-gold/10 border border-atlas-gold/20 text-sm font-medium text-foreground">
              <Sparkles className="w-4 h-4 text-atlas-gold" />
              Coming Soon
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
              Every Story
              <br />
              <span className="bg-gradient-to-r from-atlas-gold via-atlas-ocean to-atlas-gold bg-clip-text text-transparent">
                Deserves a Wall
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connecting <strong className="text-foreground">artists, brands, and adventurers</strong> through
              beautiful posters that celebrate exploration, culture, and the human spirit.
            </p>
          </div>

          {/* Email Signup Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl backdrop-blur-sm">
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-lg"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-12 text-lg bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-charcoal font-semibold gap-2"
                >
                  {isSubmitting ? "Joining..." : "Join the Waitlist"}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Be the first to know when we launch. No spam, just stories.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="why-atlas" className="py-24 bg-muted/30">
        <div className="container max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Atlas Posters?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              More than a marketplace—we're building a movement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-2xl p-8 border border-border hover:border-atlas-gold/50 transition-all group hover:shadow-lg">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-atlas-gold to-atlas-gold/50 flex items-center justify-center">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">For Artists</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share your vision with the world. Fair compensation, full credit, beautiful presentation.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:border-atlas-ocean/50 transition-all group hover:shadow-lg">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-atlas-ocean to-atlas-ocean/50 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">For Brands</h3>
              <p className="text-muted-foreground leading-relaxed">
                Extend your story beyond products. Connect with audiences who value authenticity.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:border-atlas-gold/50 transition-all group hover:shadow-lg">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-atlas-gold via-atlas-ocean/50 to-atlas-ocean flex items-center justify-center">
                <Mountain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">For Adventurers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bring the outdoors in. Curated art celebrating travel, sport, nature, and culture.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:border-atlas-ocean/50 transition-all group hover:shadow-lg">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-atlas-ocean to-atlas-gold flex items-center justify-center">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Story First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every poster has a story. Every artist has a voice. Every wall deserves inspiration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner CTA Section */}
      <section id="partner" className="py-24">
        <div className="container max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-atlas-charcoal via-atlas-charcoal to-atlas-charcoal/90 p-12 md:p-16">
            {/* Glow effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-atlas-gold/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-atlas-ocean/20 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Let's Build Something Beautiful Together
              </h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-3xl">
                We're partnering with artists, photographers, brands, and IP holders who share our vision.
                If you create work that celebrates{" "}
                <strong className="text-atlas-gold">adventure, travel, sport, nature, or culture</strong>, we want
                to help you reach an audience that truly appreciates it.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-atlas-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-atlas-gold text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Full Creative Control</p>
                    <p className="text-sm text-white/70">You maintain all rights. We're here to amplify, not own.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-atlas-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-atlas-gold text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Fair Revenue Sharing</p>
                    <p className="text-sm text-white/70">Transparent terms. Artists and partners come first.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-atlas-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-atlas-gold text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Your Brand, Your Space</p>
                    <p className="text-sm text-white/70">Dedicated partner pages that honor your identity.</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-charcoal font-semibold h-12 px-8"
                asChild
              >
                <a href="mailto:partners@atlasposters.com">Become a Partner</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap CTA */}
      <section className="py-16 border-t bg-muted/20">
        <div className="container text-center">
          <h3 className="text-2xl font-bold mb-4">Want to see our progress?</h3>
          <Button asChild variant="ghost" className="text-atlas-ocean hover:text-atlas-gold hover:bg-atlas-gold/10">
            <Link to="/roadmap">View Development Roadmap →</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground">© 2025 Atlas Posters. Coming Soon.</p>
            <div className="flex gap-8 text-sm">
              <Link to="/roadmap" className="text-muted-foreground hover:text-atlas-gold transition-colors font-medium">
                Roadmap
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-atlas-ocean transition-colors font-medium">
                About
              </Link>
              <Link to="/techstack" className="text-muted-foreground hover:text-atlas-gold transition-colors font-medium">
                Tech Stack
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
