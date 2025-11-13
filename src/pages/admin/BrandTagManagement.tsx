import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrands } from '@/hooks/usePartnerManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Tag } from 'lucide-react';
import { BrandTagManager } from '@/components/brands/BrandTagManager';

export default function BrandTagManagement() {
  const navigate = useNavigate();
  const { data: brands, isLoading } = useBrands();
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');

  const selectedBrand = brands?.find(b => b.id === selectedBrandId);

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center gap-3 mb-2">
          <Tag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Brand Tag Management</h1>
        </div>
        <p className="text-muted-foreground">
          Manage tags for brands. Tags added to brands automatically cascade to all artworks under that brand.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Brand</CardTitle>
          <CardDescription>
            Choose a brand to manage its tags and view inheritance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedBrandId}
            onValueChange={setSelectedBrandId}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoading ? "Loading brands..." : "Select a brand"} />
            </SelectTrigger>
            <SelectContent>
              {brands?.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.brand_name} ({brand.partner?.partner_name || 'No Partner'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedBrandId && selectedBrand && (
        <BrandTagManager
          brandId={selectedBrandId}
          brandName={selectedBrand.brand_name}
        />
      )}

      {!selectedBrandId && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Select a brand above to manage its tags
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
