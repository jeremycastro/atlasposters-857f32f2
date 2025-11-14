/**
 * Variant code validation utilities for SKU system
 * Ensures variant codes comply with 00-98 range (99 reserved for N/A)
 */

/**
 * Validates that a variant code is exactly 2 digits and in range 00-98
 * @param code - The variant code to validate
 * @returns true if valid, false otherwise
 */
export function isValidVariantCode(code: string): boolean {
  // Must be exactly 2 digits
  if (!/^\d{2}$/.test(code)) {
    return false;
  }

  const num = parseInt(code, 10);
  
  // Must be between 00-98 (99 is reserved for N/A placeholder)
  return num >= 0 && num <= 98;
}

/**
 * Validates a full SKU format
 * @param sku - The full SKU to validate
 * @returns true if valid, false otherwise
 */
export function isValidSKU(sku: string): boolean {
  // Format: {ASC}-{TYPE}-{VAR1}-{VAR2}-{VAR3}
  // ASC: 2 digits + 1 letter + 3 digits (e.g., 11K001)
  // TYPE: 3 uppercase letters (e.g., UTS, PST)
  // VAR1, VAR2, VAR3: 2 digits each (00-99, where 99 = N/A)
  const skuPattern = /^[0-9]{2}[A-Z][0-9]{3}-[A-Z]{3}-[0-9]{2}-[0-9]{2}-[0-9]{2}$/;
  
  if (!skuPattern.test(sku)) {
    return false;
  }

  // Check length constraint (max 20 characters)
  return sku.length <= 20;
}

/**
 * Parses a SKU into its components
 * @param sku - The full SKU to parse
 * @returns Parsed SKU components or null if invalid
 */
export function parseSKU(sku: string): {
  ascCode: string;
  typeCode: string;
  var1: string;
  var2: string;
  var3: string;
} | null {
  const pattern = /^([0-9]{2}[A-Z][0-9]{3})-([A-Z]{3})-([0-9]{2})-([0-9]{2})-([0-9]{2})$/;
  const match = sku.match(pattern);

  if (!match) {
    return null;
  }

  return {
    ascCode: match[1],
    typeCode: match[2],
    var1: match[3],
    var2: match[4],
    var3: match[5],
  };
}

/**
 * Builds a full SKU from components
 * @param ascCode - The artwork ASC code
 * @param typeCode - The product type code
 * @param var1 - First variant dimension (defaults to '99')
 * @param var2 - Second variant dimension (defaults to '99')
 * @param var3 - Third variant dimension (defaults to '99')
 * @returns The complete SKU string
 */
export function buildSKU(
  ascCode: string,
  typeCode: string,
  var1: string = '99',
  var2: string = '99',
  var3: string = '99'
): string {
  return `${ascCode}-${typeCode}-${var1}-${var2}-${var3}`;
}

/**
 * Checks if a variant code represents N/A (not applicable)
 * @param code - The variant code to check
 * @returns true if code is '99' (N/A), false otherwise
 */
export function isNACode(code: string): boolean {
  return code === '99';
}

/**
 * Determines SKU dimensionality (2D or 3D) based on VAR3
 * @param sku - The full SKU or just VAR3 code
 * @returns '2D' if VAR3 is 99, '3D' otherwise
 */
export function getSKUDimensionality(sku: string): '2D' | '3D' {
  const parsed = parseSKU(sku);
  if (!parsed) return '2D';
  
  return isNACode(parsed.var3) ? '2D' : '3D';
}

/**
 * Generates error message for invalid variant code
 * @param code - The invalid code
 * @returns User-friendly error message
 */
export function getVariantCodeError(code: string): string {
  if (!code) {
    return 'Variant code is required';
  }
  
  if (!/^\d{2}$/.test(code)) {
    return 'Variant code must be exactly 2 digits (e.g., 01, 15, 42)';
  }

  const num = parseInt(code, 10);
  if (num === 99) {
    return 'Code 99 is reserved for N/A placeholder. Use codes 00-98.';
  }
  
  if (num < 0 || num > 98) {
    return 'Variant code must be between 00 and 98';
  }

  return 'Invalid variant code';
}
