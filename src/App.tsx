import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Changelog from "./pages/admin/Changelog";
import TechStack from "./pages/admin/TechStack";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PartnerAuth from "./pages/PartnerAuth";
import CustomerAuth from "./pages/CustomerAuth";
import AdminLayout from "./layouts/AdminLayout";
import PartnerLayout from "./layouts/PartnerLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import TaskManager from "./pages/admin/TaskManager";
import RoadmapManager from "./pages/admin/RoadmapManager";
import PartnerDashboard from "./pages/partner/Dashboard";
import ArtworkCatalog from "./pages/partner/ArtworkCatalog";
import NavigationManager from "./pages/admin/NavigationManager";
import PartnerManagement from "./pages/admin/PartnerManagement";
import CustomerDashboard from "./pages/customer/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/collections/:handle" element={<Collection />} />
            <Route path="/about" element={<About />} />
            
            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/partner/auth" element={<PartnerAuth />} />
            <Route path="/customer/auth" element={<CustomerAuth />} />
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'editor', 'viewer']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="tasks" element={<TaskManager />} />
              <Route path="roadmap" element={<RoadmapManager />} />
              <Route path="changelog" element={<Changelog />} />
              <Route path="techstack" element={<TechStack />} />
              <Route path="artworks" element={<ArtworkCatalog />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="navigation" element={<NavigationManager />} />
              <Route path="partners" element={<PartnerManagement />} />
            </Route>
            
            {/* Partner routes */}
            <Route 
              path="/partner" 
              element={
                <ProtectedRoute allowedRoles={['partner']}>
                  <PartnerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/partner/dashboard" replace />} />
              <Route path="dashboard" element={<PartnerDashboard />} />
              <Route path="artworks" element={<ArtworkCatalog />} />
            </Route>
            
            {/* Customer routes */}
            <Route 
              path="/customer" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="orders" element={<div className="p-8"><h1 className="text-3xl font-bold">Orders</h1><p className="text-muted-foreground">Coming in Phase 1.3</p></div>} />
              <Route path="favorites" element={<div className="p-8"><h1 className="text-3xl font-bold">Favorites</h1><p className="text-muted-foreground">Coming in Phase 1.3</p></div>} />
              <Route path="profile" element={<div className="p-8"><h1 className="text-3xl font-bold">Profile</h1><p className="text-muted-foreground">Coming in Phase 1.3</p></div>} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
