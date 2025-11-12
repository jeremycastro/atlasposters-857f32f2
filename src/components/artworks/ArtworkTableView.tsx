import { useState } from 'react';
import { Database } from '@/integrations/supabase/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Archive, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

type Artwork = Database['public']['Tables']['artworks']['Row'] & {
  brand?: {
    id: string;
    brand_name: string;
    partner?: {
      id: string;
      partner_name: string;
    };
  } | null;
  created_by_profile?: {
    full_name: string | null;
    email: string;
  } | null;
};

interface ArtworkTableViewProps {
  artworks: Artwork[];
  onView: (artwork: Artwork) => void;
  onEdit: (artwork: Artwork) => void;
  onArchive: (artwork: Artwork) => void;
}

type SortField = 'asc_code' | 'title' | 'artist_name' | 'status' | 'created_at';
type SortDirection = 'asc' | 'desc';

export function ArtworkTableView({
  artworks,
  onView,
  onEdit,
  onArchive,
}: ArtworkTableViewProps) {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedArtworks = [...artworks].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'artist_name') {
      aVal = a.artist_name || '';
      bVal = b.artist_name || '';
    }

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No artworks found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first artwork to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:text-foreground"
              onClick={() => handleSort('asc_code')}
            >
              ASC Code {sortField === 'asc_code' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-foreground"
              onClick={() => handleSort('title')}
            >
              Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-foreground"
              onClick={() => handleSort('artist_name')}
            >
              Artist {sortField === 'artist_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Partner</TableHead>
            <TableHead
              className="cursor-pointer hover:text-foreground"
              onClick={() => handleSort('status')}
            >
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Rights Period</TableHead>
            <TableHead
              className="cursor-pointer hover:text-foreground"
              onClick={() => handleSort('created_at')}
            >
              Created {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedArtworks.map((artwork) => (
            <TableRow key={artwork.id}>
              <TableCell className="font-mono text-sm">
                <div className="flex items-center gap-2">
                  {artwork.asc_code}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(artwork.asc_code)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="font-medium max-w-[200px] truncate">
                {artwork.title}
              </TableCell>
              <TableCell>{artwork.artist_name || '-'}</TableCell>
              <TableCell>{artwork.brand?.brand_name || '-'}</TableCell>
              <TableCell>{artwork.brand?.partner?.partner_name || '-'}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(artwork.status)}>
                  {artwork.status}
                </Badge>
              </TableCell>
              <TableCell>{artwork.year_created || '-'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {artwork.rights_start_date && artwork.rights_end_date ? (
                  <span>
                    {format(new Date(artwork.rights_start_date), 'MMM yyyy')} -{' '}
                    {format(new Date(artwork.rights_end_date), 'MMM yyyy')}
                  </span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(artwork.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(artwork)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(artwork)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onArchive(artwork)}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
