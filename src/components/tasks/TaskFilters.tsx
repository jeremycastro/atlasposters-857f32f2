import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, X } from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";

interface TaskFiltersProps {
  filters: {
    status: string[];
    priority: string[];
    assigned_to: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

const statusOptions = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "testing", label: "Testing" },
  { value: "blocked", label: "Blocked" },
  { value: "completed", label: "Completed" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const TaskFilters = ({ filters, onFiltersChange }: TaskFiltersProps) => {
  const { data: profiles } = useProfiles();

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handlePriorityToggle = (priority: string) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    onFiltersChange({ ...filters, priority: newPriority });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      priority: [],
      assigned_to: "",
      search: "",
    });
  };

  const activeFilterCount =
    filters.status.length + filters.priority.length + (filters.assigned_to ? 1 : 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

      <div>
        <Label>Search</Label>
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div>
        <Label className="mb-2 block">Status</Label>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${option.value}`}
                checked={filters.status.includes(option.value)}
                onCheckedChange={() => handleStatusToggle(option.value)}
              />
              <label
                htmlFor={`status-${option.value}`}
                className="text-sm cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Priority</Label>
        <div className="space-y-2">
          {priorityOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`priority-${option.value}`}
                checked={filters.priority.includes(option.value)}
                onCheckedChange={() => handlePriorityToggle(option.value)}
              />
              <label
                htmlFor={`priority-${option.value}`}
                className="text-sm cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Assigned To</Label>
        <div className="flex gap-2">
          <Select
            value={filters.assigned_to || undefined}
            onValueChange={(value) => onFiltersChange({ ...filters, assigned_to: value })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              {profiles?.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.full_name || profile.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.assigned_to && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFiltersChange({ ...filters, assigned_to: "" })}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
