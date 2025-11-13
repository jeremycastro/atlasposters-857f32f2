import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UnifiedTagSelector } from '@/components/tags/UnifiedTagSelector';
import { AITagSuggestions } from '@/components/tags/AITagSuggestions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useArtworkMutations } from '@/hooks/useArtworkMutations';
import { useBrands } from '@/hooks/usePartnerManagement';
import { useAuth } from '@/hooks/useAuth';
import { ArtworkFileUpload } from './ArtworkFileUpload';
import { Database } from '@/integrations/supabase/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const currentYear = new Date().getFullYear();

const artworkSchema = z.object({
  brand_id: z.string().min(1, 'Brand is required'),
  title: z.string().min(1, 'Title is required').max(200),
  artist_name: z.string().min(1, 'Artist name is required').max(200),
  description: z.string().optional(),
  art_medium: z.string().optional(),
  year_created: z.coerce.number().int().min(1900).max(currentYear).optional(),
  original_dimensions: z.string().optional(),
  is_exclusive: z.boolean().default(false),
  rights_start_date: z.string().optional(),
  rights_end_date: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']),
});

type ArtworkFormValues = z.infer<typeof artworkSchema>;
type Artwork = Database['public']['Tables']['artworks']['Row'];

interface EditArtworkDialogProps {
  artwork: Artwork | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditArtworkDialog = ({ artwork, open, onOpenChange }: EditArtworkDialogProps) => {
  const { updateArtwork } = useArtworkMutations();
  const { activeRole } = useAuth();
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);

  const isAdmin = activeRole === 'admin';

  // Fetch artwork files
  const { data: artworkFiles = [] } = useQuery({
    queryKey: ['artwork-files', artwork?.id],
    queryFn: async () => {
      if (!artwork?.id) return [];
      
      const { data, error } = await supabase
        .from('artwork_files')
        .select('*')
        .eq('artwork_id', artwork.id)
        .order('is_primary', { ascending: false });

      if (error) throw error;

      return data.map(file => ({
        ...file,
        url: supabase.storage.from('brand-assets').getPublicUrl(file.file_path).data.publicUrl,
        tags: file.tags as any,
        print_specifications: file.print_specifications as any,
      }));
    },
    enabled: !!artwork?.id && open,
  });

  const form = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: '',
      artist_name: '',
      description: '',
      art_medium: '',
      is_exclusive: false,
      brand_id: '',
      rights_start_date: '',
      rights_end_date: '',
      status: 'draft',
    },
  });

  // Pre-populate form when artwork changes
  useEffect(() => {
    if (artwork && open) {
      form.reset({
        title: artwork.title || '',
        artist_name: artwork.artist_name || '',
        description: artwork.description || '',
        art_medium: artwork.art_medium || '',
        year_created: artwork.year_created || undefined,
        original_dimensions: artwork.original_dimensions || '',
        is_exclusive: artwork.is_exclusive || false,
        brand_id: artwork.brand_id || '',
        rights_start_date: artwork.rights_start_date || '',
        rights_end_date: artwork.rights_end_date || '',
        status: (artwork.status as 'draft' | 'active' | 'archived') || 'draft',
      });
    }
  }, [artwork, open, form]);

  const handleBrandChange = (brandId: string) => {
    const selectedBrand = brands?.find(b => b.id === brandId);
    if (!selectedBrand?.partner?.partner_agreements) return;
    
    const activeAgreement = selectedBrand.partner.partner_agreements.find(
      (agreement) => agreement.status === 'active'
    );
    
    if (activeAgreement) {
      if (activeAgreement.effective_date) {
        form.setValue('rights_start_date', activeAgreement.effective_date);
      }
      if (activeAgreement.expiration_date) {
        form.setValue('rights_end_date', activeAgreement.expiration_date);
      }
    }
  };

  const onSubmit = async (values: ArtworkFormValues) => {
    if (!artwork?.id) return;

    setIsSubmitting(true);
    try {
      await updateArtwork.mutateAsync({
        id: artwork.id,
        updates: {
          title: values.title,
          artist_name: values.artist_name,
          description: values.description || null,
          art_medium: values.art_medium || null,
          year_created: values.year_created || null,
          original_dimensions: values.original_dimensions || null,
          is_exclusive: values.is_exclusive,
          rights_start_date: values.rights_start_date || null,
          rights_end_date: values.rights_end_date || null,
          status: values.status as any,
          brand_id: values.brand_id,
        },
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating artwork:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  if (!artwork) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle>Edit Artwork</DialogTitle>
            <DialogDescription>
              Update artwork details • ASC Code: <span className="font-mono font-semibold">{artwork.asc_code}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Status Selection */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Status</h4>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                        <FormLabel className="text-sm text-right">Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Brand Selection (Admin Only) */}
              {isAdmin && (
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">Brand Assignment</h4>
                  <FormField
                    control={form.control}
                    name="brand_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                          <FormLabel className="text-sm text-right">Brand *</FormLabel>
                          <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={brandOpen}
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? brands?.find((brand) => brand.id === field.value)?.brand_name +
                                      ' (' + (brands?.find((brand) => brand.id === field.value)?.partner?.partner_name || 'Unknown Partner') + ')'
                                    : "Select a brand"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search brands..." />
                                <CommandList>
                                  <CommandEmpty>
                                    {brandsLoading ? 'Loading brands...' : 'No brands found.'}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {brands?.map((brand) => (
                                      <CommandItem
                                        key={brand.id}
                                        value={`${brand.brand_name} ${brand.partner?.partner_name || ''}`}
                                        onSelect={() => {
                                          field.onChange(brand.id);
                                          handleBrandChange(brand.id);
                                          setBrandOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === brand.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {brand.brand_name} ({brand.partner?.partner_name || 'Unknown Partner'})
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormMessage className="ml-[122px]" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Basic Information */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Basic Information</h4>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                        <FormLabel className="text-sm text-right">Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Artwork title" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="artist_name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                        <FormLabel className="text-sm text-right">Artist Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Artist name" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-[110px_1fr] gap-3 items-start">
                        <FormLabel className="text-sm text-right pt-2">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the artwork..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Artwork Details */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Artwork Details</h4>

                <FormField
                  control={form.control}
                  name="art_medium"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                        <FormLabel className="text-sm text-right">Art Medium</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Oil on Canvas" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year_created"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                        <FormLabel className="text-sm text-right">Year Created</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={currentYear.toString()}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="original_dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                        <FormLabel className="text-sm text-right">Dimensions</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 24x36 inches" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />

              </div>

              {/* Tag Management Section */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Tags & AI Suggestions</h4>
                
                <Tabs defaultValue="tags" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tags">Manage Tags</TabsTrigger>
                    <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tags" className="mt-4">
                    <UnifiedTagSelector
                      entityType="artwork"
                      entityId={artwork.id}
                      scope="artwork"
                    />
                  </TabsContent>
                  
                  <TabsContent value="ai" className="mt-4">
                    <AITagSuggestions
                      entityType="artwork"
                      entityId={artwork.id}
                      imageUrl={artworkFiles.find(f => f.is_primary)?.url}
                      metadata={{
                        title: artwork.title,
                        artist_name: artwork.artist_name,
                        description: artwork.description,
                        art_medium: artwork.art_medium,
                        year_created: artwork.year_created,
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Rights & Licensing */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Rights & Licensing</h4>

                <FormField
                  control={form.control}
                  name="is_exclusive"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                        <FormLabel className="text-sm text-right">Exclusive</FormLabel>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="text-sm text-muted-foreground">
                            Mark as exclusive licensing
                          </span>
                        </div>
                      </div>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rights_start_date"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                        <FormLabel className="text-sm text-right">Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rights_end_date"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                        <FormLabel className="text-sm text-right">End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* File Management */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Files</h4>
                <ArtworkFileUpload
                  artworkId={artwork.id}
                  existingFiles={artworkFiles}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
