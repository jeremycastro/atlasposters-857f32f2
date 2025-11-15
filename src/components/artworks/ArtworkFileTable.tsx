import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, 
  ChevronRight, 
  Star, 
  MoreVertical, 
  Trash2,
  Download
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ThumbnailFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  url: string;
}

interface UploadedFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_primary: boolean;
  tags?: {
    structured: Record<string, string[]>;
    custom: string[];
    matches_variants: Record<string, string[]>;
  };
  print_specifications?: Record<string, any>;
  url: string;
  version_number?: number;
  is_latest?: boolean;
  uploaded_at?: string;
  uploaded_by?: string;
  dimensions?: string;
  dpi?: number;
  color_profile?: string;
  file_type?: string;
  thumbnails?: ThumbnailFile[];
}

interface ArtworkFileTableProps {
  files: UploadedFile[];
  onSetPrimary: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}

export function ArtworkFileTable({ files, onSetPrimary, onDelete }: ArtworkFileTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showThumbnails, setShowThumbnails] = useState(true);

  const toggleRow = (fileId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(fileId)) {
      newExpanded.delete(fileId);
    } else {
      newExpanded.add(fileId);
    }
    setExpandedRows(newExpanded);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getTagCount = (tags?: UploadedFile['tags']): number => {
    if (!tags) return 0;
    const structuredCount = Object.values(tags.structured || {}).flat().length;
    const customCount = (tags.custom || []).length;
    const variantCount = Object.values(tags.matches_variants || {}).flat().length;
    return structuredCount + customCount + variantCount;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No files uploaded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Uploaded Files</CardTitle>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-thumbnails"
            checked={showThumbnails}
            onCheckedChange={setShowThumbnails}
          />
          <Label htmlFor="show-thumbnails" className="text-sm cursor-pointer">
            Show Thumbnails
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                {showThumbnails && <TableHead className="w-20">Preview</TableHead>}
                <TableHead className="w-8"></TableHead>
                <TableHead>File Name</TableHead>
                <TableHead className="w-24">Type</TableHead>
                <TableHead className="w-24">Size</TableHead>
                <TableHead className="w-20">Version</TableHead>
                <TableHead className="w-20 text-center">Primary</TableHead>
                <TableHead className="w-20 text-center">Tags</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => {
                const isExpanded = expandedRows.has(file.id);
                const tagCount = getTagCount(file.tags);

                return (
                  <React.Fragment key={file.id}>
                    <TableRow className="group">
                      {showThumbnails && (
                        <TableCell>
                          <img
                            src={file.url}
                            alt={file.file_name}
                            className="w-16 h-16 object-cover rounded border border-border"
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Collapsible open={isExpanded} onOpenChange={() => toggleRow(file.id)}>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </Collapsible>
                      </TableCell>
                      <TableCell className="font-medium">{file.file_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {file.file_type || 'Original'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatFileSize(file.file_size)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">v{file.version_number || 1}</span>
                          {file.is_latest && (
                            <Badge variant="outline" className="text-xs">Latest</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {file.is_primary ? (
                          <Star className="h-4 w-4 fill-primary text-primary inline" />
                        ) : (
                          <Star className="h-4 w-4 text-muted-foreground inline" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {tagCount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {tagCount}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!file.is_primary && (
                              <DropdownMenuItem onClick={() => onSetPrimary(file.id)}>
                                <Star className="h-4 w-4 mr-2" />
                                Set as Primary
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <a href={file.url} download={file.file_name}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(file.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={showThumbnails ? 9 : 8} className="p-0 border-0">
                        <Collapsible open={isExpanded}>
                          <CollapsibleContent>
                            <div className="bg-muted/50 p-4 space-y-4 border-t">
                              {/* Generated Thumbnails Section */}
                              {file.thumbnails && file.thumbnails.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Generated Thumbnails</h4>
                                  <div className="grid grid-cols-3 gap-3">
                                    {file.thumbnails.map((thumb) => {
                                      const variant = thumb.file_name.match(/_(small|medium|large)\./)?.[1] || 'unknown';
                                      return (
                                        <div key={thumb.id} className="space-y-1">
                                          <img
                                            src={thumb.url}
                                            alt={`${variant} thumbnail`}
                                            className="w-full aspect-square object-cover rounded border border-border"
                                          />
                                          <div className="text-center">
                                            <Badge variant="secondary" className="text-xs capitalize">
                                              {variant}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {formatFileSize(thumb.file_size)}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Metadata Section */}
                              <div>
                                <h4 className="text-sm font-semibold mb-2">File Metadata</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Dimensions:</span>
                                    <p className="font-medium">{file.dimensions || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">DPI:</span>
                                    <p className="font-medium">{file.dpi || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Color Profile:</span>
                                    <p className="font-medium">{file.color_profile || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">MIME Type:</span>
                                    <p className="font-medium">{file.mime_type}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Uploaded:</span>
                                    <p className="font-medium">{formatDate(file.uploaded_at)}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">File Path:</span>
                                    <p className="font-medium text-xs truncate">{file.file_path}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Tags Section */}
                              {tagCount > 0 && file.tags && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Tags</h4>
                                  <div className="space-y-2">
                                    {Object.entries(file.tags.structured || {}).map(([category, tags]) => (
                                      <div key={category} className="flex flex-wrap gap-1">
                                        <span className="text-xs text-muted-foreground capitalize">{category}:</span>
                                        {tags.map((tag, idx) => (
                                          <Badge key={idx} variant="secondary" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    ))}
                                    {file.tags.custom && file.tags.custom.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        <span className="text-xs text-muted-foreground">Custom:</span>
                                        {file.tags.custom.map((tag, idx) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                    {Object.keys(file.tags.matches_variants || {}).length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        <span className="text-xs text-muted-foreground">Variants:</span>
                                        {Object.entries(file.tags.matches_variants || {}).map(([variant, tags]) => (
                                          <Badge key={variant} variant="default" className="text-xs">
                                            {variant}: {tags.join(', ')}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Print Specifications */}
                              {Object.keys(file.print_specifications || {}).length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Print Specifications</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                    {Object.entries(file.print_specifications).map(([key, value]) => (
                                      <div key={key}>
                                        <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                                        <p className="font-medium">{String(value)}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
