import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BrandSelectorProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  includeGlobal?: boolean;
}

export const BrandSelector = ({ value, onChange, includeGlobal = true }: BrandSelectorProps) => {
  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("id, brand_name")
        .eq("is_active", true)
        .order("brand_name");

      if (error) throw error;
      return data;
    },
  });

  return (
    <Select value={value || "global"} onValueChange={(val) => onChange(val === "global" ? null : val)}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a brand" />
      </SelectTrigger>
      <SelectContent>
        {includeGlobal && (
          <SelectItem value="global">Atlas Global Content</SelectItem>
        )}
        {brands.map((brand) => (
          <SelectItem key={brand.id} value={brand.id}>
            {brand.brand_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
