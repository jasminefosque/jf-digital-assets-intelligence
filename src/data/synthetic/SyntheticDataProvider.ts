import { DataProvider, GetSeriesParams, GetLatestParams, GetEventsParams } from '../DataProvider';
import { TimeSeries, Event } from '../../models/schemas';
import { SyntheticGenerator } from './generator';
import { generateSyntheticEvents } from './events';

/**
 * SyntheticDataProvider - Fully implemented data provider using synthetic data
 * Generates realistic digital asset market structure data
 */
export class SyntheticDataProvider implements DataProvider {
  private generator: SyntheticGenerator;
  private dailyDates: Date[];
  private cachedData: Map<string, any> = new Map();
  private events: Event[] = [];
  
  constructor() {
    // Generate 2 years of data ending today
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 2);
    
    this.generator = new SyntheticGenerator(startDate, endDate);
    this.dailyDates = this.generator.generateDailyDates();
    
    // Pre-generate all data
    this.generateAllData();
  }
  
  private generateAllData(): void {
    // Generate core price data
    const btcPrices = this.generator.generateBTCPrice(this.dailyDates);
    const ethPrices = this.generator.generateETHPrice(btcPrices);
    const marketCap = this.generator.generateMarketCap(btcPrices, ethPrices);
    
    // Generate volatility and drawdown
    const volatility = this.generator.generateVolatility(btcPrices, this.dailyDates);
    const drawdown = this.generator.generateDrawdown(btcPrices);
    
    // Generate stablecoin data
    const stablecoinSupply = this.generator.generateStablecoinSupply(this.dailyDates, marketCap);
    const stablecoinIssuance = this.generator.generateStablecoinIssuance(stablecoinSupply);
    const stablecoinVelocity = this.generator.generateStablecoinVelocity(
      this.generator.generateOnChainVolume(this.dailyDates, volatility, marketCap),
      stablecoinSupply
    );
    
    // Generate on-chain data
    const onChainVolume = this.generator.generateOnChainVolume(this.dailyDates, volatility, marketCap);
    const activeAddresses = this.generator.generateActiveAddresses(onChainVolume);
    const networkFees = this.generator.generateNetworkFees(onChainVolume, this.dailyDates);
    
    // Generate ETF data
    const etfFlows = this.generator.generateETFFlows(this.dailyDates, btcPrices);
    const etfCumulativeFlows = this.generator.generateCumulativeETFFlows(etfFlows);
    const etfMomentum = this.generator.generateETFMomentum(etfFlows);
    
    // Generate derivatives data
    const futuresOI = this.generator.generateFuturesOI(this.dailyDates, marketCap);
    const leverageRatio = this.generator.generateLeverageRatio(futuresOI, marketCap);
    const fundingRate = this.generator.generateFundingRate(this.dailyDates, leverageRatio);
    const liquidations = this.generator.generateLiquidations(this.dailyDates, volatility, leverageRatio);
    
    // Generate risk metrics
    const riskRegime = this.generator.generateRiskRegime(this.dailyDates, volatility, leverageRatio);
    const liquidityStress = this.generator.generateLiquidityStress(volatility, leverageRatio, onChainVolume);
    
    // Cache all data
    this.cachedData.set('btc_price', btcPrices);
    this.cachedData.set('eth_price', ethPrices);
    this.cachedData.set('total_crypto_market_cap', marketCap);
    this.cachedData.set('volatility_proxy', volatility);
    this.cachedData.set('market_drawdown_percent', drawdown);
    this.cachedData.set('stablecoin_total_supply', stablecoinSupply);
    this.cachedData.set('stablecoin_net_issuance_30d', stablecoinIssuance);
    this.cachedData.set('stablecoin_velocity_proxy', stablecoinVelocity);
    this.cachedData.set('on_chain_transfer_volume', onChainVolume);
    this.cachedData.set('active_addresses_proxy', activeAddresses);
    this.cachedData.set('network_fee_proxy', networkFees);
    this.cachedData.set('btc_etf_net_flows', etfFlows);
    this.cachedData.set('btc_etf_cumulative_flows', etfCumulativeFlows);
    this.cachedData.set('etf_flow_momentum_score', etfMomentum);
    this.cachedData.set('futures_open_interest', futuresOI);
    this.cachedData.set('leverage_ratio_proxy', leverageRatio);
    this.cachedData.set('funding_rate_proxy', fundingRate);
    this.cachedData.set('liquidation_volume_proxy', liquidations);
    this.cachedData.set('risk_regime', riskRegime);
    this.cachedData.set('crypto_liquidity_stress_index', liquidityStress);
    
    // Generate events
    this.events = generateSyntheticEvents(
      this.dailyDates,
      btcPrices,
      volatility,
      leverageRatio,
      etfFlows,
      stablecoinSupply
    );
  }
  
  async getSeries(metricId: string, params?: GetSeriesParams): Promise<TimeSeries> {
    const metadata = await this.getMetadata(metricId);
    const values = this.cachedData.get(metricId);
    
    if (!values) {
      throw new Error(`Metric not found: ${metricId}`);
    }
    
    // Filter by date range if specified
    let startIdx = 0;
    let endIdx = this.dailyDates.length - 1;
    
    if (params?.startDate) {
      const startDate = new Date(params.startDate);
      startIdx = this.dailyDates.findIndex(d => d >= startDate);
      if (startIdx === -1) startIdx = 0;
    }
    
    if (params?.endDate) {
      const endDate = new Date(params.endDate);
      endIdx = this.dailyDates.findIndex(d => d > endDate);
      if (endIdx === -1) endIdx = this.dailyDates.length - 1;
    }
    
    const observations = this.dailyDates
      .slice(startIdx, endIdx + 1)
      .map((date, i) => ({
        date: date.toISOString(),
        value: values[startIdx + i],
      }));
    
    return {
      metric_id: metricId,
      label: metadata.label || metricId,
      unit: metadata.unit || '',
      frequency: 'daily',
      observations,
      source_type: 'synthetic',
      notes: metadata.notes,
    };
  }
  
  async getLatest(metricId: string, params?: GetLatestParams): Promise<number> {
    const values = this.cachedData.get(metricId);
    
    if (!values) {
      throw new Error(`Metric not found: ${metricId}`);
    }
    
    return values[values.length - 1];
  }
  
  async getMetadata(metricId: string): Promise<Partial<TimeSeries>> {
    const metadataMap: Record<string, Partial<TimeSeries>> = {
      btc_price: {
        label: 'BTC Price',
        unit: 'USD',
        notes: 'Bitcoin spot price with regime-based dynamics',
      },
      eth_price: {
        label: 'ETH Price',
        unit: 'USD',
        notes: 'Ethereum spot price correlated to BTC',
      },
      total_crypto_market_cap: {
        label: 'Total Crypto Market Cap',
        unit: 'Trillions USD',
        notes: 'Aggregate market capitalization of digital assets',
      },
      volatility_proxy: {
        label: 'Volatility Proxy',
        unit: '% Annualized',
        notes: '30-day realized volatility',
      },
      market_drawdown_percent: {
        label: 'Market Drawdown',
        unit: '%',
        notes: 'Drawdown from peak price',
      },
      stablecoin_total_supply: {
        label: 'Stablecoin Total Supply',
        unit: 'Billions USD',
        notes: 'Aggregate stablecoin supply as dollar rail proxy',
      },
      stablecoin_net_issuance_30d: {
        label: 'Stablecoin Net Issuance (30d)',
        unit: 'Billions USD',
        notes: '30-day change in stablecoin supply',
      },
      stablecoin_velocity_proxy: {
        label: 'Stablecoin Velocity Proxy',
        unit: 'Index',
        notes: 'Normalized velocity of stablecoin circulation',
      },
      on_chain_transfer_volume: {
        label: 'On-Chain Transfer Volume',
        unit: 'Billions USD',
        notes: 'Daily on-chain transaction volume',
      },
      active_addresses_proxy: {
        label: 'Active Addresses Proxy',
        unit: 'Index',
        notes: 'Normalized active address count',
      },
      network_fee_proxy: {
        label: 'Network Fee Proxy',
        unit: 'Millions USD',
        notes: 'Daily network fees as congestion indicator',
      },
      btc_etf_net_flows: {
        label: 'BTC ETF Net Flows',
        unit: 'Millions USD',
        notes: 'Daily net institutional ETF flows',
      },
      btc_etf_cumulative_flows: {
        label: 'BTC ETF Cumulative Flows',
        unit: 'Billions USD',
        notes: 'Cumulative institutional ETF positioning',
      },
      etf_flow_momentum_score: {
        label: 'ETF Flow Momentum Score',
        unit: 'Score 0-100',
        notes: '20-day flow momentum indicator',
      },
      futures_open_interest: {
        label: 'Futures Open Interest',
        unit: 'Billions USD',
        notes: 'Aggregate derivatives open interest',
      },
      leverage_ratio_proxy: {
        label: 'Leverage Ratio Proxy',
        unit: '%',
        notes: 'Open interest as % of market cap',
      },
      funding_rate_proxy: {
        label: 'Funding Rate Proxy',
        unit: '% APR',
        notes: 'Perpetual futures funding rate',
      },
      liquidation_volume_proxy: {
        label: 'Liquidation Volume Proxy',
        unit: 'Billions USD',
        notes: 'Estimated daily liquidation volume',
      },
      risk_regime: {
        label: 'Risk Regime',
        unit: 'Categorical',
        notes: 'Market risk classification: risk_on, neutral, risk_off',
      },
      crypto_liquidity_stress_index: {
        label: 'Crypto Liquidity Stress Index',
        unit: 'Score 0-100',
        notes: 'Composite stress indicator from volatility, leverage, and volume',
      },
    };
    
    return metadataMap[metricId] || { label: metricId, unit: '', notes: '' };
  }
  
  async getEvents(params?: GetEventsParams): Promise<Event[]> {
    let filtered = [...this.events];
    
    if (params?.startDate) {
      const startDate = new Date(params.startDate);
      filtered = filtered.filter(e => new Date(e.date) >= startDate);
    }
    
    if (params?.endDate) {
      const endDate = new Date(params.endDate);
      filtered = filtered.filter(e => new Date(e.date) <= endDate);
    }
    
    if (params?.category) {
      filtered = filtered.filter(e => e.category === params.category);
    }
    
    return filtered;
  }
}
