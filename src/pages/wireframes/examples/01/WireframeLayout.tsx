import { Outlet } from "react-router-dom";
import { WireframeExampleNav } from "@/components/wireframes/WireframeExampleNav";

export function WireframeLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <WireframeExampleNav
        version="01"
        title="King & McGaw Inspired"
        referenceUrl="https://www.kingandmcgaw.com"
        referenceName="King & McGaw"
        accentColor="bg-amber-500"
        bgColor="bg-muted"
      />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
