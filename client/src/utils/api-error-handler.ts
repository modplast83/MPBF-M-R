// Comprehensive API error handling utilities

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class ApiErrorHandler {
  static async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const error: ApiError = {
        message: 'An error occurred',
        status: response.status,
      };

      try {
        const errorData = await response.json();
        error.message = errorData.message || errorData.error || 'Unknown error';
        error.code = errorData.code;
        error.details = errorData.details;
      } catch {
        // If JSON parsing fails, use status text
        error.message = response.statusText || `HTTP ${response.status}`;
      }

      // Handle specific status codes
      switch (response.status) {
        case 401:
          error.message = 'Authentication required. Please log in again.';
          break;
        case 403:
          error.message = 'You do not have permission to perform this action.';
          break;
        case 404:
          error.message = 'The requested resource was not found.';
          break;
        case 422:
          error.message = 'Invalid data provided. Please check your input.';
          break;
        case 429:
          error.message = 'Too many requests. Please try again later.';
          break;
        case 500:
          error.message = 'Internal server error. Please try again later.';
          break;
        case 503:
          error.message = 'Service unavailable. Please try again later.';
          break;
      }

      throw error;
    }

    return response.json();
  }

  static createFetchWithErrorHandling() {
    return async (url: string, options: RequestInit = {}): Promise<any> => {
      try {
        // Add default headers
        const defaultOptions: RequestInit = {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        };

        const response = await fetch(url, defaultOptions);
        return await this.handleResponse(response);
      } catch (error) {
        // Network errors
        if (error instanceof TypeError) {
          throw {
            message: 'Network error. Please check your connection and try again.',
            code: 'NETWORK_ERROR',
          } as ApiError;
        }

        // Re-throw API errors
        throw error;
      }
    };
  }

  static getErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      if ('message' in error && typeof error.message === 'string') {
        return error.message;
      }

      if ('error' in error && typeof error.error === 'string') {
        return error.error;
      }
    }

    return 'An unexpected error occurred';
  }

  static isApiError(error: unknown): error is ApiError {
    return (
      error !== null &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as any).message === 'string'
    );
  }

  static shouldRetry(error: ApiError): boolean {
    // Retry on network errors or temporary server errors
    return (
      error.code === 'NETWORK_ERROR' ||
      error.status === 408 || // Request timeout
      error.status === 429 || // Rate limit
      error.status === 500 || // Internal server error
      error.status === 502 || // Bad gateway
      error.status === 503 || // Service unavailable
      error.status === 504    // Gateway timeout
    );
  }
}

// Enhanced fetch with retry logic
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> {
  const apiFetch = ApiErrorHandler.createFetchWithErrorHandling();

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiFetch(url, options);
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      
      if (isLastAttempt || !ApiErrorHandler.isApiError(error) || !ApiErrorHandler.shouldRetry(error)) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
}

// React Query error handler
export function handleQueryError(error: unknown): void {
  console.error('Query error:', error);
  
  if (ApiErrorHandler.isApiError(error)) {
    // Log specific API errors for debugging
    console.error('API Error Details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details,
    });
  }
}

// Mutation error handler
export function handleMutationError(error: unknown): string {
  if (ApiErrorHandler.isApiError(error)) {
    return error.message;
  }
  
  return ApiErrorHandler.getErrorMessage(error);
}