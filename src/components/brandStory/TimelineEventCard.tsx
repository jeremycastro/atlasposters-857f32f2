import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandTimelineEvent, EVENT_TYPE_LABELS } from "@/types/brandStory";
import { format } from "date-fns";
import { Calendar, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineEventCardProps {
  event: BrandTimelineEvent;
  brandName?: string;
  brandColor?: string | null;
  onView?: (event: BrandTimelineEvent) => void;
  onEdit?: (event: BrandTimelineEvent) => void;
}

export const TimelineEventCard = ({ event, brandName, brandColor, onView, onEdit }: TimelineEventCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {brandName && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-2"
                  style={{ 
                    borderColor: brandColor || "hsl(var(--border))",
                    color: brandColor || "hsl(var(--foreground))"
                  }}
                >
                  {brandName}
                </Badge>
              )}
              {event.scope === "atlas_global" && !brandName && (
                <Badge variant="outline" className="text-xs">
                  Atlas Global
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {EVENT_TYPE_LABELS[event.event_type]}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(event.event_date), "MMM d, yyyy")}
              </div>
              {!event.is_published && (
                <Badge variant="secondary" className="text-xs">
                  Draft
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {onView && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(event)}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(event)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3 mb-3">
          {event.content}
        </CardDescription>
        {event.featured_image_url && (
          <div className="mb-3 rounded-md overflow-hidden">
            <img 
              src={event.featured_image_url} 
              alt={event.title}
              className="w-full h-32 object-cover"
            />
          </div>
        )}
        {event.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {event.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
