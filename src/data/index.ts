import type { DataProvider } from './DataProvider';
import { SyntheticDataProvider } from './synthetic/SyntheticDataProvider';
import { OpenDataProvider } from './adapters/OpenDataProvider';

export type DataMode = 'synthetic' | 'open';

/**
 * Factory function to create the appropriate data provider based on environment
 */
export function createDataProvider(): DataProvider {
  const mode = (import.meta.env.VITE_DATA_MODE || 'synthetic') as DataMode;
  
  console.log(`[DataProvider] Initializing in ${mode} mode`);
  
  switch (mode) {
    case 'synthetic':
      return new SyntheticDataProvider();
    case 'open':
      return new OpenDataProvider();
    default:
      console.warn(`Unknown data mode: ${mode}, defaulting to synthetic`);
      return new SyntheticDataProvider();
  }
}

// Singleton instance
let providerInstance: DataProvider | null = null;

export function getDataProvider(): DataProvider {
  if (!providerInstance) {
    providerInstance = createDataProvider();
  }
  return providerInstance;
}
