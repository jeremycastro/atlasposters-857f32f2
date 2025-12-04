import { lazy, ComponentType } from "react";

// Dynamic archive loader
// When archiving, files are named like: ProductImporting.v1.tsx
// This loader helps us dynamically import archived versions

type ArchivedComponents = Record<string, Record<number, React.LazyExoticComponent<ComponentType>>>;

// This will be populated as archives are created
// Format: { "slug": { versionNumber: LazyComponent } }
export const archivedComponents: ArchivedComponents = {
  // Example structure (populated when archives are created):
  // "product-importing": {
  //   1: lazy(() => import("./ProductImporting.v1")),
  // },
};

// Helper function to get an archived component
export function getArchivedComponent(
  slug: string,
  version: number
): React.LazyExoticComponent<ComponentType> | null {
  const slugArchives = archivedComponents[slug];
  if (!slugArchives) return null;
  return slugArchives[version] || null;
}

// Helper to check if an archived version exists
export function hasArchivedVersion(slug: string, version: number): boolean {
  return !!archivedComponents[slug]?.[version];
}

// Get all available archived versions for a slug
export function getArchivedVersions(slug: string): number[] {
  const slugArchives = archivedComponents[slug];
  if (!slugArchives) return [];
  return Object.keys(slugArchives).map(Number).sort((a, b) => b - a);
}
