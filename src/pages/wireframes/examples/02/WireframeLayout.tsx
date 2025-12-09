import { Outlet } from "react-router-dom";
import { WireframeExampleNav } from "@/components/wireframes/WireframeExampleNav";

export function WireframeLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <WireframeExampleNav
        version="02"
        title="Scandinavian Minimal"
        referenceUrl="https://theposterclub.com"
        referenceName="The Poster Club"
        accentColor="bg-emerald-600"
        variant="light"
      />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
