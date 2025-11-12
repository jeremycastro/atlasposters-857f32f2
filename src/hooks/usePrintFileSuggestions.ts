import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PrintFileSuggestion {
  file_id: string;
  file_name: string;
  tags: any;
  match_score: number;
  match_reasons: string[];
}

export const usePrintFileSuggestions = (
  artworkId: string | undefined,
  variantCodes: string[]
) => {
  return useQuery({
    queryKey: ['print-file-suggestions', artworkId, variantCodes],
    queryFn: async () => {
      if (!artworkId) return [];

      const { data, error } = await supabase.rpc('get_print_file_suggestions', {
        p_artwork_id: artworkId,
        p_variant_codes: variantCodes,
      });

      if (error) throw error;
      return (data || []) as PrintFileSuggestion[];
    },
    enabled: !!artworkId && variantCodes.length > 0,
  });
};
