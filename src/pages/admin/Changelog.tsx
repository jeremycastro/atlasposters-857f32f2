import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  GitBranch, 
  Plus, 
  Trash2, 
  Clock, 
  RefreshCw, 
  Settings2,
  Calendar
} from "lucide-react";
import { 
  useProjectVersion, 
  useChangelogs, 
  usePendingEntries,
  useAddChangelogEntry,
  useDeleteChangelogEntry,
  useFinalizeChangelog,
  useOverrideVersion,
  formatVersion,
  type Changelog
} from "@/hooks/useChangelog";

const Changelog = () => {
  const { data: version, isLoading: versionLoading } = useProjectVersion();
  const { data: changelogs, isLoading: changelogsLoading } = useChangelogs();
  const { data: pendingEntries, isLoading: pendingLoading } = usePendingEntries();
  
  const addEntry = useAddChangelogEntry();
  const deleteEntry = useDeleteChangelogEntry();
  const finalizeChangelog = useFinalizeChangelog();
  const overrideVersion = useOverrideVersion();

  const [newEntryType, setNewEntryType] = useState<'added' | 'changed' | 'fixed' | 'removed'>('added');
  const [newEntryDescription, setNewEntryDescription] = useState('');
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [overrideMajor, setOverrideMajor] = useState('0');
  const [overrideMinor, setOverrideMinor] = useState('5');
  const [overridePatch, setOverridePatch] = useState('3');

  const getTypeBadgeVariant = (type: 'added' | 'changed' | 'fixed' | 'removed') => {
    switch (type) {
      case "added":
        return "default";
      case "changed":
        return "secondary";
      case "fixed":
        return "outline";
      case "removed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleAddEntry = () => {
    if (!newEntryDescription.trim()) return;
    addEntry.mutate({
      entry_type: newEntryType,
      description: newEntryDescription.trim(),
    }, {
      onSuccess: () => {
        setNewEntryDescription('');
      }
    });
  };

  const handleFinalize = () => {
    // Finalize today's entries (they will be grouped under today's date)
    finalizeChangelog.mutate(new Date().toISOString().split('T')[0]);
  };

  const handleOverride = () => {
    overrideVersion.mutate({
      major: parseInt(overrideMajor),
      minor: parseInt(overrideMinor),
      patch: parseInt(overridePatch),
    }, {
      onSuccess: () => {
        setShowOverrideDialog(false);
      }
    });
  };

  const nextVersion = version ? (() => {
    let { major, minor, patch } = version;
    if (patch === 99) {
      patch = 0;
      if (minor === 99) {
        minor = 0;
        major += 1;
      } else {
        minor += 1;
      }
    } else {
      patch += 1;
    }
    return formatVersion(major, minor, patch);
  })() : null;

  return (
    <div className="min-h-screen bg-background">      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GitBranch className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Changelog</h1>
          </div>
          <p className="text-muted-foreground">
            Track all changes, updates, and improvements to Atlas Catalog
          </p>
        </div>

        {/* Version Control Panel */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings2 className="w-5 h-5" />
              Version Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              {/* Current Version */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Current:</span>
                {versionLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : version ? (
                  <Badge variant="default" className="text-lg px-3 py-1">
                    v{formatVersion(version.major, version.minor, version.patch)}
                  </Badge>
                ) : null}
              </div>

              {/* Next Version */}
              {nextVersion && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Next:</span>
                  <Badge variant="outline" className="text-sm">
                    v{nextVersion}
                  </Badge>
                </div>
              )}

              {/* Auto-finalize info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Auto-finalize: 3:00 AM PST daily</span>
              </div>

              <div className="flex-1" />

              {/* Actions */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (version) {
                    setOverrideMajor(version.major.toString());
                    setOverrideMinor(version.minor.toString());
                    setOverridePatch(version.patch.toString());
                  }
                  setShowOverrideDialog(true);
                }}
              >
                Override Version
              </Button>
              <Button 
                size="sm"
                onClick={handleFinalize}
                disabled={!pendingEntries?.length || finalizeChangelog.isPending}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${finalizeChangelog.isPending ? 'animate-spin' : ''}`} />
                Finalize Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Entry Form */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="w-5 h-5" />
              Add Changelog Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Select 
                  value={newEntryType} 
                  onValueChange={(v) => setNewEntryType(v as typeof newEntryType)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added">Added</SelectItem>
                    <SelectItem value="changed">Changed</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="removed">Removed</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  value={newEntryDescription}
                  onChange={(e) => setNewEntryDescription(e.target.value)}
                  placeholder="Describe the change..."
                  className="flex-1 min-h-[80px]"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddEntry}
                  disabled={!newEntryDescription.trim() || addEntry.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Entries */}
        {pendingLoading ? (
          <Card className="mb-8">
            <CardContent className="py-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ) : pendingEntries && pendingEntries.length > 0 && (
          <Card className="mb-8 border-dashed border-2 border-primary/30 bg-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5" />
                Pending Entries ({pendingEntries.length})
                <Badge variant="secondary" className="ml-2">Unfiled</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingEntries.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                    <Badge variant={getTypeBadgeVariant(entry.entry_type)} className="shrink-0 h-6">
                      {entry.entry_type}
                    </Badge>
                    <p className="flex-1 text-sm text-foreground leading-relaxed">
                      {entry.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteEntry.mutate(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Changelog Entries */}
        <div className="space-y-8">
          {changelogsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="py-6">
                  <Skeleton className="h-8 w-32 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : changelogs?.map((changelog: Changelog) => (
            <div
              key={changelog.id}
              className="bg-card border border-border rounded-lg p-6"
            >
              {/* Version Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground">
                  v{formatVersion(changelog.major, changelog.minor, changelog.patch)}
                </h2>
                <Badge variant="outline">{changelog.changelog_date}</Badge>
                {changelog.is_auto_generated && (
                  <Badge variant="secondary" className="text-xs">Auto</Badge>
                )}
              </div>

              {/* Changes List */}
              <div className="space-y-3">
                {changelog.entries.map((entry) => (
                  <div key={entry.id} className="flex gap-3">
                    <Badge
                      variant={getTypeBadgeVariant(entry.entry_type)}
                      className="shrink-0 h-6"
                    >
                      {entry.entry_type}
                    </Badge>
                    <p className="text-sm text-foreground leading-relaxed">
                      {entry.description}
                    </p>
                  </div>
                ))}
                {changelog.entries.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No entries recorded</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Following semantic versioning: Major.Minor.Patch (v0.x.xx). 
            Daily increments at 3:00 AM PST when changelog entries exist.
            Version rolls over at .99 (e.g., 0.5.99 → 0.6.00).
          </p>
        </div>
      </main>

      {/* Override Version Dialog */}
      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Override Version</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Set a custom version number. Use this to skip to a new minor/major version.
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                value={overrideMajor}
                onChange={(e) => setOverrideMajor(e.target.value)}
                className="w-20 text-center"
              />
              <span className="text-2xl">.</span>
              <Input
                type="number"
                min="0"
                max="99"
                value={overrideMinor}
                onChange={(e) => setOverrideMinor(e.target.value)}
                className="w-20 text-center"
              />
              <span className="text-2xl">.</span>
              <Input
                type="number"
                min="0"
                max="99"
                value={overridePatch}
                onChange={(e) => setOverridePatch(e.target.value)}
                className="w-20 text-center"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Preview: v{overrideMajor}.{overrideMinor}.{overridePatch.padStart(2, '0')}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOverrideDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleOverride} disabled={overrideVersion.isPending}>
              Set Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Changelog;
