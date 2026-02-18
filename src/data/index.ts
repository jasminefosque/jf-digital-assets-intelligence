import type { DataProvider } from './DataProvider';
import { SyntheticDataProvider } from './synthetic/SyntheticDataProvider';

/**
 * Factory function to create the data provider
 * This example dashboard uses synthetic data only
 * 
 * To add real data sources:
 * 1. Create a new provider class implementing DataProvider interface
 * 2. Import and instantiate it here
 * 3. Update environment configuration as needed
 */
export function createDataProvider(): DataProvider {
  return new SyntheticDataProvider();
}

// Singleton instance
let providerInstance: DataProvider | null = null;

export function getDataProvider(): DataProvider {
  if (!providerInstance) {
    providerInstance = createDataProvider();
  }
  return providerInstance;
}
