import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ChangelogEntry {
  id: string;
  entry_type: 'added' | 'changed' | 'fixed' | 'removed';
  description: string;
  entry_date: string;
  created_at: string;
  changelog_id: string | null;
}

export interface Changelog {
  id: string;
  major: number;
  minor: number;
  patch: number;
  changelog_date: string;
  is_auto_generated: boolean;
  created_at: string;
  entries: ChangelogEntry[];
}

export interface ProjectVersion {
  major: number;
  minor: number;
  patch: number;
  updated_at: string;
}

interface FinalizeResult {
  success: boolean;
  action: string;
  version?: string;
  message?: string;
  entries_processed?: number;
  date?: string;
}

interface OverrideResult {
  success: boolean;
  old_version: string;
  new_version: string;
}

export function formatVersion(major: number, minor: number, patch: number): string {
  return `v${major}.${minor}.${patch.toString().padStart(2, '0')}`;
}

export function useProjectVersion() {
  return useQuery({
    queryKey: ['project-version'],
    queryFn: async (): Promise<ProjectVersion> => {
      const { data, error } = await supabase
        .from('project_version')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
  });
}

// Convenience hook for getting current version string
export function useCurrentVersion() {
  const { data: version, isLoading } = useProjectVersion();
  const currentVersion = version 
    ? formatVersion(version.major, version.minor, version.patch)
    : 'v0.0.00';
  return { currentVersion, isLoading };
}

export function useChangelogs() {
  return useQuery({
    queryKey: ['changelogs'],
    queryFn: async (): Promise<Changelog[]> => {
      // Fetch changelogs
      const { data: changelogs, error: changelogError } = await supabase
        .from('dev_changelog')
        .select('*')
        .order('major', { ascending: false })
        .order('minor', { ascending: false })
        .order('patch', { ascending: false });
      
      if (changelogError) throw changelogError;

      // Fetch all entries
      const { data: entries, error: entriesError } = await supabase
        .from('dev_changelog_entries')
        .select('*')
        .not('changelog_id', 'is', null)
        .order('created_at', { ascending: true });
      
      if (entriesError) throw entriesError;

      // Group entries by changelog
      const entriesByChangelog = (entries || []).reduce((acc, entry) => {
        if (!acc[entry.changelog_id!]) {
          acc[entry.changelog_id!] = [];
        }
        acc[entry.changelog_id!].push(entry as ChangelogEntry);
        return acc;
      }, {} as Record<string, ChangelogEntry[]>);

      return (changelogs || []).map(cl => ({
        ...cl,
        entries: entriesByChangelog[cl.id] || [],
      }));
    },
  });
}

export function usePendingEntries() {
  return useQuery({
    queryKey: ['pending-changelog-entries'],
    queryFn: async (): Promise<ChangelogEntry[]> => {
      const { data, error } = await supabase
        .from('dev_changelog_entries')
        .select('*')
        .is('changelog_id', null)
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return (data || []) as ChangelogEntry[];
    },
  });
}

export function useAddChangelogEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      entry_type, 
      description, 
      entry_date 
    }: { 
      entry_type: 'added' | 'changed' | 'fixed' | 'removed';
      description: string;
      entry_date?: string;
    }) => {
      const { data, error } = await supabase
        .from('dev_changelog_entries')
        .insert({
          entry_type,
          description,
          entry_date: entry_date || new Date().toISOString().split('T')[0],
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-changelog-entries'] });
      toast.success('Changelog entry added');
    },
    onError: (error) => {
      toast.error(`Failed to add entry: ${error.message}`);
    },
  });
}

export function useDeleteChangelogEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('dev_changelog_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-changelog-entries'] });
      toast.success('Entry deleted');
    },
    onError: (error) => {
      toast.error(`Failed to delete entry: ${error.message}`);
    },
  });
}

export function useFinalizeChangelog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (forDate?: string): Promise<FinalizeResult> => {
      const { data, error } = await supabase.rpc('finalize_daily_changelog', {
        for_date: forDate || null,
      });
      
      if (error) throw error;
      return data as unknown as FinalizeResult;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['changelogs'] });
      queryClient.invalidateQueries({ queryKey: ['pending-changelog-entries'] });
      queryClient.invalidateQueries({ queryKey: ['project-version'] });
      
      if (data.action === 'finalized') {
        toast.success(`Version ${data.version} created with ${data.entries_processed} entries`);
      } else {
        toast.info(data.message || 'No changes to finalize');
      }
    },
    onError: (error) => {
      toast.error(`Failed to finalize: ${error.message}`);
    },
  });
}

export function useOverrideVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ major, minor, patch }: { major: number; minor: number; patch: number }): Promise<OverrideResult> => {
      const { data, error } = await supabase.rpc('override_version', {
        new_major: major,
        new_minor: minor,
        new_patch: patch,
      });
      
      if (error) throw error;
      return data as unknown as OverrideResult;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-version'] });
      toast.success(`Version updated: ${data.old_version} → ${data.new_version}`);
    },
    onError: (error) => {
      toast.error(`Failed to override version: ${error.message}`);
    },
  });
}
