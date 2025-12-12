import { useState } from "react";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { MobileHeader } from "./components/MobileHeader";
import { MobileNav } from "./components/MobileNav";
import { SearchOverlay } from "./components/SearchOverlay";
import { HeroSection } from "./components/HeroSection";
import { DiscoveryCards } from "./components/DiscoveryCards";
import { CuratedCollections } from "./components/CuratedCollections";
import { FramePrintQualitySection } from "./components/FramePrintQualitySection";
import { FeaturedEdition } from "./components/FeaturedEdition";
import { HowItWorks } from "./components/HowItWorks";
import { FeaturedArtist } from "./components/FeaturedArtist";
import { ArtistSpotlight } from "./components/ArtistSpotlight";
import { BestSellers } from "./components/BestSellers";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { PressLogos } from "./components/PressLogos";
import { ShopByRoom } from "./components/ShopByRoom";
import { TrustPropositions } from "./components/TrustPropositions";
import { BrandStorySection } from "./components/BrandStorySection";
import { RecentlyViewed } from "./components/RecentlyViewed";
import { FAQSection } from "./components/FAQSection";
import { InstagramFeed } from "./components/InstagramFeed";
import { NewsletterSection } from "./components/NewsletterSection";
import { MobileFooter } from "./components/MobileFooter";
import { EmailSignupModal } from "./components/EmailSignupModal";

export default function WireframeHome() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header Group */}
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <MobileHeader 
          onMenuOpen={() => setIsNavOpen(true)}
          onSearchOpen={() => setIsSearchOpen(true)}
        />
      </div>
      
      {/* Mobile Navigation Drawer */}
      <MobileNav 
        isOpen={isNavOpen} 
        onClose={() => setIsNavOpen(false)} 
      />
      
      {/* Full-Screen Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Discovery Cards (2x2) + Search */}
        <DiscoveryCards onSearchClick={() => setIsSearchOpen(true)} />
        
        {/* Curated Collections Slider */}
        <CuratedCollections />
        
        {/* Frames & Quality Section */}
        <FramePrintQualitySection />
        
        {/* Featured Edition Block */}
        <FeaturedEdition />
        
        {/* How It Works */}
        <HowItWorks />
        
        {/* Featured Artist (Full Block) */}
        <FeaturedArtist />
        
        {/* Artist Spotlight Carousel */}
        <ArtistSpotlight />
        
        {/* Best Sellers Grid */}
        <BestSellers />
        
        {/* Testimonials */}
        <TestimonialsSection />
        
        {/* Press Logos */}
        <PressLogos />
        
        {/* Shop by Room */}
        <ShopByRoom />
        
        {/* Trust Propositions */}
        <TrustPropositions />
        
        {/* Brand Story Section */}
        <BrandStorySection />
        
        {/* Recently Viewed */}
        <RecentlyViewed />
        
        {/* FAQ Section */}
        <FAQSection />
        
        {/* Instagram Feed */}
        <InstagramFeed />
        
        {/* Newsletter Section */}
        <NewsletterSection />
      </main>
      
      {/* Footer */}
      <MobileFooter />
      
      {/* Email Signup Modal (triggered after delay) */}
      <EmailSignupModal triggerAfterMs={8000} />
    </div>
  );
}
