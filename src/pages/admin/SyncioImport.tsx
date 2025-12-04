import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Json } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, FileSpreadsheet, Package, Check, AlertTriangle, Trash2, RefreshCw, Filter, ArrowRight, Loader2 } from "lucide-react";
import { useTranslateShopifyProducts } from "@/hooks/usePartnerProducts";

interface ParsedProduct {
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  status: string;
  variants: ParsedVariant[];
  images: string[];
  metafields: Record<string, any>;
}

interface ParsedVariant {
  sku: string;
  price: string;
  compareAtPrice: string;
  option1Name: string;
  option1Value: string;
  option2Name: string;
  option2Value: string;
  option3Name: string;
  option3Value: string;
  grams: number;
  image: string;
  costPerItem: string;
}

const SyncioImport = () => {
  const navigate = useNavigate();
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState<{
    total: number;
    imported: number;
    errors: number;
  } | null>(null);

  // Filter state
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Atlas Store ID and Partner ID - will be fetched dynamically
  const [storeId, setStoreId] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  // Translate mutation
  const translateMutation = useTranslateShopifyProducts();

  // Get unique product types for filter
  const productTypes = useMemo(() => {
    const types = new Set(parsedProducts.map(p => p.productType).filter(Boolean));
    return Array.from(types).sort();
  }, [parsedProducts]);

  // Filtered products based on type filter
  const filteredProducts = useMemo(() => {
    if (typeFilter === "all") return parsedProducts;
    return parsedProducts.filter(p => p.productType === typeFilter);
  }, [parsedProducts, typeFilter]);

  // Fetch Atlas store ID and partner ID on mount
  useEffect(() => {
    const fetchStoreId = async () => {
      const { data } = await supabase
        .from("shopify_stores")
        .select("id, partner_id")
        .eq("store_domain", "atlas-posters.myshopify.com")
        .single();
      if (data) {
        setStoreId(data.id);
        setPartnerId(data.partner_id);
      }
    };
    fetchStoreId();
  }, []);

  const parseCSV = (content: string): ParsedProduct[] => {
    // Parse CSV handling multi-line quoted fields
    const rows = parseCSVRows(content);
    if (rows.length < 2) return [];

    // Parse header
    const header = rows[0];
    const columnIndex: Record<string, number> = {};
    header.forEach((col, idx) => {
      columnIndex[col.trim()] = idx;
    });

    const products: Map<string, ParsedProduct> = new Map();

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i];
      const handle = values[columnIndex["Handle"]]?.trim();
      if (!handle) continue;

      // Get or create product
      let product = products.get(handle);
      if (!product) {
        product = {
          handle,
          title: values[columnIndex["Title"]]?.trim() || "",
          description: values[columnIndex["Body (HTML)"]]?.trim() || "",
          vendor: values[columnIndex["Vendor"]]?.trim() || "",
          productType: values[columnIndex["Type"]]?.trim() || "",
          tags: (values[columnIndex["Tags"]] || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          status: values[columnIndex["Status"]]?.trim() || "draft",
          variants: [],
          images: [],
          metafields: {
            about: values[columnIndex["About (product.metafields.custom.about)"]]?.trim(),
            destination: values[columnIndex["Filter: Destination (product.metafields.custom.destination)"]]?.trim(),
            edition: values[columnIndex["Product Edition (product.metafields.custom.product_edition)"]]?.trim(),
            genre: values[columnIndex["Genre (product.metafields.custom.mood)"]]?.trim(),
          },
        };
        products.set(handle, product);
      }

      // Add variant
      const sku = values[columnIndex["Variant SKU"]]?.trim();
      if (sku) {
        product.variants.push({
          sku,
          price: values[columnIndex["Variant Price"]]?.trim() || "0",
          compareAtPrice: values[columnIndex["Variant Compare At Price"]]?.trim() || "",
          option1Name: values[columnIndex["Option1 Name"]]?.trim() || "",
          option1Value: values[columnIndex["Option1 Value"]]?.trim() || "",
          option2Name: values[columnIndex["Option2 Name"]]?.trim() || "",
          option2Value: values[columnIndex["Option2 Value"]]?.trim() || "",
          option3Name: values[columnIndex["Option3 Name"]]?.trim() || "",
          option3Value: values[columnIndex["Option3 Value"]]?.trim() || "",
          grams: parseFloat(values[columnIndex["Variant Grams"]] || "0"),
          image: values[columnIndex["Variant Image"]]?.trim() || "",
          costPerItem: values[columnIndex["Cost per item"]]?.trim() || "",
        });
      }

      // Add image
      const imageSrc = values[columnIndex["Image Src"]]?.trim();
      if (imageSrc && !product.images.includes(imageSrc)) {
        product.images.push(imageSrc);
      }
    }

    return Array.from(products.values());
  };

  // Parse CSV into rows, handling multi-line quoted fields
  const parseCSVRows = (content: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = "";
    let inQuotes = false;
    
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const nextChar = content[i + 1];
      
      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            // Escaped quote
            currentField += '"';
            i++;
          } else {
            // End of quoted field
            inQuotes = false;
          }
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          currentRow.push(currentField);
          currentField = "";
        } else if (char === '\r' && nextChar === '\n') {
          // Windows line ending
          currentRow.push(currentField);
          currentField = "";
          if (currentRow.length > 0) rows.push(currentRow);
          currentRow = [];
          i++; // Skip \n
        } else if (char === '\n') {
          // Unix line ending
          currentRow.push(currentField);
          currentField = "";
          if (currentRow.length > 0) rows.push(currentRow);
          currentRow = [];
        } else {
          currentField += char;
        }
      }
    }
    
    // Don't forget the last field and row
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField);
      if (currentRow.length > 0) rows.push(currentRow);
    }
    
    return rows;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const products = parseCSV(content);
        setParsedProducts(products);
        toast.success(`Parsed ${products.length} products from CSV`);
      } catch (error) {
        console.error("Parse error:", error);
        toast.error("Failed to parse CSV file");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  const extractArtworkCode = (sku: string): string | null => {
    // Pattern: PREFIX-ARTWORKCODE or PREFIXSIZE-ARTWORKCODE
    // e.g., SPOE30X40-LKWAVEO → LKWAVEO
    // e.g., HMLE29.7X42-PAENGL1 → PAENGL1
    const parts = sku.split("-");
    if (parts.length >= 2) {
      return parts[parts.length - 1];
    }
    return null;
  };

  const importToDatabase = async () => {
    if (!storeId) {
      toast.error("Store not configured. Please set up SNB store first.");
      return;
    }

    setIsLoading(true);
    setImportProgress(0);
    setImportStats({ total: parsedProducts.length, imported: 0, errors: 0 });

    let imported = 0;
    let errors = 0;

    for (let i = 0; i < parsedProducts.length; i++) {
      const product = parsedProducts[i];
      try {
        // Generate a fake Shopify product ID for simulation
        const shopifyProductId = `snb_${product.handle}_${Date.now()}`;

        // Insert main product record
        const { error } = await supabase.from("shopify_products").insert([{
          shopify_store_id: storeId,
          shopify_product_id: shopifyProductId,
          title: product.title,
          handle: product.handle,
          product_type: product.productType,
          vendor: product.vendor,
          tags: product.tags,
          is_active: product.status === "active",
          raw_data: {
            description: product.description,
            images: product.images,
            variants: product.variants.map(v => ({
              sku: v.sku,
              price: v.price,
              compareAtPrice: v.compareAtPrice,
              option1Name: v.option1Name,
              option1Value: v.option1Value,
              option2Name: v.option2Name,
              option2Value: v.option2Value,
              option3Name: v.option3Name,
              option3Value: v.option3Value,
              grams: v.grams,
              image: v.image,
              costPerItem: v.costPerItem,
            })),
            metafields: product.metafields,
            artwork_codes: product.variants
              .map((v) => extractArtworkCode(v.sku))
              .filter(Boolean)
              .filter((v, i, a) => a.indexOf(v) === i),
          } as Json,
        }]);

        if (error) throw error;
        imported++;
      } catch (error) {
        console.error(`Error importing ${product.handle}:`, error);
        errors++;
      }

      setImportProgress(((i + 1) / parsedProducts.length) * 100);
      setImportStats({ total: parsedProducts.length, imported, errors });
    }

    setIsLoading(false);
    toast.success(`Imported ${imported} products (${errors} errors)`);
  };

  const clearImportedData = async () => {
    if (!storeId) return;

    const confirmed = window.confirm(
      "This will delete all imported SNB products from the database. Continue?"
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("shopify_products")
        .delete()
        .eq("shopify_store_id", storeId);

      if (error) throw error;
      toast.success("Cleared all SNB product data");
      setParsedProducts([]);
      setImportStats(null);
    } catch (error) {
      console.error("Clear error:", error);
      toast.error("Failed to clear data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Syncio Import Simulator</h1>
          </div>
          <p className="text-muted-foreground">
            Upload partner Shopify CSV exports to simulate Syncio product sync
          </p>
        </div>

        {/* Store Info */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold">Target Store: Atlas Posters</p>
                <p className="text-sm text-muted-foreground">atlas-posters.myshopify.com</p>
              </div>
            </div>
            {storeId ? (
              <Badge variant="default" className="bg-green-600">Connected</Badge>
            ) : (
              <Badge variant="destructive">Not Connected</Badge>
            )}
          </div>
        </Card>

        {/* Upload Zone */}
        <Card className="p-6 mb-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary">Drop the CSV file here...</p>
            ) : (
              <>
                <p className="text-foreground mb-1">Drag & drop a Shopify products CSV here</p>
                <p className="text-sm text-muted-foreground">or click to select file</p>
              </>
            )}
          </div>
        </Card>

        {/* Progress */}
        {isLoading && (
          <Card className="p-4 mb-6">
            <div className="flex items-center gap-4">
              <Progress value={importProgress} className="flex-1" />
              <span className="text-sm font-medium">{Math.round(importProgress)}%</span>
            </div>
          </Card>
        )}

        {/* Import Stats */}
        {importStats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4 text-center">
              <FileSpreadsheet className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{importStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </Card>
            <Card className="p-4 text-center">
              <Check className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{importStats.imported}</p>
              <p className="text-sm text-muted-foreground">Imported</p>
            </Card>
            <Card className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-destructive" />
              <p className="text-2xl font-bold text-destructive">{importStats.errors}</p>
              <p className="text-sm text-muted-foreground">Errors</p>
            </Card>
          </div>
        )}

        {/* Next Steps - Translate to Partner Products */}
        {importStats && importStats.imported > 0 && (
          <Card className="p-6 mb-6 border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Next Step: Translate to Partner Products</h3>
                <p className="text-sm text-muted-foreground">
                  Move imported Shopify products to the staging layer for artwork mapping
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/import-queue")}
                >
                  View Import Queue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => partnerId && translateMutation.mutate(partnerId)}
                  disabled={!partnerId || translateMutation.isPending}
                >
                  {translateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  Translate to Partner Products
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Parsed Products Preview */}
        {parsedProducts.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold">
                  Parsed Products ({filteredProducts.length}
                  {typeFilter !== "all" && ` of ${parsedProducts.length}`})
                </h2>
                
                {/* Type Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types ({parsedProducts.length})</SelectItem>
                      {productTypes.map(type => {
                        const count = parsedProducts.filter(p => p.productType === type).length;
                        return (
                          <SelectItem key={type} value={type}>
                            {type} ({count})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={clearImportedData}
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear DB Data
                </Button>
                <Button
                  onClick={importToDatabase}
                  disabled={isLoading || !storeId}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import to Database
                </Button>
              </div>
            </div>

            <div className="rounded-md border overflow-auto max-h-[500px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Handle</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Variants</TableHead>
                    <TableHead>Artwork Codes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.slice(0, 100).map((product) => {
                    const artworkCodes = product.variants
                      .map((v) => extractArtworkCode(v.sku))
                      .filter(Boolean)
                      .filter((v, i, a) => a.indexOf(v) === i);

                    return (
                      <TableRow key={product.handle}>
                        <TableCell className="font-mono text-xs">
                          {product.handle.substring(0, 30)}...
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {product.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.productType}</Badge>
                        </TableCell>
                        <TableCell>{product.variants.length}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {artworkCodes.map((code) => (
                              <Badge key={code} variant="secondary" className="font-mono text-xs">
                                {code}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={product.status === "active" ? "default" : "secondary"}
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {filteredProducts.length > 100 && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Showing first 100 of {filteredProducts.length} products
              </p>
            )}
          </Card>
        )}
      </main>
    </div>
  );
};

export default SyncioImport;
