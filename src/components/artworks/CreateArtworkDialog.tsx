import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { ArtworkFilePicker } from './ArtworkFilePicker';
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
});

type ArtworkFormValues = z.infer<typeof artworkSchema>;

interface CreateArtworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateArtworkDialog = ({ open, onOpenChange }: CreateArtworkDialogProps) => {
  const { createArtwork } = useArtworkMutations();
  const { activeRole } = useAuth();
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [brandOpen, setBrandOpen] = useState(false);

  const isAdmin = activeRole === 'admin';

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
    },
  });

  const handleBrandChange = (brandId: string) => {
    const selectedBrand = brands?.find(b => b.id === brandId);
    if (!selectedBrand?.partner?.partner_agreements) return;
    
    // Find active agreement
    const activeAgreement = selectedBrand.partner.partner_agreements.find(
      (agreement) => agreement.status === 'active'
    );
    
    if (activeAgreement) {
      // Auto-populate rights dates from agreement
      if (activeAgreement.effective_date) {
        form.setValue('rights_start_date', activeAgreement.effective_date);
      }
      if (activeAgreement.expiration_date) {
        form.setValue('rights_end_date', activeAgreement.expiration_date);
      }
    }
  };

  const onSubmit = async (values: ArtworkFormValues) => {
    setIsSubmitting(true);
    try {
      // Find the selected brand to get partner_id
      const selectedBrand = brands?.find(b => b.id === values.brand_id);
      if (!selectedBrand?.partner?.id) {
        throw new Error('Brand must have an associated partner');
      }

      const result = await createArtwork.mutateAsync({
        artwork: {
          title: values.title,
          artist_name: values.artist_name,
          description: values.description || null,
          art_medium: values.art_medium || null,
          year_created: values.year_created || null,
          original_dimensions: values.original_dimensions || null,
          tags: null,
          is_exclusive: values.is_exclusive,
          rights_start_date: values.rights_start_date || null,
          rights_end_date: values.rights_end_date || null,
          status: 'draft',
          brand_id: values.brand_id,
          partner_id: null as any, // Will be overridden by partnerId param
        },
        partnerId: selectedBrand.partner.id, // Extract from brand
      });

      // Upload pending files if artwork was created
      if (result?.id && pendingFiles.length > 0) {
        // Upload files using direct Supabase calls
        for (let i = 0; i < pendingFiles.length; i++) {
          const file = pendingFiles[i];
          const isPrimary = i === 0;
          
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
          const filePath = `${result.id}/${fileName}`;

          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('brand-assets')
            .upload(filePath, file);

          if (uploadError) {
            console.error('File upload error:', uploadError);
            continue;
          }

          // Save file metadata
          await supabase.from('artwork_files').insert({
            artwork_id: result.id,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type.startsWith('image/') ? 'image' : 'document',
            file_size: file.size,
            mime_type: file.type,
            is_primary: isPrimary,
          });
        }
      }

      form.reset();
      setPendingFiles([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating artwork:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      form.reset();
      setPendingFiles([]);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle>Create New Artwork</DialogTitle>
            <DialogDescription>
              Add a new artwork to your catalog. An ASC code will be automatically generated.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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

                {/* Tag Management Info */}
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Tags</p>
                      <p className="text-xs text-muted-foreground">
                        Tags can be added after creating the artwork using the Edit dialog. 
                        AI-powered tag suggestions will be available based on your artwork details and uploaded images.
                      </p>
                    </div>
                  </div>
                </div>
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
                        <FormLabel className="text-sm text-right">Rights Start</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </div>
                      <FormDescription className="ml-[122px] text-xs">
                        Auto-populated from partner agreement (can be overridden)
                      </FormDescription>
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
                        <FormLabel className="text-sm text-right">Rights End</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </div>
                      <FormDescription className="ml-[122px] text-xs">
                        Auto-populated from partner agreement (can be overridden)
                      </FormDescription>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* File Selection */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Artwork Files</h4>
                <ArtworkFilePicker
                  files={pendingFiles}
                  onFilesChange={setPendingFiles}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 bg-background border-t px-6 py-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? pendingFiles.length > 0
                    ? 'Creating & Uploading...'
                    : 'Creating...'
                  : 'Create Artwork'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
