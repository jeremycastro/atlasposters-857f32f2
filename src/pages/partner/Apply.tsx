import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function PartnerApply() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [partnerType, setPartnerType] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/partner/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast({
        variant: 'destructive',
        title: 'Invalid email',
        description: emailValidation.error.errors[0].message
      });
      setLoading(false);
      return;
    }

    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      toast({
        variant: 'destructive',
        title: 'Invalid password',
        description: passwordValidation.error.errors[0].message
      });
      setLoading(false);
      return;
    }

    // Sign up the user
    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Signup failed',
        description: error.message
      });
      setLoading(false);
      return;
    }

    // Wait a moment for the profile to be created
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Update profile with partner information
      await supabase
        .from('profiles')
        .update({
          partner_company_name: companyName,
          partner_type: partnerType,
          partner_contact_email: email,
          partner_website: website,
          partner_status: 'pending'
        })
        .eq('id', session.user.id);

      // Assign partner role (status will be pending until admin approves)
      await supabase
        .from('user_roles')
        .insert({
          user_id: session.user.id,
          role: 'partner',
          is_active: false,
          notes: 'Partner application submitted - pending admin approval'
        });

      toast({
        title: 'Application submitted',
        description: 'Your partner application is under review. We\'ll contact you soon!'
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Partner Application</CardTitle>
          <CardDescription>
            Join Atlas Posters as a partner artist, photographer, or brand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company/Brand Name *</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Your Company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerType">Partner Type *</Label>
              <Select value={partnerType} onValueChange={setPartnerType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artist">Artist</SelectItem>
                  <SelectItem value="photographer">Photographer</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="ip_holder">IP Holder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>

            <div className="text-center text-sm">
              <p>
                Already a partner?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
