import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { BrandTimelineEvent, EVENT_TYPE_LABELS } from "@/types/brandStory";

interface TimelineEventTableViewProps {
  events: BrandTimelineEvent[];
  onViewEvent: (event: BrandTimelineEvent) => void;
  onEditEvent?: (event: BrandTimelineEvent) => void;
  onDeleteEvent?: (event: BrandTimelineEvent) => void;
}

export const TimelineEventTableView = ({ 
  events, 
  onViewEvent, 
  onEditEvent,
  onDeleteEvent 
}: TimelineEventTableViewProps) => {
  return (
    <div className="border border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No timeline events yet. Document your brand's journey to get started!
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow
                key={event.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewEvent(event)}
              >
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {EVENT_TYPE_LABELS[event.event_type]}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="line-clamp-1">{event.title}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                    {format(new Date(event.event_date), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {event.brand_id ? "Brand" : "Global"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={event.is_published ? "default" : "secondary"} className="text-xs">
                    {event.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {event.tags.length > 0 ? (
                    <div className="flex gap-1">
                      {event.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{event.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No tags</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onViewEvent(event); 
                        }}
                      >
                        View
                      </DropdownMenuItem>
                      {onEditEvent && (
                        <DropdownMenuItem 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onEditEvent(event); 
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDeleteEvent && (
                        <DropdownMenuItem
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onDeleteEvent(event); 
                          }}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
