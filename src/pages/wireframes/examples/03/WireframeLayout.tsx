import { Outlet } from "react-router-dom";
import { WireframeExampleNav } from "@/components/wireframes/WireframeExampleNav";

export function WireframeLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <WireframeExampleNav
        version="03"
        title="Desenio Inspired"
        referenceUrl="https://www.desenio.com"
        referenceName="Desenio"
        accentColor="bg-rose-500"
        variant="dark"
      />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
