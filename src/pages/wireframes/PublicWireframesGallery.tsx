import { Navigation } from "@/components/Navigation";
import { wireframeVersions } from "@/data/wireframeVersions";
import { WireframeCard } from "@/components/wireframes/WireframeCard";

const PublicWireframesGallery = () => {
  // Filter to only published wireframes
  const publishedWireframes = wireframeVersions.filter(wf => wf.published);

  if (publishedWireframes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Wireframe Gallery</h1>
          <p className="text-muted-foreground">No wireframes are currently published.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Wireframe Gallery
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our design explorations for the Atlas storefront. Each version represents
            a different aesthetic direction with detailed UX and SEO analysis.
          </p>
        </div>
      </section>

      {/* Wireframe Versions */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {publishedWireframes.map((wireframe) => (
            <WireframeCard
              key={wireframe.version}
              wireframe={wireframe}
              isAdmin={false}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Atlas Storefront Wireframes</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicWireframesGallery;
