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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Artwork</DialogTitle>
          <DialogDescription>
            Add a new artwork to your catalog. An ASC code will be automatically generated.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isAdmin && (
              <FormField
                control={form.control}
                name="partner_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner *</FormLabel>
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
                    <FormDescription>Select the partner who owns this artwork</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Artwork title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="artist_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Artist name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the artwork..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="art_medium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Art Medium</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Oil on Canvas" {...field} />
                    </FormControl>
                    <FormDescription>Type of art medium used</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year_created"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Created</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={currentYear.toString()}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="original_dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Dimensions</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 24x36 inches" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="landscape, nature, mountains (comma-separated)" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated tags for categorization</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_exclusive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Exclusive Artwork</FormLabel>
                    <FormDescription>
                      Mark as exclusive if this artwork has exclusive licensing
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="rights_start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rights Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rights_end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rights End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
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
