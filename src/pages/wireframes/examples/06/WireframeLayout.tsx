import { Outlet } from "react-router-dom";
import { WireframeExampleNav } from "@/components/wireframes/WireframeExampleNav";

export function WireframeLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <WireframeExampleNav
        version="06"
        title="Framed Art Inspired"
        referenceUrl="https://www.framedart.com"
        referenceName="FramedArt.com"
        accentColor="bg-red-600"
        variant="light"
      />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
