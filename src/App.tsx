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
import PosterHistory from "./pages/PosterHistory";
import Changelog from "./pages/admin/Changelog";
import TechStack from "./pages/admin/TechStack";
import SKUMethodology from "./pages/admin/SKUMethodology";
import KnowledgeBase from "./pages/admin/KnowledgeBase";
import PartnerManagementKB from "./pages/admin/knowledge/PartnerManagement";
import BrandAssets from "./pages/admin/knowledge/BrandAssets";
import TaskManagementKB from "./pages/admin/knowledge/TaskManagement";
import ArtworkCatalogKB from "./pages/admin/knowledge/ArtworkCatalog";
import AdminBrandGuide from "./pages/admin/knowledge/AdminBrandGuide";
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
import PartnerDetail from "./pages/admin/PartnerDetail";
import ArtworkDetail from "./pages/admin/ArtworkDetail";
import BrandTagManagement from "./pages/admin/BrandTagManagement";
import Payouts from "./pages/admin/Payouts";
import CustomerDashboard from "./pages/customer/Dashboard";
import BrandStory from "./pages/admin/knowledge/BrandStory";
import ProdigiAPI from "./pages/admin/knowledge/ProdigiAPI";
import ProductImporting from "./pages/admin/knowledge/ProductImporting";
import ReadymadesFraming from "./pages/admin/knowledge/ReadymadesFraming";
import KnowledgeArticle from "./pages/admin/knowledge/Article";
import ContentMigration from "./pages/admin/ContentMigration";
import BrandStoryDashboard from "./pages/admin/BrandStoryDashboard";
import BrandTimeline from "./pages/admin/BrandTimeline";
import PosterHistoryExhibition from "./pages/admin/PosterHistoryExhibition";
import TagManagement from "./pages/admin/TagManagement";
import Pitch01 from "./pages/Pitch01";
import SyncioImport from "./pages/admin/SyncioImport";
import ImportQueue from "./pages/admin/ImportQueue";
import ArchiveManager from "./pages/admin/ArchiveManager";
import ProductManagement from "./pages/admin/ProductManagement";
import ProductTypeDetail from "./pages/admin/ProductTypeDetail";
import VariantGroupDetail from "./pages/admin/VariantGroupDetail";
import WireframeDashboard from "./pages/admin/WireframeDashboard";
import Wireframes from "./pages/Wireframes";
import WireframeIndex01 from "./pages/wireframes-01/index";
import WireframeHome01 from "./pages/wireframes-01/WireframeHome";
import WireframeProduct01 from "./pages/wireframes-01/WireframeProduct";
import WireframeCollection01 from "./pages/wireframes-01/WireframeCollection";
import { WireframeLayout as WireframeLayout01 } from "./pages/wireframes-01/WireframeLayout";
import { WireframeIndex as WireframeIndex02 } from "./pages/wireframes-02/index";
import { WireframeHome as WireframeHome02 } from "./pages/wireframes-02/WireframeHome";
import { WireframeProduct as WireframeProduct02 } from "./pages/wireframes-02/WireframeProduct";
import { WireframeCollection as WireframeCollection02 } from "./pages/wireframes-02/WireframeCollection";
import { WireframeLayout as WireframeLayout02 } from "./pages/wireframes-02/WireframeLayout";

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
            <Route path="/pitch01" element={<Pitch01 />} />
            <Route path="/poster-history" element={<PosterHistory />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/collections/:handle" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/wireframes" element={<Wireframes />} />
            
            {/* Wireframe Routes - Version 01 */}
            <Route path="/wireframes-01" element={<WireframeLayout01 />}>
              <Route index element={<WireframeIndex01 />} />
              <Route path="home" element={<WireframeHome01 />} />
              <Route path="product" element={<WireframeProduct01 />} />
              <Route path="collection" element={<WireframeCollection01 />} />
            </Route>
            
            {/* Wireframe Routes - Version 02 (The Poster Club) */}
            <Route path="/wireframes-02" element={<WireframeLayout02 />}>
              <Route index element={<WireframeIndex02 />} />
              <Route path="home" element={<WireframeHome02 />} />
              <Route path="product" element={<WireframeProduct02 />} />
              <Route path="collection" element={<WireframeCollection02 />} />
            </Route>
            
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
              <Route path="knowledge" element={<KnowledgeBase />} />
              <Route path="knowledge/sku-methodology" element={<SKUMethodology />} />
              <Route path="knowledge/partner-management" element={<PartnerManagementKB />} />
              <Route path="knowledge/brand-assets" element={<BrandAssets />} />
              <Route path="knowledge/task-management" element={<TaskManagementKB />} />
              <Route path="knowledge/artwork-catalog" element={<ArtworkCatalogKB />} />
              <Route path="knowledge/admin-brand-guide" element={<AdminBrandGuide />} />
              <Route path="knowledge/brand-story" element={<BrandStory />} />
              <Route path="knowledge/prodigi-api" element={<ProdigiAPI />} />
              <Route path="knowledge/product-importing" element={<ProductImporting />} />
              <Route path="knowledge/readymades-framing" element={<ReadymadesFraming />} />
              {/* Dynamic article route - must be after static routes */}
              <Route path="knowledge/article/:slug" element={<KnowledgeArticle />} />
              <Route path="knowledge/migrate" element={<ContentMigration />} />
              <Route path="brand-story" element={<BrandStoryDashboard />} />
              <Route path="brand-story/timeline" element={<BrandTimeline />} />
              <Route path="brand-story/poster-history" element={<PosterHistoryExhibition />} />
              <Route path="artworks" element={<ArtworkCatalog />} />
              <Route path="artworks/:artworkId" element={<ArtworkDetail />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="navigation" element={<NavigationManager />} />
              <Route path="partners" element={<PartnerManagement />} />
              <Route path="partners/:partnerId" element={<PartnerDetail />} />
              <Route path="partners/:partnerId/brands/:brandId/tags" element={<BrandTagManagement />} />
              <Route path="payouts" element={<Payouts />} />
              <Route path="tag-management" element={<TagManagement />} />
              <Route path="syncio-import" element={<SyncioImport />} />
              <Route path="import-queue" element={<ImportQueue />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="products/types/:typeId" element={<ProductTypeDetail />} />
              <Route path="products/groups/:groupId" element={<VariantGroupDetail />} />
              <Route path="knowledge/archive-manager" element={<ArchiveManager />} />
              <Route path="wireframes" element={<WireframeDashboard />} />
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
