import { z } from 'zod';

// Frequency enum
export const FrequencySchema = z.enum(['daily', 'weekly', 'monthly']);
export type Frequency = z.infer<typeof FrequencySchema>;

// Asset enum
export const AssetSchema = z.enum(['BTC', 'ETH', 'TOTAL', 'STABLES']);
export type Asset = z.infer<typeof AssetSchema>;

// Source type enum
export const SourceTypeSchema = z.enum(['synthetic', 'open']);
export type SourceType = z.infer<typeof SourceTypeSchema>;

// Observation schema
export const ObservationSchema = z.object({
  date: z.string().datetime(), // ISO 8601 string
  value: z.number(),
});
export type Observation = z.infer<typeof ObservationSchema>;

// TimeSeries schema
export const TimeSeriesSchema = z.object({
  metric_id: z.string(),
  label: z.string(),
  unit: z.string(),
  frequency: FrequencySchema,
  observations: z.array(ObservationSchema),
  asset: AssetSchema.optional(),
  notes: z.string().optional(),
  source_type: SourceTypeSchema,
});
export type TimeSeries = z.infer<typeof TimeSeriesSchema>;

// Event category enum
export const EventCategorySchema = z.enum([
  'policy',
  'market',
  'microstructure',
  'regulation',
  'liquidity',
]);
export type EventCategory = z.infer<typeof EventCategorySchema>;

// Event schema
export const EventSchema = z.object({
  event_id: z.string(),
  label: z.string(),
  date: z.string().datetime(),
  category: EventCategorySchema,
  severity: z.number().min(1).max(5),
  description: z.string(),
});
export type Event = z.infer<typeof EventSchema>;

// Risk regime enum
export const RiskRegimeSchema = z.enum(['risk_on', 'neutral', 'risk_off']);
export type RiskRegime = z.infer<typeof RiskRegimeSchema>;
