import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  partner_status: string | null;
  partner_company_name: string | null;
  loyalty_points: number | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  activeRole: AppRole | null;
  availableRoles: AppRole[];
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  switchRole: (role: AppRole) => Promise<void>;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeRole, setActiveRole] = useState<AppRole | null>(null);
  const [availableRoles, setAvailableRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, partner_status, partner_company_name, loyalty_points')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
  };

  const fetchActiveRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_role_sessions')
      .select('active_role')
      .eq('user_id', userId)
      .single();
    
    if (data) {
      setActiveRole(data.active_role);
    }
  };

  const fetchAvailableRoles = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('is_active', true);
    
    if (data) {
      setAvailableRoles(data.map(r => r.role));
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer additional data fetching
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchActiveRole(session.user.id);
            fetchAvailableRoles(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setActiveRole(null);
          setAvailableRoles([]);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
          fetchActiveRole(session.user.id);
          fetchAvailableRoles(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const switchRole = async (role: AppRole) => {
    if (!user) return;
    
    // Check if user has this role
    if (!availableRoles.includes(role)) {
      throw new Error('You do not have access to this role');
    }
    
    // Update role session
    const { error } = await supabase
      .from('user_role_sessions')
      .update({ 
        active_role: role,
        last_activity_at: new Date().toISOString()
      })
      .eq('user_id', user.id);
    
    if (!error) {
      setActiveRole(role);
    }
  };

  const hasRole = (role: AppRole) => {
    return availableRoles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        activeRole,
        availableRoles,
        loading,
        signUp,
        signIn,
        signOut,
        switchRole,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
