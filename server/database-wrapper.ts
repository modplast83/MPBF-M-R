
import { pool } from './db.js';

export class DatabaseWrapper {
  private maxRetries = 3;
  private retryDelay = 1000;

  async executeQuery(query: string, params?: any[]): Promise<any> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await pool.query(query, params);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.error(`Database query attempt ${attempt} failed:`, error);
        
        // Check if it's a connection error - properly type error
        const typedError = error as any;
        if (typedError?.code === '57P01' || typedError?.code === 'ECONNRESET') {
          if (attempt < this.maxRetries) {
            console.log(`Retrying in ${this.retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            this.retryDelay *= 2; // Exponential backoff
          }
        } else {
          // Non-connection error, don't retry
          throw error;
        }
      }
    }
    
    // This should never be null by this point, but add safety check
    if (lastError) {
      throw lastError;
    }
    throw new Error('Query failed after maximum retries');
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.executeQuery('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

export const dbWrapper = new DatabaseWrapper();
