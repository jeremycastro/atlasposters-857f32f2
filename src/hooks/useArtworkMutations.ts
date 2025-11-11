import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ArtworkInsert = Database['public']['Tables']['artworks']['Insert'];
type ArtworkUpdate = Database['public']['Tables']['artworks']['Update'];

interface CreateArtworkInput {
  artwork: Omit<ArtworkInsert, 'asc_code' | 'sequence_number'>;
  partnerId?: string; // Optional partner ID for admins
}

export const useArtworkMutations = () => {
  const queryClient = useQueryClient();

  const createArtwork = useMutation({
    mutationFn: async ({ artwork, partnerId }: CreateArtworkInput) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Use provided partnerId (for admins) or current user's ID (for partners)
      const targetPartnerId = partnerId || user.id;

      // Generate ASC code
      const { data: ascData, error: ascError } = await supabase
        .rpc('generate_next_asc');

      if (ascError) throw ascError;
      const ascCode = ascData as string;

      // Extract sequence number from ASC code (last 3 digits)
      const sequenceNumber = parseInt(ascCode.slice(-3), 10);

      // Insert artwork
      const { data, error } = await supabase
        .from('artworks')
        .insert({
          ...artwork,
          asc_code: ascCode,
          sequence_number: sequenceNumber,
          partner_id: targetPartnerId,
          created_by: user.id,
          status: artwork.status || 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      // Log ASC history
      await supabase.from('asc_history').insert({
        asc_code: ascCode,
        artwork_id: data.id,
        status: 'assigned',
        assigned_by: user.id,
        notes: `ASC code generated for artwork: ${artwork.title}`,
      });

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      queryClient.invalidateQueries({ queryKey: ['artwork-stats'] });
      toast({
        title: 'Artwork created',
        description: `ASC Code ${data.asc_code} assigned successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating artwork',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateArtwork = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ArtworkUpdate }) => {
      const { data, error } = await supabase
        .from('artworks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      queryClient.invalidateQueries({ queryKey: ['artwork'] });
      queryClient.invalidateQueries({ queryKey: ['artwork-stats'] });
      toast({
        title: 'Artwork updated',
        description: 'Changes saved successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating artwork',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const archiveArtwork = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('artworks')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      queryClient.invalidateQueries({ queryKey: ['artwork-stats'] });
      toast({
        title: 'Artwork archived',
        description: 'Artwork has been archived',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error archiving artwork',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    createArtwork,
    updateArtwork,
    archiveArtwork,
  };
};
