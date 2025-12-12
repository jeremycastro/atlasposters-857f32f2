import { Outlet } from "react-router-dom";
import { WireframeExampleNav } from "@/components/wireframes/WireframeExampleNav";

export function WireframeLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <WireframeExampleNav
        version="07"
        title="Mobile-First Atlas"
        accentColor="bg-amber-600"
        variant="light"
      />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
