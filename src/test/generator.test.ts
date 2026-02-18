import { describe, it, expect, beforeEach } from 'vitest';
import { SyntheticGenerator } from '../data/synthetic/generator';

describe('SyntheticGenerator', () => {
  let generator: SyntheticGenerator;
  let startDate: Date;
  let endDate: Date;
  let dailyDates: Date[];
  
  beforeEach(() => {
    startDate = new Date('2023-01-01');
    endDate = new Date('2023-12-31');
    generator = new SyntheticGenerator(startDate, endDate);
    dailyDates = generator.generateDailyDates();
  });
  
  describe('generateDailyDates', () => {
    it('should generate correct number of dates', () => {
      expect(dailyDates.length).toBe(365);
    });
    
    it('should start with the start date', () => {
      expect(dailyDates[0].toDateString()).toBe(startDate.toDateString());
    });
    
    it('should end with the end date', () => {
      expect(dailyDates[dailyDates.length - 1].toDateString()).toBe(endDate.toDateString());
    });
  });
  
  describe('generateBTCPrice', () => {
    it('should generate price array of correct length', () => {
      const prices = generator.generateBTCPrice(dailyDates);
      expect(prices.length).toBe(dailyDates.length);
    });
    
    it('should generate prices within reasonable range', () => {
      const prices = generator.generateBTCPrice(dailyDates);
      prices.forEach(price => {
        expect(price).toBeGreaterThanOrEqual(10000);
        expect(price).toBeLessThanOrEqual(150000);
      });
    });
    
    it('should generate non-zero prices', () => {
      const prices = generator.generateBTCPrice(dailyDates);
      prices.forEach(price => {
        expect(price).toBeGreaterThan(0);
      });
    });
  });
  
  describe('generateETHPrice', () => {
    it('should generate price array of correct length', () => {
      const btcPrices = generator.generateBTCPrice(dailyDates);
      const ethPrices = generator.generateETHPrice(btcPrices);
      expect(ethPrices.length).toBe(btcPrices.length);
    });
    
    it('should generate prices within reasonable range', () => {
      const btcPrices = generator.generateBTCPrice(dailyDates);
      const ethPrices = generator.generateETHPrice(btcPrices);
      ethPrices.forEach(price => {
        expect(price).toBeGreaterThanOrEqual(500);
        expect(price).toBeLessThanOrEqual(10000);
      });
    });
  });
  
  describe('generateMarketCap', () => {
    it('should generate market cap array of correct length', () => {
      const btcPrices = generator.generateBTCPrice(dailyDates);
      const ethPrices = generator.generateETHPrice(btcPrices);
      const marketCap = generator.generateMarketCap(btcPrices, ethPrices);
      expect(marketCap.length).toBe(btcPrices.length);
    });
    
    it('should generate positive market caps', () => {
      const btcPrices = generator.generateBTCPrice(dailyDates);
      const ethPrices = generator.generateETHPrice(btcPrices);
      const marketCap = generator.generateMarketCap(btcPrices, ethPrices);
      marketCap.forEach(cap => {
        expect(cap).toBeGreaterThan(0);
      });
    });
  });
  
  describe('generateVolatility', () => {
    it('should generate volatility array of correct length', () => {
      const prices = generator.generateBTCPrice(dailyDates);
      const volatility = generator.generateVolatility(prices, dailyDates);
      expect(volatility.length).toBe(prices.length);
    });
    
    it('should generate volatility within expected range', () => {
      const prices = generator.generateBTCPrice(dailyDates);
      const volatility = generator.generateVolatility(prices, dailyDates);
      volatility.forEach(vol => {
        expect(vol).toBeGreaterThanOrEqual(0);
        expect(vol).toBeLessThanOrEqual(150); // Max 150% annualized
      });
    });
  });
  
  describe('generateDrawdown', () => {
    it('should generate drawdown array of correct length', () => {
      const prices = generator.generateBTCPrice(dailyDates);
      const drawdown = generator.generateDrawdown(prices);
      expect(drawdown.length).toBe(prices.length);
    });
    
    it('should generate drawdowns <= 0', () => {
      const prices = generator.generateBTCPrice(dailyDates);
      const drawdown = generator.generateDrawdown(prices);
      drawdown.forEach(dd => {
        expect(dd).toBeLessThanOrEqual(0);
      });
    });
    
    it('should start with 0 drawdown at peak', () => {
      const prices = [100, 90, 80, 95];
      const drawdown = generator.generateDrawdown(prices);
      expect(drawdown[0]).toBe(0); // At peak
    });
  });
  
  describe('generateStablecoinSupply', () => {
    it('should generate supply within expected range', () => {
      const btcPrices = generator.generateBTCPrice(dailyDates);
      const ethPrices = generator.generateETHPrice(btcPrices);
      const marketCap = generator.generateMarketCap(btcPrices, ethPrices);
      const supply = generator.generateStablecoinSupply(dailyDates, marketCap);
      
      supply.forEach(s => {
        expect(s).toBeGreaterThanOrEqual(80);
        expect(s).toBeLessThanOrEqual(180);
      });
    });
  });
  
  describe('generateRiskRegime', () => {
    it('should generate regime array of correct length', () => {
      const btcPrices = generator.generateBTCPrice(dailyDates);
      const volatility = generator.generateVolatility(btcPrices, dailyDates);
      const ethPrices = generator.generateETHPrice(btcPrices);
      const marketCap = generator.generateMarketCap(btcPrices, ethPrices);
      const futuresOI = generator.generateFuturesOI(dailyDates, marketCap);
      const leverage = generator.generateLeverageRatio(futuresOI, marketCap);
      const regime = generator.generateRiskRegime(dailyDates, volatility, leverage);
      
      expect(regime.length).toBe(dailyDates.length);
    });
    
    it('should only generate valid regime values', () => {
      const btcPrices = generator.generateBTCPrice(dailyDates);
      const volatility = generator.generateVolatility(btcPrices, dailyDates);
      const ethPrices = generator.generateETHPrice(btcPrices);
      const marketCap = generator.generateMarketCap(btcPrices, ethPrices);
      const futuresOI = generator.generateFuturesOI(dailyDates, marketCap);
      const leverage = generator.generateLeverageRatio(futuresOI, marketCap);
      const regime = generator.generateRiskRegime(dailyDates, volatility, leverage);
      
      const validRegimes = ['risk_on', 'neutral', 'risk_off'];
      regime.forEach(r => {
        expect(validRegimes).toContain(r);
      });
    });
  });
});
