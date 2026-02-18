import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { TimeSeries } from '../../models/schemas';
import { formatChartDate } from '../../lib/utils';

interface DualAxisChartProps {
  leftSeries: TimeSeries;
  rightSeries: TimeSeries;
  leftColor?: string;
  rightColor?: string;
  leftFormatter?: (value: number) => string;
  rightFormatter?: (value: number) => string;
}

export const DualAxisChart: React.FC<DualAxisChartProps> = ({
  leftSeries,
  rightSeries,
  leftColor = '#3b82f6',
  rightColor = '#10b981',
  leftFormatter = (v) => v.toFixed(0),
  rightFormatter = (v) => v.toFixed(0),
}) => {
  // Merge data from both series
  const chartData = leftSeries.observations.map((obs, i) => ({
    date: obs.date,
    dateLabel: formatChartDate(obs.date),
    left: obs.value,
    right: rightSeries.observations[i]?.value || 0,
  }));
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 50, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="dateLabel"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <YAxis
          yAxisId="left"
          tickFormatter={leftFormatter}
          tick={{ fontSize: 12 }}
          stroke={leftColor}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={rightFormatter}
          tick={{ fontSize: 12 }}
          stroke={rightColor}
        />
        <Tooltip
          formatter={(value: number | string | Array<number | string> | undefined, name: string | undefined) => {
            if (value === undefined || name === undefined) return ['—', ''];
            const formatter = name === 'left' ? leftFormatter : rightFormatter;
            const label = name === 'left' ? leftSeries.label : rightSeries.label;
            return [formatter(Number(value)), label];
          }}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '8px',
          }}
        />
        <Legend
          formatter={(value) => value === 'left' ? leftSeries.label : rightSeries.label}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="left"
          stroke={leftColor}
          strokeWidth={2}
          dot={false}
          name="left"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="right"
          stroke={rightColor}
          strokeWidth={2}
          dot={false}
          name="right"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
