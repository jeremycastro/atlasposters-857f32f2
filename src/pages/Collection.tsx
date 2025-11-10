import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

const Collection = () => {
  const { handle } = useParams<{ handle: string }>();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['collection', handle],
    queryFn: () => fetchProducts(50, `tag:${handle}`),
    enabled: !!handle,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container py-8 flex-1">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 capitalize">
            {handle?.replace(/-/g, ' ')} Collection
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Curated selection of posters in this collection
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No products found in this collection</p>
          </div>
        )}
      </div>

      <footer className="border-t py-8 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Atlas Posters. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Collection;
