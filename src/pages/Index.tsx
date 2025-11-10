import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(12),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gallery-gray">
        <div className="container text-center space-y-6 px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Curated Art from<br />Exceptional Artists Worldwide
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Museum-quality posters that transform your space. Discover works from emerging and established artists, carefully selected for discerning collectors.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link to="/products">Shop Collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Works</h2>
          <p className="text-muted-foreground">Handpicked pieces from our curated collection</p>
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
            <p className="text-muted-foreground mb-4">No products found</p>
            <p className="text-sm text-muted-foreground">
              Create your first product to get started
            </p>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="bg-gallery-gray py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              Atlas Posters brings together exceptional artwork from talented artists around the globe. 
              Each piece is carefully curated to ensure quality, originality, and artistic merit. 
              We believe in fair compensation for artists and sustainable, responsible production.
            </p>
            <p className="text-lg text-muted-foreground">
              From premium printing on archival paper to museum-grade framing options, 
              every poster is crafted to become a cherished piece in your collection.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Atlas Posters. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
