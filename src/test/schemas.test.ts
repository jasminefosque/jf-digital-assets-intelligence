import { describe, it, expect } from 'vitest';
import { 
  TimeSeriesSchema, 
  EventSchema, 
  FrequencySchema, 
  AssetSchema,
  EventCategorySchema,
  RiskRegimeSchema 
} from '../models/schemas';

describe('Zod Schema Validation', () => {
  describe('FrequencySchema', () => {
    it('should accept valid frequency values', () => {
      expect(() => FrequencySchema.parse('daily')).not.toThrow();
      expect(() => FrequencySchema.parse('weekly')).not.toThrow();
      expect(() => FrequencySchema.parse('monthly')).not.toThrow();
    });
    
    it('should reject invalid frequency values', () => {
      expect(() => FrequencySchema.parse('hourly')).toThrow();
      expect(() => FrequencySchema.parse('yearly')).toThrow();
    });
  });
  
  describe('AssetSchema', () => {
    it('should accept valid asset values', () => {
      expect(() => AssetSchema.parse('BTC')).not.toThrow();
      expect(() => AssetSchema.parse('ETH')).not.toThrow();
      expect(() => AssetSchema.parse('TOTAL')).not.toThrow();
      expect(() => AssetSchema.parse('STABLES')).not.toThrow();
    });
    
    it('should reject invalid asset values', () => {
      expect(() => AssetSchema.parse('SOL')).toThrow();
      expect(() => AssetSchema.parse('BNB')).toThrow();
    });
  });
  
  describe('TimeSeriesSchema', () => {
    it('should validate a complete time series object', () => {
      const validTimeSeries = {
        metric_id: 'btc_price',
        label: 'BTC Price',
        unit: 'USD',
        frequency: 'daily' as const,
        observations: [
          { date: '2024-01-01T00:00:00.000Z', value: 45000 },
          { date: '2024-01-02T00:00:00.000Z', value: 46000 },
        ],
        asset: 'BTC' as const,
        notes: 'Test data',
        source_type: 'synthetic' as const,
      };
      
      expect(() => TimeSeriesSchema.parse(validTimeSeries)).not.toThrow();
      const parsed = TimeSeriesSchema.parse(validTimeSeries);
      expect(parsed.metric_id).toBe('btc_price');
      expect(parsed.observations).toHaveLength(2);
    });
    
    it('should accept time series without optional fields', () => {
      const minimalTimeSeries = {
        metric_id: 'test_metric',
        label: 'Test Metric',
        unit: 'Units',
        frequency: 'daily' as const,
        observations: [
          { date: '2024-01-01T00:00:00.000Z', value: 100 },
        ],
        source_type: 'synthetic' as const,
      };
      
      expect(() => TimeSeriesSchema.parse(minimalTimeSeries)).not.toThrow();
    });
    
    it('should reject invalid time series', () => {
      const invalidTimeSeries = {
        metric_id: 'test',
        label: 'Test',
        unit: 'Units',
        frequency: 'invalid',
        observations: [],
        source_type: 'synthetic',
      };
      
      expect(() => TimeSeriesSchema.parse(invalidTimeSeries)).toThrow();
    });
  });
  
  describe('EventSchema', () => {
    it('should validate a complete event object', () => {
      const validEvent = {
        event_id: 'test_event',
        label: 'Test Event',
        date: '2024-01-01T00:00:00.000Z',
        category: 'market' as const,
        severity: 3,
        description: 'Test event description',
      };
      
      expect(() => EventSchema.parse(validEvent)).not.toThrow();
      const parsed = EventSchema.parse(validEvent);
      expect(parsed.event_id).toBe('test_event');
      expect(parsed.severity).toBe(3);
    });
    
    it('should reject events with invalid severity', () => {
      const invalidEvent = {
        event_id: 'test',
        label: 'Test',
        date: '2024-01-01T00:00:00.000Z',
        category: 'market' as const,
        severity: 6, // Invalid: must be 1-5
        description: 'Test',
      };
      
      expect(() => EventSchema.parse(invalidEvent)).toThrow();
    });
    
    it('should reject events with invalid category', () => {
      const invalidEvent = {
        event_id: 'test',
        label: 'Test',
        date: '2024-01-01T00:00:00.000Z',
        category: 'invalid',
        severity: 3,
        description: 'Test',
      };
      
      expect(() => EventSchema.parse(invalidEvent)).toThrow();
    });
  });
  
  describe('EventCategorySchema', () => {
    it('should accept valid event categories', () => {
      expect(() => EventCategorySchema.parse('policy')).not.toThrow();
      expect(() => EventCategorySchema.parse('market')).not.toThrow();
      expect(() => EventCategorySchema.parse('microstructure')).not.toThrow();
      expect(() => EventCategorySchema.parse('regulation')).not.toThrow();
      expect(() => EventCategorySchema.parse('liquidity')).not.toThrow();
    });
  });
  
  describe('RiskRegimeSchema', () => {
    it('should accept valid risk regime values', () => {
      expect(() => RiskRegimeSchema.parse('risk_on')).not.toThrow();
      expect(() => RiskRegimeSchema.parse('neutral')).not.toThrow();
      expect(() => RiskRegimeSchema.parse('risk_off')).not.toThrow();
    });
  });
});
