# Metrics Documentation

This document defines all metrics tracked in the Digital Assets Intelligence dashboard.

## Market Size and Price

### Total Crypto Market Cap
- **ID**: `total_crypto_market_cap`
- **Unit**: Trillions USD
- **Definition**: Aggregate market capitalization of major digital assets (BTC + ETH + others)
- **Expected Range**: 0.8 - 3.5 trillion
- **Calculation**: (BTC price × BTC supply) + (ETH price × ETH supply) + (other assets)

### BTC Price
- **ID**: `btc_price`
- **Unit**: USD
- **Definition**: Bitcoin spot price
- **Expected Range**: 10,000 - 150,000
- **Source**: Synthetic regime-based price model

### ETH Price
- **ID**: `eth_price`
- **Unit**: USD
- **Definition**: Ethereum spot price  
- **Expected Range**: 500 - 10,000
- **Correlation**: 85% correlated to BTC

### Market Drawdown Percent
- **ID**: `market_drawdown_percent`
- **Unit**: Percent
- **Definition**: Current drawdown from peak price
- **Expected Range**: -100% to 0%
- **Calculation**: ((Current Price - Peak Price) / Peak Price) × 100

## Stablecoins and Dollar Rail Proxy

### Stablecoin Total Supply
- **ID**: `stablecoin_total_supply`
- **Unit**: Billions USD
- **Definition**: Aggregate stablecoin supply as proxy for dollar-denominated liquidity in digital asset markets
- **Expected Range**: 80 - 180 billion
- **Significance**: Expands in bull markets, contracts in risk-off periods

### Stablecoin Net Issuance (30d)
- **ID**: `stablecoin_net_issuance_30d`
- **Unit**: Billions USD
- **Definition**: 30-day change in stablecoin supply
- **Expected Range**: -10 to +15 billion
- **Calculation**: Current supply - Supply 30 days ago

### Stablecoin Velocity Proxy
- **ID**: `stablecoin_velocity_proxy`
- **Unit**: Index (normalized around 100)
- **Definition**: Normalized velocity of stablecoin circulation
- **Expected Range**: 70 - 120
- **Calculation**: (Transfer volume / Supply) × normalization factor

## On-Chain Liquidity and Activity

### On-Chain Transfer Volume
- **ID**: `on_chain_transfer_volume`
- **Unit**: Billions USD
- **Definition**: Daily on-chain transaction volume
- **Expected Range**: 10 - 150 billion
- **Correlation**: Increases with volatility and market cap

### Active Addresses Proxy
- **ID**: `active_addresses_proxy`
- **Unit**: Index (normalized around 100)
- **Definition**: Normalized active address count
- **Expected Range**: 60 - 120
- **Significance**: Proxy for network participation

### Network Fee Proxy
- **ID**: `network_fee_proxy`
- **Unit**: Millions USD
- **Definition**: Daily network fees as congestion indicator
- **Expected Range**: 2 - 50 million
- **Correlation**: Spikes during high on-chain activity and bull markets

## ETF Positioning

### BTC ETF Net Flows
- **ID**: `btc_etf_net_flows`
- **Unit**: Millions USD
- **Definition**: Daily net institutional ETF flows
- **Expected Range**: -500 to +800 million
- **Characteristics**: Exhibits flow persistence and momentum

### BTC ETF Cumulative Flows
- **ID**: `btc_etf_cumulative_flows`
- **Unit**: Billions USD
- **Definition**: Cumulative institutional ETF positioning since inception
- **Expected Range**: -5 to +30 billion
- **Calculation**: Running sum of daily net flows

### ETF Flow Momentum Score
- **ID**: `etf_flow_momentum_score`
- **Unit**: Score 0-100
- **Definition**: 20-day flow momentum indicator
- **Expected Range**: 0 - 100
- **Calculation**: Normalized 20-day average flow
- **Interpretation**: >70 = strong inflows, <30 = strong outflows

## Derivatives Leverage

### Futures Open Interest
- **ID**: `futures_open_interest`
- **Unit**: Billions USD
- **Definition**: Aggregate derivatives open interest across major exchanges
- **Expected Range**: 100 - 600 billion
- **Significance**: Indicates market leverage and positioning

### Leverage Ratio Proxy
- **ID**: `leverage_ratio_proxy`
- **Unit**: Percent
- **Definition**: Open interest as percentage of market capitalization
- **Expected Range**: 10% - 25%
- **Calculation**: (Open Interest / Market Cap) × 100
- **Thresholds**: >20% = high leverage, <12% = deleveraged

### Funding Rate Proxy
- **ID**: `funding_rate_proxy`
- **Unit**: Percent APR
- **Definition**: Perpetual futures funding rate (annualized)
- **Expected Range**: -5% to +15% APR
- **Interpretation**: Positive = longs pay shorts, negative = shorts pay longs

### Liquidation Volume Proxy
- **ID**: `liquidation_volume_proxy`
- **Unit**: Billions USD
- **Definition**: Estimated daily liquidation volume
- **Expected Range**: 0.2 - 10 billion
- **Correlation**: Spikes during high volatility and leverage

## Risk and Regime

### Volatility Proxy
- **ID**: `volatility_proxy`
- **Unit**: Percent annualized
- **Definition**: 30-day realized volatility calculated from daily returns
- **Expected Range**: 25% - 100%
- **Calculation**: Std dev of log returns × √252 × 100
- **Thresholds**: <40% = low vol, >70% = high vol

### Risk Regime
- **ID**: `risk_regime`
- **Unit**: Categorical
- **Definition**: Market risk classification
- **Values**: 
  - `risk_on`: Low volatility + high leverage
  - `neutral`: Moderate conditions
  - `risk_off`: High volatility or low leverage
- **Logic**:
  - Risk-off if vol >70% or leverage <12%
  - Risk-on if vol <40% and leverage >17%
  - Otherwise neutral

### Crypto Liquidity Stress Index
- **ID**: `crypto_liquidity_stress_index`
- **Unit**: Score 0-100
- **Definition**: Composite stress indicator from volatility, leverage, and volume conditions
- **Expected Range**: 0 - 100
- **Calculation**: Weighted composite of:
  - Volatility score (40%)
  - Inverse leverage score (30%)  
  - Inverse volume score (30%)
- **Thresholds**: >70 = high stress, <30 = low stress

## Data Quality Notes

All synthetic metrics are generated with:
- Regime-based dynamics (bull/bear/sideways)
- Realistic correlations between variables
- Volatility clustering
- Mean reversion properties
- Bounded ranges to maintain realism

For production use, replace synthetic generator with real data adapters maintaining the same schema.

## Metric Schema

All metrics conform to the `TimeSeries` schema:

```typescript
{
  metric_id: string;
  label: string;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  observations: {
    date: string;      // ISO 8601
    value: number;
  }[];
  asset?: 'BTC' | 'ETH' | 'TOTAL' | 'STABLES';
  notes?: string;
  source_type: 'synthetic' | 'open';
}
```

## Adding New Metrics

1. Update `SyntheticGenerator` with new calculation method
2. Cache generated data in `SyntheticDataProvider.generateAllData()`
3. Add metadata in `SyntheticDataProvider.getMetadata()`
4. Document metric in this file
5. Create chart component as needed
