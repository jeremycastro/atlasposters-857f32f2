import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PrintFileSpecificationsProps {
  specifications: Record<string, any>;
  onChange: (specs: Record<string, any>) => void;
}

export const PrintFileSpecifications = ({
  specifications,
  onChange,
}: PrintFileSpecificationsProps) => {
  const handleChange = (field: string, value: string) => {
    onChange({
      ...specifications,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-sm mb-3">Print Specifications</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              placeholder='e.g., 16" x 20"'
              value={specifications.dimensions || ''}
              onChange={(e) => handleChange('dimensions', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dpi">DPI/Resolution</Label>
            <Select
              value={specifications.dpi || ''}
              onValueChange={(value) => handleChange('dpi', value)}
            >
              <SelectTrigger id="dpi">
                <SelectValue placeholder="Select DPI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="72">72 DPI</SelectItem>
                <SelectItem value="150">150 DPI</SelectItem>
                <SelectItem value="300">300 DPI</SelectItem>
                <SelectItem value="600">600 DPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color_profile">Color Profile</Label>
            <Select
              value={specifications.color_profile || ''}
              onValueChange={(value) => handleChange('color_profile', value)}
            >
              <SelectTrigger id="color_profile">
                <SelectValue placeholder="Select profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sRGB">sRGB</SelectItem>
                <SelectItem value="CMYK">CMYK</SelectItem>
                <SelectItem value="Adobe_RGB">Adobe RGB</SelectItem>
                <SelectItem value="ProPhoto_RGB">ProPhoto RGB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color_space">Color Space</Label>
            <Input
              id="color_space"
              placeholder="e.g., RGB, CMYK"
              value={specifications.color_space || ''}
              onChange={(e) => handleChange('color_space', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bleed">Bleed</Label>
            <Input
              id="bleed"
              placeholder='e.g., 0.125"'
              value={specifications.bleed || ''}
              onChange={(e) => handleChange('bleed', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="safe_zone">Safe Zone</Label>
            <Input
              id="safe_zone"
              placeholder='e.g., 0.25"'
              value={specifications.safe_zone || ''}
              onChange={(e) => handleChange('safe_zone', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Input
          id="notes"
          placeholder="Any special printing instructions..."
          value={specifications.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>
    </div>
  );
};
