import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mountain, Palette, Users, Compass, ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";
import { z } from "zod";
import heroImage from "@/assets/hero-001.jpg";

const signupSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),
  name: z.string()
    .trim()
    .max(100, { message: "Name must be less than 100 characters" })
    .optional()
    .or(z.literal(''))
});

const Pitch01 = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = signupSchema.safeParse({ email, name });
    if (!validation.success) {
      toast({
        title: "Invalid input",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("email_signups").insert([
        {
          email: validation.data.email,
          name: validation.data.name || null,
          source: "pitch_page",
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
              Partner Opportunity
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
              Transform Walls
              <br />
              Into Storytelling Canvas
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join a movement that connects <strong className="text-foreground">artists, brands, and adventurers</strong> through
              curated poster art celebrating exploration, culture, and authentic human experiences.
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
                  {isSubmitting ? "Submitting..." : "Request Partnership Details"}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Get full partnership deck and collaboration opportunities
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-muted/30">
        <div className="container max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              To create a platform where artists gain recognition, brands extend their storytelling, 
              and adventurers find inspiration—transforming walls into windows to the world's most 
              compelling narratives of exploration and discovery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-atlas-gold to-atlas-gold/50 flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become the premier destination where authentic stories of adventure, culture, and 
                exploration are celebrated through beautiful, museum-quality poster art that inspires 
                people to explore, discover, and transform their spaces.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-atlas-ocean to-atlas-ocean/50 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Market Opportunity</h3>
              <p className="text-muted-foreground leading-relaxed">
                The global art market and home décor industries represent billions in annual sales. 
                We're uniquely positioned to capture a niche audience seeking meaningful, story-driven 
                art that connects with their values and lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-24">
        <div className="container max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Three-Sided Marketplace</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Creating value for artists, brands, and customers simultaneously
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-2xl p-8 border border-border hover:border-atlas-gold/50 transition-all group hover:shadow-lg">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-atlas-gold to-atlas-gold/50 flex items-center justify-center">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">For Artists</h3>
              <p className="text-muted-foreground leading-relaxed">
                Fair compensation, full attribution, and access to an engaged audience that 
                values authentic creative work and compelling narratives.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:border-atlas-ocean/50 transition-all group hover:shadow-lg">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-atlas-ocean to-atlas-ocean/50 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">For Brands</h3>
              <p className="text-muted-foreground leading-relaxed">
                Extend brand storytelling beyond traditional channels. Connect with audiences 
                who value authenticity, adventure, and meaningful experiences.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:border-atlas-gold/50 transition-all group hover:shadow-lg">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-atlas-gold via-atlas-ocean/50 to-atlas-ocean flex items-center justify-center">
                <Mountain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">For Customers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Discover curated art celebrating travel, sport, nature, and culture. Every 
                poster tells a story and supports the artists and brands behind it.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:border-atlas-ocean/50 transition-all group hover:shadow-lg">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-atlas-ocean to-atlas-gold flex items-center justify-center">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Story First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every piece has meaning. Every partnership is authentic. Every customer 
                connection is built on shared values and genuine inspiration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container max-w-4xl">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Partner With Us to Reach Your Audience
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're seeking partnerships with artists, photographers, brands, and IP holders who 
              create work celebrating{" "}
              <strong className="text-foreground">adventure, travel, sport, nature, and culture</strong>.
              Let's build something meaningful together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-charcoal font-semibold h-12 px-8"
                asChild
              >
                <a href="mailto:partners@atlasposters.com">Schedule a Call</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 font-semibold"
                asChild
              >
                <Link to="/about">Learn More About Atlas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground">© 2025 Atlas Posters. Partnership Opportunities.</p>
            <div className="flex gap-8 text-sm">
              <Link to="/about" className="text-muted-foreground hover:text-atlas-ocean transition-colors font-medium">
                About
              </Link>
              <Link to="/" className="text-muted-foreground hover:text-atlas-gold transition-colors font-medium">
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pitch01;
