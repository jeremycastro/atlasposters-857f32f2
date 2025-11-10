import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard() {
  const { profile, activeRole } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome back, {profile?.full_name}! Your current role: {activeRole}
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Active Partners</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Pending Applications</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
