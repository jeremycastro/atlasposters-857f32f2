import { Link } from "react-router-dom";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const currency = node.priceRange.minVariantPrice.currencyCode;

  return (
    <Link
      to={`/product/${node.handle}`}
      className="group block"
    >
      <div className="aspect-[3/4] overflow-hidden bg-gallery-gray mb-4">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm group-hover:text-accent transition-colors">
          {node.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          From {currency} {price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};
