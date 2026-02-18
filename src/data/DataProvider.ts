import { TimeSeries, Event } from '../models/schemas';

export interface GetSeriesParams {
  startDate?: string;
  endDate?: string;
  asset?: string;
}

export interface GetLatestParams {
  asset?: string;
}

export interface GetEventsParams {
  startDate?: string;
  endDate?: string;
  category?: string;
}

export interface DataProvider {
  getSeries(metricId: string, params?: GetSeriesParams): Promise<TimeSeries>;
  getLatest(metricId: string, params?: GetLatestParams): Promise<number>;
  getMetadata(metricId: string): Promise<Partial<TimeSeries>>;
  getEvents(params?: GetEventsParams): Promise<Event[]>;
}
