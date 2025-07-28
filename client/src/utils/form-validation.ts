// Enhanced form validation utilities

import { z } from 'zod';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  data?: any;
}

export class FormValidator {
  static validateRequired(value: any, fieldName: string): string | null {
    if (value === undefined || value === null || value === '') {
      return `${fieldName} is required`;
    }
    return null;
  }

  static validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  static validateMinLength(value: string, minLength: number, fieldName: string): string | null {
    if (value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters long`;
    }
    return null;
  }

  static validatePositiveNumber(value: any, fieldName: string): string | null {
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return `${fieldName} must be a positive number`;
    }
    return null;
  }

  static validateNonNegativeNumber(value: any, fieldName: string): string | null {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      return `${fieldName} must be a non-negative number`;
    }
    return null;
  }

  static validateArrayNotEmpty(array: any[], fieldName: string): string | null {
    if (!Array.isArray(array) || array.length === 0) {
      return `${fieldName} must contain at least one item`;
    }
    return null;
  }

  static validateProductSelection(products: any[]): ValidationResult {
    const errors: Record<string, string> = {};

    if (!Array.isArray(products) || products.length === 0) {
      errors.products = 'At least one product must be selected';
      return { isValid: false, errors };
    }

    products.forEach((product, index) => {
      if (!product.productId || product.productId <= 0) {
        errors[`product_${index}_id`] = `Product ${index + 1}: Please select a valid product`;
      }

      if (!product.quantity || product.quantity <= 0) {
        errors[`product_${index}_quantity`] = `Product ${index + 1}: Quantity must be greater than 0`;
      }
    });

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  static validateOrderForm(data: any): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate customer selection
    if (!data.customerId) {
      errors.customerId = 'Please select a customer';
    }

    // Validate products
    const productValidation = this.validateProductSelection(data.products || []);
    if (!productValidation.isValid) {
      Object.assign(errors, productValidation.errors);
    }

    // Validate notes if provided
    if (data.notes && data.notes.length > 1000) {
      errors.notes = 'Notes cannot exceed 1000 characters';
    }

    return { isValid: Object.keys(errors).length === 0, errors, data };
  }

  static createZodSchema() {
    return {
      orderForm: z.object({
        customerId: z.string().min(1, 'Customer is required'),
        products: z.array(z.object({
          productId: z.number().min(1, 'Product is required'),
          quantity: z.number().min(1, 'Quantity must be at least 1'),
        })).min(1, 'At least one product is required'),
        notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
      }),

      customerForm: z.object({
        name: z.string().min(1, 'Customer name is required'),
        nameAr: z.string().optional(),
        code: z.string().min(1, 'Customer code is required'),
        email: z.string().email('Invalid email address').optional(),
        phone: z.string().optional(),
      }),

      productForm: z.object({
        itemId: z.string().min(1, 'Item is required'),
        categoryId: z.string().min(1, 'Category is required'),
        sizeCaption: z.string().min(1, 'Size caption is required'),
        width: z.number().min(0, 'Width must be non-negative').optional(),
        lengthCm: z.number().min(0, 'Length must be non-negative').optional(),
        thickness: z.number().min(0, 'Thickness must be non-negative').optional(),
      }),

      userForm: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        email: z.string().email('Invalid email address').optional(),
        firstName: z.string().min(1, 'First name is required').optional(),
        lastName: z.string().min(1, 'Last name is required').optional(),
        sectionId: z.string().optional(),
      }),
    };
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static sanitizeFormData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeInput(item) : item
        );
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

// Form validation hooks
export function useFormValidation(schema: z.ZodSchema) {
  return (data: any): ValidationResult => {
    try {
      const validatedData = schema.parse(data);
      return { isValid: true, errors: {}, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { general: 'Validation failed' } };
    }
  };
}