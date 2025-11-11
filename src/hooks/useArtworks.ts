import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Artwork = Database['public']['Tables']['artworks']['Row'];
type ArtworkStatus = Database['public']['Enums']['artwork_status'];

interface ArtworkFilters {
  search?: string;
  status?: ArtworkStatus[];
  tags?: string[];
  isExclusive?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export const useArtworks = (filters?: ArtworkFilters) => {
  return useQuery({
    queryKey: ['artworks', filters],
    queryFn: async () => {
      let query = supabase
        .from('artworks')
        .select(`
          *,
          created_by_profile:profiles!artworks_created_by_fkey(full_name, email),
          partner_profile:profiles!artworks_partner_id_fkey(full_name, email, partner_company_name)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,artist_name.ilike.%${filters.search}%,asc_code.ilike.%${filters.search}%`
        );
      }

      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters?.isExclusive !== undefined) {
        query = query.eq('is_exclusive', filters.isExclusive);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Artwork[];
    },
  });
};

export const useArtworkById = (id: string | null) => {
  return useQuery({
    queryKey: ['artwork', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          created_by_profile:profiles!artworks_created_by_fkey(full_name, email),
          artwork_files(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useArtworkStats = () => {
  return useQuery({
    queryKey: ['artwork-stats'],
    queryFn: async () => {
      const { data: artworks, error } = await supabase
        .from('artworks')
        .select('status');

      if (error) throw error;

      const stats = {
        total: artworks.length,
        active: artworks.filter(a => a.status === 'active').length,
        draft: artworks.filter(a => a.status === 'draft').length,
        archived: artworks.filter(a => a.status === 'archived').length,
      };

      return stats;
    },
  });
};
