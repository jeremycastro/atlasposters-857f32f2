import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { BrandMultiSelector } from "@/components/brandStory/BrandMultiSelector";
import { CreateTimelineDialog } from "@/components/brandStory/CreateTimelineDialog";
import { TimelineEventCard } from "@/components/brandStory/TimelineEventCard";
import { useBrandTimeline } from "@/hooks/useBrandStory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrandEventType, EVENT_TYPE_LABELS } from "@/types/brandStory";
import { Badge } from "@/components/ui/badge";

export default function BrandTimeline() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(() => {
    const brands = searchParams.get("brands");
    return brands ? brands.split(",").filter(Boolean) : [];
  });
  
  const [includeGlobal, setIncludeGlobal] = useState(() => {
    return searchParams.get("global") === "true";
  });
  
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [filterEventType, setFilterEventType] = useState<BrandEventType | "all">(() => {
    return (searchParams.get("type") as BrandEventType) || "all";
  });
  
  const [showDrafts, setShowDrafts] = useState(() => {
    return searchParams.get("drafts") !== "false";
  });

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedBrandIds.length > 0) {
      params.set("brands", selectedBrandIds.join(","));
    }
    
    if (includeGlobal) {
      params.set("global", "true");
    }
    
    if (filterEventType !== "all") {
      params.set("type", filterEventType);
    }
    
    if (!showDrafts) {
      params.set("drafts", "false");
    }
    
    setSearchParams(params, { replace: true });
  }, [selectedBrandIds, includeGlobal, filterEventType, showDrafts, setSearchParams]);

  const { data: events = [] } = useBrandTimeline(
    selectedBrandIds.length > 0 ? selectedBrandIds : undefined,
    {
      includeGlobal,
      publishedOnly: !showDrafts,
    }
  );

  const filteredEvents = events.filter((event) => {
    if (filterEventType !== "all" && event.event_type !== filterEventType) {
      return false;
    }
    return true;
  });

  const groupedByYear = filteredEvents.reduce((acc, event) => {
    const year = new Date(event.event_date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<string, typeof filteredEvents>);

  const years = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand Timeline</h1>
          <p className="text-muted-foreground">
            Chronicle your brand's evolution, decisions, and milestones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BrandMultiSelector
            selectedBrandIds={selectedBrandIds}
            onChange={setSelectedBrandIds}
            includeGlobal={includeGlobal}
            onIncludeGlobalChange={setIncludeGlobal}
          />
          <Button onClick={() => setTimelineDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={filterEventType} onValueChange={(val) => setFilterEventType(val as BrandEventType | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showDrafts ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDrafts(!showDrafts)}
            >
              {showDrafts ? "Showing Drafts" : "Published Only"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium mb-2">No timeline events yet</p>
              <p className="text-sm mb-4">Start documenting your brand's journey</p>
              <Button onClick={() => setTimelineDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Event
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {years.map((year) => (
            <div key={year} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {year}
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-4 pl-16">
                {groupedByYear[year]
                  .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
                  .map((event) => {
                    const brand = (event as any).brands;
                    const dotColor = brand?.primary_color || "hsl(var(--primary))";
                    
                    return (
                      <div key={event.id} className="relative">
                        <div 
                          className="absolute -left-[52px] top-6 h-2 w-2 rounded-full border"
                          style={{ backgroundColor: dotColor }}
                        />
                        <div className="absolute -left-12 top-8 w-8 h-px bg-border" />
                        <TimelineEventCard event={event} brandName={brand?.brand_name} brandColor={brand?.primary_color} />
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateTimelineDialog
        open={timelineDialogOpen}
        onOpenChange={setTimelineDialogOpen}
      />
    </div>
  );
}
