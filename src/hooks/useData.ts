import { useState, useEffect } from 'react';
import type { TimeSeries } from '../models/schemas';
import { getDataProvider } from '../data';
import { useAppStore } from '../app/store';

export function useTimeSeries(metricId: string) {
  const [data, setData] = useState<TimeSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { dateRange, selectedAsset } = useAppStore();
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const provider = getDataProvider();
        const series = await provider.getSeries(metricId, {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          asset: selectedAsset,
        });
        
        if (isMounted) {
          setData(series);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [metricId, dateRange, selectedAsset]);
  
  return { data, loading, error };
}

export function useLatestValue(metricId: string) {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const provider = getDataProvider();
        const latest = await provider.getLatest(metricId);
        
        if (isMounted) {
          setValue(latest);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [metricId]);
  
  return { value, loading, error };
}

export function useEvents() {
  const { events, setEvents } = useAppStore();
  const { dateRange } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const provider = getDataProvider();
        const fetchedEvents = await provider.getEvents({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
        
        if (isMounted) {
          setEvents(fetchedEvents);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };
    
    fetchEvents();
    
    return () => {
      isMounted = false;
    };
  }, [dateRange, setEvents]);
  
  return { events, loading, error };
}
