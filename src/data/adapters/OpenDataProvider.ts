import { DataProvider, GetSeriesParams, GetLatestParams, GetEventsParams } from '../DataProvider';
import { TimeSeries, Event } from '../../models/schemas';

/**
 * OpenDataProvider - Stub implementation for open data sources
 * TODO: Implement with keyless, free open data endpoints
 * 
 * Potential sources (all must be keyless and free):
 * - CoinGecko public API (rate limited but free)
 * - Blockchain.com public endpoints
 * - Other decentralized data sources
 */
export class OpenDataProvider implements DataProvider {
  async getSeries(metricId: string, params?: GetSeriesParams): Promise<TimeSeries> {
    // TODO: Implement real data fetching
    throw new Error('OpenDataProvider not yet implemented. Use synthetic mode or implement a specific adapter.');
  }
  
  async getLatest(metricId: string, params?: GetLatestParams): Promise<number> {
    // TODO: Implement real data fetching
    throw new Error('OpenDataProvider not yet implemented. Use synthetic mode or implement a specific adapter.');
  }
  
  async getMetadata(metricId: string): Promise<Partial<TimeSeries>> {
    // TODO: Implement metadata retrieval
    throw new Error('OpenDataProvider not yet implemented. Use synthetic mode or implement a specific adapter.');
  }
  
  async getEvents(params?: GetEventsParams): Promise<Event[]> {
    // TODO: Implement event retrieval
    // Could parse from news APIs, on-chain governance, etc.
    throw new Error('OpenDataProvider not yet implemented. Use synthetic mode or implement a specific adapter.');
  }
}
