import { Outlet } from "react-router-dom";
import { WireframeExampleNav } from "@/components/wireframes/WireframeExampleNav";

export function WireframeLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <WireframeExampleNav
        version="04"
        title="Travel Premium Style"
        referenceUrl="https://sticknobillsonline.com"
        referenceName="Stick No Bills"
        accentColor="bg-amber-700"
        variant="dark"
      />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
