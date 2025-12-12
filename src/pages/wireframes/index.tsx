import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { wireframeVersions } from "@/data/wireframeVersions";
import { WireframeCard } from "@/components/wireframes/WireframeCard";
import { toast } from "sonner";

// Local state for publish toggles (in a real app, this would be persisted)
const usePublishState = () => {
  const [publishedState, setPublishedState] = useState<Record<string, boolean>>(
    Object.fromEntries(wireframeVersions.map(wf => [wf.version, wf.published]))
  );

  const togglePublish = (version: string) => {
    setPublishedState(prev => {
      const newState = { ...prev, [version]: !prev[version] };
      const isNowPublished = newState[version];
      toast.success(
        isNowPublished 
          ? `Wireframe V${version} is now published at /wireframes/examples/${version}` 
          : `Wireframe V${version} has been unpublished`
      );
      return newState;
    });
  };

  return { publishedState, togglePublish };
};

const Wireframes = () => {
  const { publishedState, togglePublish } = usePublishState();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Wireframe Gallery
            </h1>
            <Badge variant="outline" className="text-xs">Admin</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage and preview wireframe designs. Toggle the publish status to make wireframes 
            visible on the public <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/wireframes</code> route.
          </p>
        </div>
      </section>

      {/* Wireframe Versions */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wireframeVersions.map((wireframe) => (
            <WireframeCard
              key={wireframe.version}
              wireframe={wireframe}
              isAdmin={true}
              isPublished={publishedState[wireframe.version]}
              onTogglePublish={() => togglePublish(wireframe.version)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Atlas Storefront Wireframes • Admin Gallery</p>
        </div>
      </footer>
    </div>
  );
};

export default Wireframes;
