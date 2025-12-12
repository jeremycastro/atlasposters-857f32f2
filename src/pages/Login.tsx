import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDomain } from '@/contexts/DomainContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, activeRole, availableRoles, loading: authLoading } = useAuth();
  const { isAdminDomain, getPostLoginRoute } = useDomain();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const returnUrl = searchParams.get('returnUrl');

  useEffect(() => {
    if (!authLoading && user && activeRole) {
      // If there's a specific return URL, use it
      if (returnUrl) {
        navigate(returnUrl);
        return;
      }
      // Otherwise use domain-based routing
      const route = getPostLoginRoute(availableRoles, activeRole);
      navigate(route);
    }
  }, [user, activeRole, availableRoles, authLoading, navigate, returnUrl, getPostLoginRoute]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate email
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

    // Validate password
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

    if (mode === 'signup') {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Signup failed',
          description: error.message
        });
      } else {
        toast({
          title: 'Account created',
          description: 'Welcome to Atlas Posters!'
        });
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: error.message
        });
      }
    }

    setLoading(false);
  };

  const title = isAdminDomain 
    ? (mode === 'login' ? 'Admin Portal' : 'Create Account')
    : (mode === 'login' ? 'Welcome Back' : 'Create Account');

  const description = isAdminDomain
    ? (mode === 'login' ? 'Sign in to Atlas Admin Portal' : 'Create your Atlas account')
    : (mode === 'login' ? 'Sign in to your Atlas Posters account' : 'Join Atlas Posters today');

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={mode === 'signup'}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm space-y-2">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
              
              {isAdminDomain && (
                <p className="pt-2 border-t">
                  Want to become a partner?{' '}
                  <Link to="/partner/apply" className="text-primary hover:underline">
                    Apply here
                  </Link>
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
