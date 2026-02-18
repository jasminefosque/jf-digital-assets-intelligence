import React from 'react';
import { useLatestValue } from '../../hooks/useData';
import { formatCurrency, formatLargeNumber, formatNumber, formatPercent } from '../../lib/utils';

interface KPICardProps {
  label: string;
  metricId: string;
  format: 'currency' | 'number' | 'percent' | 'large';
  unit?: string;
}

const KPICard: React.FC<KPICardProps> = ({ label, metricId, format, unit }) => {
  const { value, loading } = useLatestValue(metricId);
  
  const formatValue = (val: number | null) => {
    if (val === null) return '—';
    
    switch (format) {
      case 'currency':
        return formatCurrency(val, 0);
      case 'number':
        return formatNumber(val, 1);
      case 'percent':
        return formatPercent(val, 1);
      case 'large':
        return formatLargeNumber(val, 2);
      default:
        return val.toString();
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-2 flex items-baseline">
        {loading ? (
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <>
            <div className="text-2xl font-semibold text-gray-900">
              {formatValue(value)}
            </div>
            {unit && <span className="ml-2 text-sm text-gray-500">{unit}</span>}
          </>
        )}
      </div>
    </div>
  );
};

export const KPIStrip: React.FC = () => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard label="BTC Price" metricId="btc_price" format="currency" />
        <KPICard label="Market Cap" metricId="total_crypto_market_cap" format="large" unit="T" />
        <KPICard label="Stablecoin Supply" metricId="stablecoin_total_supply" format="large" unit="B" />
        <KPICard label="ETF Net Flows (30d)" metricId="btc_etf_cumulative_flows" format="large" unit="B" />
        <KPICard label="Leverage Ratio" metricId="leverage_ratio_proxy" format="percent" />
        <KPICard label="Liquidity Stress" metricId="crypto_liquidity_stress_index" format="number" />
      </div>
    </div>
  );
};
