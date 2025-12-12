import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function AccountWishlist() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
        <p className="text-muted-foreground">
          Items you've saved for later.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Items</CardTitle>
          <CardDescription>Your favorite products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">
              Save items you love to purchase later.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
