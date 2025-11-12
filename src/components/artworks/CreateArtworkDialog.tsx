import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useArtworkMutations } from '@/hooks/useArtworkMutations';
import { usePartners } from '@/hooks/useProfiles';
import { useAuth } from '@/hooks/useAuth';

const currentYear = new Date().getFullYear();

const artworkSchema = z.object({
  partner_id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  artist_name: z.string().min(1, 'Artist name is required').max(200),
  description: z.string().optional(),
  art_medium: z.string().optional(),
  year_created: z.coerce.number().int().min(1900).max(currentYear).optional(),
  original_dimensions: z.string().optional(),
  tags: z.string().optional(),
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
  const { data: partners, isLoading: partnersLoading } = usePartners();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = activeRole === 'admin';

  const form = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: '',
      artist_name: '',
      description: '',
      art_medium: '',
      is_exclusive: false,
      partner_id: undefined,
    },
  });

  const onSubmit = async (values: ArtworkFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert tags string to array
      const tagsArray = values.tags
        ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : null;

      await createArtwork.mutateAsync({
        artwork: {
          title: values.title,
          artist_name: values.artist_name,
          description: values.description || null,
          art_medium: values.art_medium || null,
          year_created: values.year_created || null,
          original_dimensions: values.original_dimensions || null,
          tags: tagsArray,
          is_exclusive: values.is_exclusive,
          rights_start_date: values.rights_start_date || null,
          rights_end_date: values.rights_end_date || null,
          status: 'draft',
          partner_id: null as any, // Will be overridden by partnerId param
        },
        partnerId: values.partner_id, // Only used if admin
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating artwork:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <div className="px-6 pt-6">
          <DialogHeader>
            <DialogTitle>Create New Artwork</DialogTitle>
            <DialogDescription>
              Add a new artwork to your catalog. An ASC code will be automatically generated.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-6 space-y-4 py-4">
              {/* Partner Selection (Admin Only) */}
              {isAdmin && (
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">Partner Assignment</h4>
                  <FormField
                    control={form.control}
                    name="partner_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                          <FormLabel className="text-sm text-right">Partner *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a partner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {partnersLoading ? (
                                <SelectItem value="loading" disabled>Loading partners...</SelectItem>
                              ) : partners && partners.length > 0 ? (
                                partners.map((partner) => (
                                  <SelectItem key={partner.id} value={partner.id}>
                                    {partner.partner_company_name || partner.full_name || partner.email}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="none" disabled>No partners found</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
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

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-[110px_1fr] gap-3 items-center">
                        <FormLabel className="text-sm text-right">Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="landscape, nature, mountains" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />
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
                      <FormMessage className="ml-[122px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 left-0 right-0 bg-background border-t px-6 py-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Artwork'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
