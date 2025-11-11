import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, UserPlus, FileCheck, Users, MapPin, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PartnerManagement = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Link to="/admin/knowledge">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Partner Management Workflow</h1>
          </div>
          <p className="text-muted-foreground">
            Complete guide to onboarding partners, managing relationships, and maintaining partner data
          </p>
        </div>

        {/* Overview */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-foreground mb-4">
            The Partner Management system is the foundation of Atlas's collaboration network. 
            It provides comprehensive tools for tracking partner information, brand relationships, 
            agreements, contacts, and addresses in a centralized, organized manner.
          </p>
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
            <p className="font-semibold">Core Purpose:</p>
            <p className="text-sm text-muted-foreground">
              Maintain professional relationships with brands and licensors while organizing 
              all necessary business data for smooth collaboration and legal compliance.
            </p>
          </div>
        </Card>

        {/* Partner Onboarding Process */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Onboarding New Partners</h2>
          </div>

          <div className="space-y-6">
            <div className="border-l-2 border-primary pl-4">
              <h3 className="font-semibold mb-2">Step 1: Create Partner Record</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Navigate to Partner Management and create a new partner entry with:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• <strong>Partner Name:</strong> Official business name</li>
                <li>• <strong>Partner Type:</strong> Brand, Licensor, Distributor, etc.</li>
                <li>• <strong>Status:</strong> Active, Pending, Inactive</li>
                <li>• <strong>Notes:</strong> Initial relationship context and background</li>
              </ul>
            </div>

            <div className="border-l-2 border-blue-600 pl-4">
              <h3 className="font-semibold mb-2">Step 2: Add Contact Information</h3>
              <p className="text-sm text-muted-foreground mb-2">
                In the Contacts tab, add all relevant stakeholders:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Primary contact (decision maker)</li>
                <li>• Secondary contacts (account managers, creative teams)</li>
                <li>• Contact details: Name, role, email, phone</li>
                <li>• Note contact preferences and best times to reach</li>
              </ul>
            </div>

            <div className="border-l-2 border-purple-600 pl-4">
              <h3 className="font-semibold mb-2">Step 3: Record Business Addresses</h3>
              <p className="text-sm text-muted-foreground mb-2">
                In the Addresses tab, document all relevant locations:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• <strong>Billing Address:</strong> For invoices and payments</li>
                <li>• <strong>Shipping Address:</strong> For physical deliverables</li>
                <li>• <strong>Legal Address:</strong> Registered business location</li>
                <li>• Mark primary address for default use</li>
              </ul>
            </div>

            <div className="border-l-2 border-green-600 pl-4">
              <h3 className="font-semibold mb-2">Step 4: Establish Brand Relationships</h3>
              <p className="text-sm text-muted-foreground mb-2">
                In the Brands tab, connect partner to their brand identities:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Create or link existing brand records</li>
                <li>• Upload brand logos and assets</li>
                <li>• Define brand colors (primary, secondary, accent)</li>
                <li>• Add taglines, brand stories, and social links</li>
              </ul>
            </div>

            <div className="border-l-2 border-orange-600 pl-4">
              <h3 className="font-semibold mb-2">Step 5: Document Agreements</h3>
              <p className="text-sm text-muted-foreground mb-2">
                In the Agreements tab, track all legal and business agreements:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Agreement type (License, Distribution, NDA, etc.)</li>
                <li>• Start and end dates with renewal tracking</li>
                <li>• Key terms and special conditions</li>
                <li>• Upload agreement documents for reference</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Partner Management Features */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Core Features</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Tabbed Interface</h3>
              <p className="text-sm text-muted-foreground">
                Organized tabs (Info/Brands/Agreements/Contacts/Addresses) keep partner data 
                structured and easily accessible without overwhelming the interface
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Search & Filter</h3>
              <p className="text-sm text-muted-foreground">
                Quickly find partners by name, type, or status. Filter lists to focus on 
                active partnerships or pending negotiations
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Multiple Contacts</h3>
              <p className="text-sm text-muted-foreground">
                Add unlimited contacts per partner with roles and contact preferences. 
                Track decision makers separately from operational contacts
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Agreement Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor agreement lifecycles with start/end dates. Get visibility into 
                expiring agreements for proactive renewal management
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Brand Asset Management</h3>
              <p className="text-sm text-muted-foreground">
                Store logos, brand colors, and identity information. Support bulk uploads 
                for efficient asset management across multiple brands
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Document Storage</h3>
              <p className="text-sm text-muted-foreground">
                Secure storage for agreements and partner documents with proper access 
                control through Row Level Security policies
              </p>
            </div>
          </div>
        </Card>

        {/* Best Practices */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Best Practices</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>1</Badge> Keep Information Current
              </h3>
              <p className="text-sm text-muted-foreground">
                Regularly update contact information, agreement statuses, and partner details. 
                Outdated information leads to miscommunication and missed opportunities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>2</Badge> Document Everything
              </h3>
              <p className="text-sm text-muted-foreground">
                Use the notes fields liberally. Capture conversation summaries, special 
                requirements, and relationship context that might be valuable later.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>3</Badge> Set Agreement Reminders
              </h3>
              <p className="text-sm text-muted-foreground">
                Review agreements 60-90 days before expiration. This gives adequate time 
                for renewal negotiations or transition planning if needed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>4</Badge> Organize Brand Assets Immediately
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload brand logos and define color schemes as soon as partnerships are 
                established. This prevents delays when creating branded materials later.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>5</Badge> Maintain Contact Hierarchy
              </h3>
              <p className="text-sm text-muted-foreground">
                Clearly identify primary vs. secondary contacts. Know who has authority 
                for different types of decisions (creative, legal, financial).
              </p>
            </div>
          </div>
        </Card>

        {/* Status Types */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Partner Status Types</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Badge className="bg-green-600">Active</Badge>
              <div>
                <p className="font-semibold text-sm">Current Partners</p>
                <p className="text-xs text-muted-foreground">
                  Partnerships with active agreements and ongoing collaborations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <Badge className="bg-yellow-600">Pending</Badge>
              <div>
                <p className="font-semibold text-sm">In Negotiation</p>
                <p className="text-xs text-muted-foreground">
                  Partnerships under discussion, agreement review, or onboarding process
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-500/10 border border-slate-500/20 rounded-lg">
              <Badge variant="secondary">Inactive</Badge>
              <div>
                <p className="font-semibold text-sm">Concluded Partnerships</p>
                <p className="text-xs text-muted-foreground">
                  Expired agreements or partnerships on hold. Maintain for historical reference
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Version 0.4.0</strong> - Partner Management Workflow - Admin Knowledge Base
          </p>
        </div>
      </main>
    </div>
  );
};

export default PartnerManagement;
