/**
 * Synthetic Data Generator for Digital Assets
 * Generates realistic market structure behavior including:
 * - Bull and bear market regimes
 * - Volatility clustering
 * - Drawdowns and mean reversion
 * - Stablecoin supply dynamics
 * - On-chain volume cycles
 * - Derivatives leverage patterns
 * - ETF flow persistence
 */

export interface MarketRegime {
  start: Date;
  end: Date;
  type: 'bull' | 'bear' | 'sideways';
  volatility: number;
}

export class SyntheticGenerator {
  private startDate: Date;
  private endDate: Date;
  private regimes: MarketRegime[];
  
  constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.regimes = this.generateRegimes();
  }
  
  /**
   * Generate market regimes with realistic duration and transitions
   */
  private generateRegimes(): MarketRegime[] {
    const regimes: MarketRegime[] = [];
    let currentDate = new Date(this.startDate);
    const endTime = this.endDate.getTime();
    
    while (currentDate.getTime() < endTime) {
      const regimeType = this.selectRegimeType(regimes);
      const duration = this.getRegimeDuration(regimeType);
      const volatility = this.getRegimeVolatility(regimeType);
      
      const regimeEnd = new Date(currentDate.getTime() + duration);
      
      regimes.push({
        start: new Date(currentDate),
        end: regimeEnd.getTime() > endTime ? new Date(endTime) : regimeEnd,
        type: regimeType,
        volatility,
      });
      
      currentDate = regimeEnd;
    }
    
    return regimes;
  }
  
  private selectRegimeType(existingRegimes: MarketRegime[]): 'bull' | 'bear' | 'sideways' {
    if (existingRegimes.length === 0) {
      return Math.random() > 0.5 ? 'bull' : 'bear';
    }
    
    const lastRegime = existingRegimes[existingRegimes.length - 1];
    const rand = Math.random();
    
    // Regime transition probabilities
    if (lastRegime.type === 'bull') {
      if (rand < 0.1) return 'bear';
      if (rand < 0.3) return 'sideways';
      return 'bull';
    } else if (lastRegime.type === 'bear') {
      if (rand < 0.15) return 'bull';
      if (rand < 0.35) return 'sideways';
      return 'bear';
    } else { // sideways
      if (rand < 0.4) return 'bull';
      if (rand < 0.7) return 'bear';
      return 'sideways';
    }
  }
  
  private getRegimeDuration(type: 'bull' | 'bear' | 'sideways'): number {
    // Duration in milliseconds
    const daysToMs = (days: number) => days * 24 * 60 * 60 * 1000;
    
    if (type === 'bull') {
      // Bulls last 30-180 days
      return daysToMs(30 + Math.random() * 150);
    } else if (type === 'bear') {
      // Bears are shorter, 20-90 days
      return daysToMs(20 + Math.random() * 70);
    } else {
      // Sideways 15-60 days
      return daysToMs(15 + Math.random() * 45);
    }
  }
  
  private getRegimeVolatility(type: 'bull' | 'bear' | 'sideways'): number {
    if (type === 'bull') {
      return 40 + Math.random() * 30; // 40-70% annualized
    } else if (type === 'bear') {
      return 60 + Math.random() * 40; // 60-100% annualized
    } else {
      return 25 + Math.random() * 25; // 25-50% annualized
    }
  }
  
  private getRegimeAtDate(date: Date): MarketRegime {
    const regime = this.regimes.find(r => 
      date >= r.start && date <= r.end
    );
    return regime || this.regimes[0];
  }
  
  /**
   * Generate BTC price with realistic dynamics
   */
  generateBTCPrice(dailyDates: Date[]): number[] {
    const prices: number[] = [];
    let price = 30000 + Math.random() * 20000; // Start between 30k-50k
    
    dailyDates.forEach((date) => {
      const regime = this.getRegimeAtDate(date);
      const dailyVol = regime.volatility / Math.sqrt(252); // Annualized to daily
      
      // Drift based on regime
      let drift = 0;
      if (regime.type === 'bull') {
        drift = 0.0015; // ~50% annual
      } else if (regime.type === 'bear') {
        drift = -0.002; // ~-50% annual
      } else {
        drift = 0.0002; // ~7% annual
      }
      
      // Add volatility clustering
      const shock = this.gaussianRandom() * (dailyVol / 100);
      const change = drift + shock;
      
      price = price * (1 + change);
      
      // Keep price realistic
      price = Math.max(10000, Math.min(150000, price));
      
      prices.push(price);
    });
    
    return prices;
  }
  
  /**
   * Generate ETH price correlated to BTC
   */
  generateETHPrice(btcPrices: number[]): number[] {
    const ethPrices: number[] = [];
    const correlation = 0.85; // High correlation with BTC
    let ethPrice = 1500 + Math.random() * 1000;
    
    btcPrices.forEach((btcPrice, idx) => {
      const btcReturn = idx > 0 ? (btcPrice / btcPrices[idx - 1]) - 1 : 0;
      
      // Correlated return
      const correlatedReturn = correlation * btcReturn;
      const idiosyncraticReturn = this.gaussianRandom() * 0.015 * (1 - correlation);
      
      ethPrice = ethPrice * (1 + correlatedReturn + idiosyncraticReturn);
      ethPrice = Math.max(500, Math.min(10000, ethPrice));
      
      ethPrices.push(ethPrice);
    });
    
    return ethPrices;
  }
  
  /**
   * Generate market cap
   */
  generateMarketCap(btcPrices: number[], ethPrices: number[]): number[] {
    const btcSupply = 19.5e6; // ~19.5M BTC
    const ethSupply = 120e6; // ~120M ETH
    
    return btcPrices.map((btcPrice, i) => {
      const btcCap = btcPrice * btcSupply;
      const ethCap = ethPrices[i] * ethSupply;
      const othersCap = (btcCap + ethCap) * 0.3; // Others are 30% of BTC+ETH
      
      return (btcCap + ethCap + othersCap) / 1e12; // In trillions
    });
  }
  
  /**
   * Generate volatility (realized)
   */
  generateVolatility(prices: number[], dailyDates: Date[]): number[] {
    const window = 30; // 30-day realized vol
    const volatilities: number[] = [];
    
    dailyDates.forEach((date, i) => {
      const regime = this.getRegimeAtDate(date);
      
      if (i < window) {
        volatilities.push(regime.volatility);
      } else {
        // Calculate realized volatility
        const returns = [];
        for (let j = i - window; j < i; j++) {
          returns.push(Math.log(prices[j] / prices[j - 1]));
        }
        const mean = returns.reduce((a, b) => a + b) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
        const realizedVol = Math.sqrt(variance * 252) * 100;
        
        // Smooth with regime vol
        volatilities.push(0.7 * realizedVol + 0.3 * regime.volatility);
      }
    });
    
    return volatilities;
  }
  
  /**
   * Generate drawdown from peak
   */
  generateDrawdown(prices: number[]): number[] {
    const drawdowns: number[] = [];
    let peak = prices[0];
    
    prices.forEach(price => {
      peak = Math.max(peak, price);
      const drawdown = ((price - peak) / peak) * 100;
      drawdowns.push(drawdown);
    });
    
    return drawdowns;
  }
  
  /**
   * Generate stablecoin supply
   */
  generateStablecoinSupply(dailyDates: Date[], _marketCap: number[]): number[] {
    const supply: number[] = [];
    let currentSupply = 100 + Math.random() * 20; // Start 100-120B
    
    dailyDates.forEach((date) => {
      const regime = this.getRegimeAtDate(date);
      
      // Stablecoins grow in bull markets, contract in bears
      let dailyGrowth = 0;
      if (regime.type === 'bull') {
        dailyGrowth = 0.001 + Math.random() * 0.001; // 0.1-0.2% daily
      } else if (regime.type === 'bear') {
        dailyGrowth = -0.0005 + Math.random() * 0.0005; // -0.05% to 0%
      } else {
        dailyGrowth = Math.random() * 0.0005; // 0-0.05%
      }
      
      currentSupply = currentSupply * (1 + dailyGrowth);
      currentSupply = Math.max(80, Math.min(180, currentSupply));
      
      supply.push(currentSupply);
    });
    
    return supply;
  }
  
  /**
   * Generate stablecoin net issuance (30-day change)
   */
  generateStablecoinIssuance(supply: number[]): number[] {
    const window = 30;
    return supply.map((s, i) => {
      if (i < window) return 0;
      return s - supply[i - window];
    });
  }
  
  /**
   * Generate on-chain transfer volume
   */
  generateOnChainVolume(dailyDates: Date[], volatility: number[], marketCap: number[]): number[] {
    const volumes: number[] = [];
    
    dailyDates.forEach((_date, i) => {
      // Volume correlates with volatility and market cap
      const baseVolume = 20 + Math.random() * 10; // Base 20-30B
      const volMultiplier = 1 + (volatility[i] / 100); // Higher vol = more volume
      const capMultiplier = marketCap[i] / 1.5; // Scales with market cap
      
      const volume = baseVolume * volMultiplier * capMultiplier * (0.8 + Math.random() * 0.4);
      volumes.push(volume);
    });
    
    return volumes;
  }
  
  /**
   * Generate active addresses proxy
   */
  generateActiveAddresses(volume: number[]): number[] {
    return volume.map(v => {
      // Index normalized around 100
      return 70 + (v / 100) * 30 + Math.random() * 10;
    });
  }
  
  /**
   * Generate network fees
   */
  generateNetworkFees(volume: number[], dailyDates: Date[]): number[] {
    return volume.map((v, i) => {
      const regime = this.getRegimeAtDate(dailyDates[i]);
      const congestionFactor = regime.type === 'bull' ? 1.5 : 0.7;
      
      // Fees scale with volume
      const baseFee = 5 + (v / 50) * 15;
      return baseFee * congestionFactor * (0.7 + Math.random() * 0.6);
    });
  }
  
  /**
   * Generate BTC ETF flows
   */
  generateETFFlows(dailyDates: Date[], _btcPrices: number[]): number[] {
    const flows: number[] = [];
    let momentum = 0;
    
    dailyDates.forEach((date) => {
      const regime = this.getRegimeAtDate(date);
      
      // Flows have persistence and lag price
      const flowShock = this.gaussianRandom() * 150;
      
      if (regime.type === 'bull') {
        momentum = 0.8 * momentum + 0.2 * 200; // Persistent inflows
      } else if (regime.type === 'bear') {
        momentum = 0.8 * momentum + 0.2 * (-100); // Outflows
      } else {
        momentum = 0.9 * momentum; // Decay
      }
      
      const flow = momentum + flowShock;
      flows.push(flow);
    });
    
    return flows;
  }
  
  /**
   * Generate cumulative ETF flows
   */
  generateCumulativeETFFlows(flows: number[]): number[] {
    const cumulative: number[] = [];
    let sum = 0;
    
    flows.forEach(flow => {
      sum += flow / 1000; // Convert millions to billions
      cumulative.push(sum);
    });
    
    return cumulative;
  }
  
  /**
   * Generate futures open interest
   */
  generateFuturesOI(dailyDates: Date[], marketCap: number[]): number[] {
    const oi: number[] = [];
    
    dailyDates.forEach((date, i) => {
      const regime = this.getRegimeAtDate(date);
      
      // OI as % of market cap
      let oiRatio = 0.15; // 15% base
      
      if (regime.type === 'bull') {
        oiRatio = 0.18 + Math.random() * 0.05; // 18-23%
      } else if (regime.type === 'bear') {
        oiRatio = 0.10 + Math.random() * 0.05; // 10-15%
      }
      
      const oiValue = marketCap[i] * 1000 * oiRatio; // In billions
      oi.push(oiValue);
    });
    
    return oi;
  }
  
  /**
   * Generate leverage ratio
   */
  generateLeverageRatio(oi: number[], marketCap: number[]): number[] {
    return oi.map((o, i) => {
      return (o / (marketCap[i] * 1000)) * 100; // As percentage
    });
  }
  
  /**
   * Generate funding rate
   */
  generateFundingRate(dailyDates: Date[], leverage: number[]): number[] {
    return dailyDates.map((date, i) => {
      const regime = this.getRegimeAtDate(date);
      
      let baseFunding = 0.01; // 1% APR
      
      if (regime.type === 'bull' && leverage[i] > 18) {
        baseFunding = 0.05 + Math.random() * 0.05; // 5-10% when levered up
      } else if (regime.type === 'bear') {
        baseFunding = -0.02 + Math.random() * 0.02; // -2% to 0%
      }
      
      return baseFunding;
    });
  }
  
  /**
   * Generate liquidation volume
   */
  generateLiquidations(dailyDates: Date[], volatility: number[], leverage: number[]): number[] {
    return dailyDates.map((date, i) => {
      const regime = this.getRegimeAtDate(date);
      
      // Liquidations spike with high vol and leverage
      const baseLiq = 0.5;
      const volFactor = volatility[i] / 50;
      const levFactor = leverage[i] / 15;
      
      const spike = regime.type === 'bear' && Math.random() < 0.05 ? 5 : 1;
      
      return baseLiq * volFactor * levFactor * spike * (0.5 + Math.random());
    });
  }
  
  /**
   * Generate risk regime classification
   */
  generateRiskRegime(dailyDates: Date[], volatility: number[], leverage: number[]): string[] {
    return dailyDates.map((_date, idx) => {
      if (volatility[idx] > 70 || leverage[idx] < 12) {
        return 'risk_off';
      } else if (volatility[idx] < 40 && leverage[idx] > 17) {
        return 'risk_on';
      } else {
        return 'neutral';
      }
    });
  }
  
  /**
   * Generate liquidity stress index
   */
  generateLiquidityStress(volatility: number[], leverage: number[], volume: number[]): number[] {
    return volatility.map((vol, i) => {
      // Composite of volatility, low leverage, and low volume
      const volScore = Math.min(100, (vol / 100) * 100);
      const levScore = Math.max(0, 100 - leverage[i] * 4);
      const volScore2 = Math.max(0, 100 - (volume[i] / 100) * 50);
      
      const stress = (volScore * 0.4 + levScore * 0.3 + volScore2 * 0.3);
      return Math.max(0, Math.min(100, stress));
    });
  }
  
  /**
   * Generate stablecoin velocity proxy
   */
  generateStablecoinVelocity(volume: number[], supply: number[]): number[] {
    return volume.map((v, i) => {
      // Velocity = volume / supply, normalized to index
      const velocity = (v / supply[i]) * 100;
      return 80 + velocity * 0.2 + Math.random() * 10;
    });
  }
  
  /**
   * Generate ETF flow momentum score
   */
  generateETFMomentum(flows: number[]): number[] {
    const window = 20;
    return flows.map((_flow, i) => {
      if (i < window) return 50;
      
      const recentFlows = flows.slice(i - window, i);
      const avgFlow = recentFlows.reduce((a, b) => a + b) / window;
      
      // Normalize to 0-100
      const score = 50 + (avgFlow / 200) * 50;
      return Math.max(0, Math.min(100, score));
    });
  }
  
  /**
   * Gaussian random number generator (Box-Muller transform)
   */
  private gaussianRandom(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
  
  /**
   * Generate daily dates array
   */
  generateDailyDates(): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(this.startDate);
    
    while (currentDate <= this.endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }
}
