import { useState } from "react";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { MobileHeader } from "./components/MobileHeader";
import { MobileNav } from "./components/MobileNav";
import { SearchOverlay } from "./components/SearchOverlay";
import { HeroSection } from "./components/HeroSection";
import { DiscoveryCards } from "./components/DiscoveryCards";
import { ShopByTheme } from "./components/ShopByTheme";
import { CuratedCollections } from "./components/CuratedCollections";
import { TopCities } from "./components/TopCities";
import { FeaturedArtist } from "./components/FeaturedArtist";
import { ArtistSpotlight } from "./components/ArtistSpotlight";
import { BestSellers } from "./components/BestSellers";
import { NewArrivals } from "./components/NewArrivals";
import { CuratedCollectionsGrid } from "./components/CuratedCollectionsGrid";
import { FramePrintQualitySection } from "./components/FramePrintQualitySection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { InspirationStories } from "./components/InspirationStories";
import { PromotionalBanner } from "./components/PromotionalBanner";
import { TrustPropositions } from "./components/TrustPropositions";
import { BrandStorySection } from "./components/BrandStorySection";
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
        {/* 1. Hero Section */}
        <HeroSection />
        
        {/* 2. Discovery Cards (2x2) + Search */}
        <DiscoveryCards onSearchClick={() => setIsSearchOpen(true)} />
        
        {/* 3. Shop by Theme - 16:9 vertical list */}
        <ShopByTheme />
        
        {/* 4. Shop by Destination - horizontal scroll */}
        <CuratedCollections />
        
        {/* 5. Top Cities - 3x3 grid */}
        <TopCities />
        
        {/* 6. Featured Artist (Full Block) */}
        <FeaturedArtist />
        
        {/* 7. Artist Spotlight Carousel */}
        <ArtistSpotlight />
        
        {/* 8. Best Sellers Grid */}
        <BestSellers />
        
        {/* 9. New Arrivals Grid */}
        <NewArrivals />
        
        {/* 10. Curated Collections - 16:9 vertical list */}
        <CuratedCollectionsGrid />
        
        {/* 11. Frame & Print Quality */}
        <FramePrintQualitySection />
        
        {/* 12. Testimonials */}
        <TestimonialsSection />
        
        {/* 13. Inspiration & Stories */}
        <InspirationStories />
        
        {/* 14. Promotional Banner */}
        <PromotionalBanner />
        
        {/* 15. Trust Propositions (delivery icons) */}
        <TrustPropositions />
        
        {/* 16. Brand Story Section */}
        <BrandStorySection />
        
        {/* 17. Newsletter Section */}
        <NewsletterSection />
      </main>
      
      {/* Footer */}
      <MobileFooter />
      
      {/* Email Signup Modal (triggered after delay) */}
      <EmailSignupModal triggerAfterMs={8000} />
    </div>
  );
}
