import { Outlet } from "react-router-dom";
import { WireframeExampleNav } from "@/components/wireframes/WireframeExampleNav";

export function WireframeLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <WireframeExampleNav
        version="05"
        title="Best Practices Synthesis"
        accentColor="bg-amber-500"
        variant="dark"
      />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
