// Type safety utilities to prevent runtime errors

export function isValidNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

export function isValidString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidArray<T>(value: any): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

export function safeParseInt(value: any, fallback: number = 0): number {
  if (typeof value === 'number') return Math.floor(value);
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

export function safeParseFloat(value: any, fallback: number = 0): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

export function safeStringAccess(obj: any, key: string, fallback: string = ''): string {
  try {
    return obj && typeof obj[key] === 'string' ? obj[key] : fallback;
  } catch {
    return fallback;
  }
}

export function safeArrayAccess<T>(arr: any, index: number, fallback: T): T {
  try {
    return Array.isArray(arr) && arr[index] !== undefined ? arr[index] : fallback;
  } catch {
    return fallback;
  }
}

// Safe object property access
export function safeGet<T>(obj: any, path: string, fallback: T): T {
  try {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined) {
        return fallback;
      }
      current = current[key];
    }
    
    return current !== undefined ? current : fallback;
  } catch {
    return fallback;
  }
}

// Validate form data structure
export function validateFormData(data: any, requiredFields: string[]): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!data || data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

// API response validation
export function validateApiResponse(response: any, expectedFields: string[]): boolean {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  return expectedFields.every(field => response.hasOwnProperty(field));
}