import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const addItem = useCartStore(state => state.addItem);
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProductByHandle(handle!),
    enabled: !!handle,
  });

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const getSelectedVariant = () => {
    if (!product.variants?.edges) return null;
    
    return product.variants.edges.find(({ node: variant }) => {
      return variant.selectedOptions.every(option => 
        selectedOptions[option.name] === option.value
      );
    });
  };

  const selectedVariant = getSelectedVariant();
  const currentPrice = selectedVariant 
    ? parseFloat(selectedVariant.node.price.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select all options");
      return;
    }

    const cartItem = {
      product: { node: product },
      variantId: selectedVariant.node.id,
      variantTitle: selectedVariant.node.title,
      price: selectedVariant.node.price,
      quantity,
      selectedOptions: selectedVariant.node.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart");
  };

  const mainImage = product.images?.edges?.[0]?.node;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container py-8 flex-1">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="aspect-[3/4] bg-gallery-gray">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={mainImage.altText || product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
              <p className="text-2xl font-semibold">
                {product.priceRange.minVariantPrice.currencyCode} {currentPrice.toFixed(2)}
              </p>
            </div>

            {product.description && (
              <div className="prose prose-sm">
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Options */}
            <div className="space-y-4">
              {product.options?.map((option) => (
                <div key={option.name} className="space-y-2">
                  <Label htmlFor={option.name}>{option.name}</Label>
                  <Select
                    value={selectedOptions[option.name] || ''}
                    onValueChange={(value) => handleOptionChange(option.name, value)}
                  >
                    <SelectTrigger id={option.name}>
                      <SelectValue placeholder={`Select ${option.name}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {option.values.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Select
                  value={quantity.toString()}
                  onValueChange={(value) => setQuantity(parseInt(value))}
                >
                  <SelectTrigger id="quantity" className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!selectedVariant}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t py-8 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Atlas Posters. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
