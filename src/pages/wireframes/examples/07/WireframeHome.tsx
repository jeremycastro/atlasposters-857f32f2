import { useState } from "react";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { MobileHeader } from "./components/MobileHeader";
import { MobileNav } from "./components/MobileNav";
import { SearchOverlay } from "./components/SearchOverlay";
import { HeroSection } from "./components/HeroSection";
import { DiscoveryCards } from "./components/DiscoveryCards";
import { CuratedCollections } from "./components/CuratedCollections";
import { FeaturedEdition } from "./components/FeaturedEdition";
import { HowItWorks } from "./components/HowItWorks";
import { ArtistSpotlight } from "./components/ArtistSpotlight";
import { BestSellers } from "./components/BestSellers";
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
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      {/* Sticky Header */}
      <MobileHeader 
        onMenuOpen={() => setIsNavOpen(true)}
        onSearchOpen={() => setIsSearchOpen(true)}
      />
      
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
        <HeroSection onSearchClick={() => setIsSearchOpen(true)} />
        
        {/* Discovery Cards (2x2) + Search */}
        <DiscoveryCards onSearchClick={() => setIsSearchOpen(true)} />
        
        {/* Curated Collections Slider */}
        <CuratedCollections />
        
        {/* Featured Edition Block */}
        <FeaturedEdition />
        
        {/* How It Works */}
        <HowItWorks />
        
        {/* Artist Spotlight */}
        <ArtistSpotlight />
        
        {/* Best Sellers Grid */}
        <BestSellers />
        
        {/* Trust Propositions */}
        <TrustPropositions />
        
        {/* Brand Story Section */}
        <BrandStorySection />
        
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
