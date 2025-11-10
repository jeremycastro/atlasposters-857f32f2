import { useAuth } from '@/hooks/useAuth';

export default function CustomerDashboard() {
  const { profile } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">My Account</h1>
      <p className="text-muted-foreground mb-8">Welcome back, {profile?.full_name}!</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Order History</h3>
          <p className="text-sm text-muted-foreground">No orders yet</p>
          <p className="text-xs text-muted-foreground mt-2">Coming in Phase 1.3</p>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Loyalty Points</h3>
          <p className="text-3xl font-bold">{profile?.loyalty_points || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">Earn points with every purchase</p>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Favorites</h3>
          <p className="text-sm text-muted-foreground">No favorites yet</p>
          <p className="text-xs text-muted-foreground mt-2">Coming in Phase 1.3</p>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Account Settings</h3>
          <p className="text-sm text-muted-foreground">Manage your profile</p>
          <p className="text-xs text-muted-foreground mt-2">Coming in Phase 1.3</p>
        </div>
      </div>
    </div>
  );
}
