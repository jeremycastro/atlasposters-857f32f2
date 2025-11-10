import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { fetchProducts } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

const Products = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => fetchProducts(50),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Posters</h1>
          <p className="text-muted-foreground">
            Browse our complete collection of curated artwork
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar />
          
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.node.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No products found</p>
                <p className="text-sm text-muted-foreground">
                  Create your first product to get started
                </p>
              </div>
            )}
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

export default Products;
