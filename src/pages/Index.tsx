import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mountain, Palette, Users, Compass, ArrowRight } from "lucide-react";
import atlasLogo from "@/assets/atlas-logo-horizontal.png";
import heroImage from "@/assets/hero-posters.jpg";
const Index = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        error
      } = await supabase.from('email_signups').insert([{
        email,
        name: name || null,
        source: 'coming_soon'
      }]);
      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already signed up!",
            description: "This email is already on our list. We'll keep you posted!"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome aboard! 🎉",
          description: "You're now on the list. We'll share our journey with you soon."
        });
        setEmail("");
        setName("");
      }
    } catch (error) {
      console.error('Email signup error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-16 md:py-24 overflow-hidden">
        {/* Hero Image Background */}
        <div className="absolute inset-0 -z-10">
          <img 
            src={heroImage} 
            alt="Vintage travel posters gallery wall" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="container max-w-5xl text-center space-y-8 relative">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-foreground">
            Every Story<br />
            <span className="bg-gradient-to-r from-atlas-gold to-atlas-ocean bg-clip-text text-transparent">
              Deserves a Wall
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're building a platform that connects <strong className="text-foreground">artists, brands, and adventurers</strong> through 
            beautiful posters that tell stories of exploration, culture, and the human spirit.
          </p>

          {/* Email Signup Form */}
          <form onSubmit={handleEmailSignup} className="max-w-md mx-auto space-y-3 pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 h-12" required />
              <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2 h-12 px-8 bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-charcoal font-semibold">
                {isSubmitting ? "Joining..." : "Join Waitlist"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <Input type="text" placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)} className="w-full" />
          </form>

          <p className="text-sm text-muted-foreground pt-2">
            Be the first to know when we launch. No spam, just stories.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-atlas-warm-gray/50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Atlas Posters?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're creating more than a marketplace—we're building a movement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-atlas-gold/20 to-atlas-gold/5 flex items-center justify-center border-2 border-atlas-gold/20 group-hover:border-atlas-gold/40 transition-colors">
                <Palette className="w-8 h-8 text-atlas-gold" />
              </div>
              <h3 className="text-xl font-semibold">For Artists</h3>
              <p className="text-muted-foreground">
                Share your vision with the world. Fair compensation, full credit, beautiful presentation.
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-atlas-ocean/20 to-atlas-ocean/5 flex items-center justify-center border-2 border-atlas-ocean/20 group-hover:border-atlas-ocean/40 transition-colors">
                <Users className="w-8 h-8 text-atlas-ocean" />
              </div>
              <h3 className="text-xl font-semibold">For Brands</h3>
              <p className="text-muted-foreground">
                Extend your story beyond products. Connect with audiences who value authenticity.
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-atlas-gold/20 to-atlas-ocean/10 flex items-center justify-center border-2 border-atlas-gold/20 group-hover:border-atlas-gold/40 transition-colors">
                <Mountain className="w-8 h-8 text-atlas-gold" />
              </div>
              <h3 className="text-xl font-semibold">For Adventurers</h3>
              <p className="text-muted-foreground">
                Bring the outdoors in. Curated art celebrating travel, sport, nature, and culture.
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-atlas-ocean/20 to-atlas-gold/10 flex items-center justify-center border-2 border-atlas-ocean/20 group-hover:border-atlas-ocean/40 transition-colors">
                <Compass className="w-8 h-8 text-atlas-ocean" />
              </div>
              <h3 className="text-xl font-semibold">Story First</h3>
              <p className="text-muted-foreground">
                Every poster has a story. Every artist has a voice. Every wall deserves inspiration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Pitch Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="bg-gradient-to-br from-atlas-charcoal to-atlas-charcoal/90 text-white rounded-2xl p-8 md:p-12 space-y-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-atlas-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-atlas-ocean/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Let's Build Something Beautiful Together
              </h2>
              <p className="text-lg text-white/80 leading-relaxed mb-6">
                We're partnering with artists, photographers, brands, and IP holders who share our vision. 
                If you create work that celebrates <strong className="text-atlas-gold">adventure, travel, sport, nature, or culture</strong>, 
                we want to help you reach an audience that truly appreciates it.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-atlas-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-atlas-gold text-sm font-bold">✓</span>
                  </div>
                  <p className="text-white/80">
                    <strong className="text-white">Full Creative Control:</strong> You maintain all rights. We're here to amplify, not own.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-atlas-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-atlas-gold text-sm font-bold">✓</span>
                  </div>
                  <p className="text-white/80">
                    <strong className="text-white">Fair Revenue Sharing:</strong> Transparent terms. Artists and partners come first.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-atlas-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-atlas-gold text-sm font-bold">✓</span>
                  </div>
                  <p className="text-white/80">
                    <strong className="text-white">Your Brand, Your Space:</strong> Dedicated partner pages that honor your identity.
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <Button size="lg" variant="outline" className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-charcoal border-0 font-semibold" asChild>
                  <a href="mailto:partners@atlasposters.com">
                    Become a Partner
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Link */}
      <section className="py-12 border-t">
        <div className="container text-center space-y-4">
          <h3 className="text-xl font-semibold">Want to see our progress?</h3>
          <Button asChild variant="ghost" className="text-atlas-ocean hover:text-atlas-gold">
            <Link to="/roadmap">View Development Roadmap →</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-atlas-warm-gray/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Atlas Posters. Coming Soon.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/roadmap" className="text-muted-foreground hover:text-atlas-gold transition-colors">
                Roadmap
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-atlas-ocean transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;