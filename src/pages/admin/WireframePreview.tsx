import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DevicePreview, DeviceType } from "@/components/wireframes/DevicePreview";
import { WireframePreviewToolbar } from "@/components/wireframes/WireframePreviewToolbar";
import { wireframeVersions } from "@/data/wireframeVersions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const pages = [
  { value: "index", label: "Index" },
  { value: "home", label: "Home" },
  { value: "product", label: "Product" },
  { value: "collection", label: "Collection" },
];

export default function WireframePreview() {
  const { version = "07", page } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState<DeviceType>("iphone-14");

  // Default to "index" if no page specified
  const currentPage = page || "index";

  const wireframe = wireframeVersions.find((w) => w.version === version);
  
  // Build the preview URL - use full origin URL to force fresh page load in iframe
  const pagePath = currentPage !== "index" ? `/${currentPage}` : "";
  const previewUrl = `${window.location.origin}/wireframes/examples/${version}${pagePath}`;
  
  // Debug logging
  console.log('[WireframePreview] version:', version);
  console.log('[WireframePreview] currentPage:', currentPage);
  console.log('[WireframePreview] pagePath:', pagePath);
  console.log('[WireframePreview] previewUrl:', previewUrl);
  console.log('[WireframePreview] window.location.origin:', window.location.origin);

  const handleVersionChange = (newVersion: string) => {
    navigate(`/admin/wireframes/preview/${newVersion}${currentPage !== "index" ? `/${currentPage}` : ""}`);
  };

  const handlePageChange = (newPage: string) => {
    navigate(`/admin/wireframes/preview/${version}${newPage !== "index" ? `/${newPage}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left section */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/wireframes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                <Select value={version} onValueChange={handleVersionChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {wireframeVersions.map((wf) => (
                      <SelectItem key={wf.version} value={wf.version}>
                        v{wf.version} - {wf.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={currentPage} onValueChange={handlePageChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Center - Device toolbar */}
            <WireframePreviewToolbar
              selectedDevice={device}
              onDeviceChange={setDevice}
              className="justify-center"
            />

            {/* Right section */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-muted/30">
        {wireframe ? (
          <DevicePreview src={previewUrl} device={device} className="min-h-full" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Wireframe version not found</p>
          </div>
        )}
      </div>

      {/* Info footer */}
      {wireframe && (
        <div className="border-t bg-card/50 py-2 px-4 text-center text-sm text-muted-foreground">
          <span className="font-medium">{wireframe.title}</span>
          {wireframe.description && (
            <span className="mx-2">•</span>
          )}
          {wireframe.description && (
            <span>{wireframe.description}</span>
          )}
        </div>
      )}
    </div>
  );
}
