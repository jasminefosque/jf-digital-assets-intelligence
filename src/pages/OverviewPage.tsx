import React from 'react';
import { useTimeSeries } from '../hooks/useData';
import { ChartCard } from '../components/charts/ChartCard';
import { TimeSeriesLineChart } from '../components/charts/TimeSeriesLineChart';
import { formatCurrency, formatNumber, formatPercent } from '../lib/utils';

export const OverviewPage: React.FC = () => {
  const btcPrice = useTimeSeries('btc_price');
  const volatility = useTimeSeries('volatility_proxy');
  const marketCap = useTimeSeries('total_crypto_market_cap');
  const stablecoinSupply = useTimeSeries('stablecoin_total_supply');
  const leverageRatio = useTimeSeries('leverage_ratio_proxy');
  const liquidityStress = useTimeSeries('crypto_liquidity_stress_index');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
        <p className="text-gray-600 mt-2">
          Comprehensive view of digital asset monetary infrastructure
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BTC Price */}
        {!btcPrice.loading && btcPrice.data && (
          <ChartCard
            title="BTC Price"
            subtitle="Bitcoin spot price with market regimes"
            definition="Daily Bitcoin price showing bull and bear market cycles"
            data={btcPrice.data}
            chartId="btc-price"
          >
            <TimeSeriesLineChart
              data={btcPrice.data}
              color="#f59e0b"
              yAxisFormatter={(v) => formatCurrency(v, 0)}
              tooltipFormatter={(v) => formatCurrency(v, 2)}
            />
          </ChartCard>
        )}
        
        {/* Volatility */}
        {!volatility.loading && volatility.data && (
          <ChartCard
            title="Volatility (30-day Realized)"
            subtitle="Annualized price volatility"
            definition="30-day realized volatility calculated from daily returns, annualized"
            data={volatility.data}
            chartId="volatility"
          >
            <TimeSeriesLineChart
              data={volatility.data}
              color="#ef4444"
              yAxisFormatter={(v) => formatPercent(v, 0)}
              tooltipFormatter={(v) => formatPercent(v, 1)}
            />
          </ChartCard>
        )}
        
        {/* Market Cap */}
        {!marketCap.loading && marketCap.data && (
          <ChartCard
            title="Total Crypto Market Cap"
            subtitle="Aggregate digital asset market capitalization"
            definition="Total market capitalization of major digital assets in trillions USD"
            data={marketCap.data}
            chartId="market-cap"
          >
            <TimeSeriesLineChart
              data={marketCap.data}
              color="#3b82f6"
              yAxisFormatter={(v) => `${formatNumber(v, 1)}T`}
              tooltipFormatter={(v) => `${formatNumber(v, 2)}T`}
            />
          </ChartCard>
        )}
        
        {/* Stablecoin Supply */}
        {!stablecoinSupply.loading && stablecoinSupply.data && (
          <ChartCard
            title="Stablecoin Total Supply"
            subtitle="Dollar-denominated liquidity rails"
            definition="Total stablecoin supply as proxy for dollar liquidity in digital asset markets"
            data={stablecoinSupply.data}
            chartId="stablecoin-supply"
          >
            <TimeSeriesLineChart
              data={stablecoinSupply.data}
              color="#10b981"
              yAxisFormatter={(v) => `${formatNumber(v, 0)}B`}
              tooltipFormatter={(v) => `${formatNumber(v, 2)}B`}
            />
          </ChartCard>
        )}
        
        {/* Leverage Ratio */}
        {!leverageRatio.loading && leverageRatio.data && (
          <ChartCard
            title="Leverage Ratio"
            subtitle="Open interest as % of market cap"
            definition="Futures open interest divided by market capitalization, indicating system leverage"
            data={leverageRatio.data}
            chartId="leverage-ratio"
          >
            <TimeSeriesLineChart
              data={leverageRatio.data}
              color="#8b5cf6"
              yAxisFormatter={(v) => formatPercent(v, 1)}
              tooltipFormatter={(v) => formatPercent(v, 2)}
            />
          </ChartCard>
        )}
        
        {/* Liquidity Stress Index */}
        {!liquidityStress.loading && liquidityStress.data && (
          <ChartCard
            title="Crypto Liquidity Stress Index"
            subtitle="Composite stress indicator (0-100)"
            definition="Composite index measuring market stress from volatility, leverage, and volume conditions"
            data={liquidityStress.data}
            chartId="liquidity-stress"
          >
            <TimeSeriesLineChart
              data={liquidityStress.data}
              color="#dc2626"
              yAxisFormatter={(v) => formatNumber(v, 0)}
              tooltipFormatter={(v) => formatNumber(v, 1)}
            />
          </ChartCard>
        )}
      </div>
    </div>
  );
};
