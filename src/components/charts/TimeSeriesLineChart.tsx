import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useAppStore } from '../../app/store';
import type { Event, TimeSeries } from '../../models/schemas';
import { formatChartDate } from '../../lib/utils';

interface TimeSeriesLineChartProps {
  data: TimeSeries;
  color?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
}

export const TimeSeriesLineChart: React.FC<TimeSeriesLineChartProps> = ({
  data,
  color = '#3b82f6',
  yAxisFormatter = (v) => v.toFixed(0),
  tooltipFormatter = (v) => v.toFixed(2),
}) => {
  const { showEvents, events, setSelectedEvent } = useAppStore();
  
  // Transform data for Recharts
  const chartData = data.observations.map(obs => ({
    date: obs.date,
    value: obs.value,
    dateLabel: formatChartDate(obs.date),
  }));
  
  // Filter events within the date range
  const visibleEvents = showEvents
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        const startDate = new Date(data.observations[0].date);
        const endDate = new Date(data.observations[data.observations.length - 1].date);
        return eventDate >= startDate && eventDate <= endDate;
      })
    : [];
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="dateLabel"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <YAxis
          tickFormatter={yAxisFormatter}
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <Tooltip
          formatter={(value: number | string | Array<number | string> | undefined) => {
            if (value === undefined) return ['—', data.label];
            return [tooltipFormatter(Number(value)), data.label];
          }}
          labelFormatter={(label) => label}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '8px',
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        
        {/* Event markers */}
        {visibleEvents.map((event) => (
          <ReferenceLine
            key={event.event_id}
            x={formatChartDate(event.date)}
            stroke="#ef4444"
            strokeWidth={1}
            strokeDasharray="3 3"
            label={{
              value: '⚠',
              position: 'top',
              style: { cursor: 'pointer', fontSize: 16 },
              onClick: () => handleEventClick(event),
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
