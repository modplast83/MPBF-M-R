
export class DatabaseWrapper {
  private maxRetries = 3;
  private retryDelay = 1000;

  async executeQuery(query: string, params?: any[]): Promise<any> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await pool.query(query, params);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.error(`Database query attempt ${attempt} failed:`, error);
        
        // Check if it's a connection error
        if (error.code === '57P01' || error.code === 'ECONNRESET') {
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
    
    throw lastError;
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
