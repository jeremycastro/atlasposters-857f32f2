import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PartnerDashboard() {
  const { profile } = useAuth();

  const isPending = profile?.partner_status === 'pending';

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Partner Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome, {profile?.full_name}!</p>

      {isPending ? (
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Application Under Review</AlertTitle>
          <AlertDescription>
            Your partner application is currently under review. We'll notify you once it's approved.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-8">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Active Partner</AlertTitle>
          <AlertDescription>
            Your partner account is active. Analytics and features coming soon!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">Coming in Phase 1.2</p>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Product Management</h3>
          <p className="text-sm text-muted-foreground">Coming in Phase 1.2</p>
        </div>
      </div>
    </div>
  );
}
