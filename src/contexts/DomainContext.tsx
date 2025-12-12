import { createContext, useContext, ReactNode, useMemo } from 'react';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];
type DomainType = 'admin' | 'customer' | 'development';

interface DomainContextType {
  domain: DomainType;
  isAdminDomain: boolean;
  isCustomerDomain: boolean;
  isDevelopment: boolean;
  getPostLoginRoute: (roles: AppRole[], activeRole: AppRole | null) => string;
  getExternalDashboardUrl: () => string;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

const detectDomain = (): DomainType => {
  const hostname = window.location.hostname;
  
  // Production domains
  if (hostname === 'beta.atlasposters.com') {
    return 'admin';
  }
  if (hostname === 'www.atlasposters.com' || hostname === 'atlasposters.com') {
    return 'customer';
  }
  
  // Development/preview environments - treat as admin for full access
  if (
    hostname === 'localhost' ||
    hostname.includes('lovable.app') ||
    hostname.includes('lovableproject.com') ||
    hostname.includes('127.0.0.1')
  ) {
    return 'development';
  }
  
  // Default to customer for unknown domains
  return 'customer';
};

const ADMIN_ROLES: AppRole[] = ['admin', 'editor', 'viewer', 'partner'];

export const DomainProvider = ({ children }: { children: ReactNode }) => {
  const domain = useMemo(() => detectDomain(), []);
  
  const isAdminDomain = domain === 'admin' || domain === 'development';
  const isCustomerDomain = domain === 'customer';
  const isDevelopment = domain === 'development';
  
  const getPostLoginRoute = (roles: AppRole[], activeRole: AppRole | null): string => {
    const hasAdminAccess = roles.some(r => ADMIN_ROLES.includes(r));
    
    if (isAdminDomain) {
      // On beta.atlasposters.com or development
      if (hasAdminAccess) {
        if (activeRole === 'partner') {
          return '/partner/dashboard';
        }
        return '/admin/dashboard';
      }
      // Customer-only user on admin site - send to account
      return '/account';
    }
    
    // On www.atlasposters.com - everyone goes to account
    return '/account';
  };
  
  const getExternalDashboardUrl = (): string => {
    if (isDevelopment) {
      // In development, just use relative URL
      return '/admin/dashboard';
    }
    return 'https://beta.atlasposters.com/admin/dashboard';
  };
  
  return (
    <DomainContext.Provider
      value={{
        domain,
        isAdminDomain,
        isCustomerDomain,
        isDevelopment,
        getPostLoginRoute,
        getExternalDashboardUrl,
      }}
    >
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = () => {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error('useDomain must be used within a DomainProvider');
  }
  return context;
};
