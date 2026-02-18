import { Event, EventCategory } from '../../models/schemas';

export interface EventDefinition {
  event_id: string;
  label: string;
  category: EventCategory;
  severity: number;
  description: string;
}

/**
 * Predefined synthetic events
 */
export const EVENT_DEFINITIONS: EventDefinition[] = [
  {
    event_id: 'etf_inflow_surge',
    label: 'ETF Inflow Surge',
    category: 'market',
    severity: 3,
    description: 'Institutional ETF inflows accelerate, driving sustained buying pressure across spot and derivatives markets.',
  },
  {
    event_id: 'leverage_build_up',
    label: 'Leverage Build-Up',
    category: 'microstructure',
    severity: 4,
    description: 'Derivatives open interest and funding rates climb, indicating excessive leverage accumulation in the system.',
  },
  {
    event_id: 'forced_deleveraging',
    label: 'Forced Deleveraging',
    category: 'liquidity',
    severity: 5,
    description: 'Cascading liquidations trigger violent deleveraging, widening spreads and fragmenting liquidity across venues.',
  },
  {
    event_id: 'stablecoin_supply_jump',
    label: 'Stablecoin Supply Jump',
    category: 'liquidity',
    severity: 2,
    description: 'Rapid stablecoin issuance signals capital inflows and expanding dollar-denominated liquidity rails.',
  },
  {
    event_id: 'liquidity_drought',
    label: 'Liquidity Drought',
    category: 'liquidity',
    severity: 4,
    description: 'On-chain volume and active addresses decline sharply, network fees collapse, indicating participant exodus.',
  },
  {
    event_id: 'regulatory_shock',
    label: 'Regulatory Shock',
    category: 'regulation',
    severity: 5,
    description: 'Unexpected regulatory action creates uncertainty, triggering risk-off positioning and capital flight.',
  },
  {
    event_id: 'macro_risk_off',
    label: 'Macro Risk-Off',
    category: 'policy',
    severity: 4,
    description: 'Broader macro risk-off regime compresses crypto correlations to traditional risk assets.',
  },
  {
    event_id: 'policy_pivot_rally',
    label: 'Policy Pivot Rally',
    category: 'policy',
    severity: 3,
    description: 'Central bank policy pivot drives liquidity expansion, benefiting digital assets as duration proxies.',
  },
  {
    event_id: 'exchange_liquidity_crisis',
    label: 'Exchange Liquidity Crisis',
    category: 'microstructure',
    severity: 5,
    description: 'Major exchange faces solvency concerns, fragmenting liquidity and spiking basis between venues.',
  },
  {
    event_id: 'institutional_capitulation',
    label: 'Institutional Capitulation',
    category: 'market',
    severity: 4,
    description: 'Large-scale institutional redemptions accelerate drawdown, marking potential regime shift.',
  },
];

/**
 * Generate events based on market conditions
 */
export function generateSyntheticEvents(
  dailyDates: Date[],
  btcPrices: number[],
  volatility: number[],
  leverage: number[],
  etfFlows: number[],
  stablecoinSupply: number[]
): Event[] {
  const events: Event[] = [];
  
  // Track event spacing to avoid clustering
  let lastEventIndex = -20;
  
  dailyDates.forEach((date, i) => {
    if (i < 30 || i - lastEventIndex < 15) return; // Minimum 15 days between events
    
    const priceChange = (btcPrices[i] / btcPrices[i - 30] - 1) * 100;
    const volChange = volatility[i] - volatility[i - 1];
    const leverageLevel = leverage[i];
    const recentETFFlows = etfFlows.slice(Math.max(0, i - 10), i).reduce((a, b) => a + b, 0);
    const stableSupplyChange = i > 30 ? stablecoinSupply[i] - stablecoinSupply[i - 30] : 0;
    
    // ETF inflow surge
    if (recentETFFlows > 1500 && events.filter(e => e.event_id === 'etf_inflow_surge').length === 0) {
      events.push(createEvent('etf_inflow_surge', date));
      lastEventIndex = i;
    }
    
    // Leverage build-up
    else if (leverageLevel > 20 && volChange < 5 && events.filter(e => e.event_id === 'leverage_build_up').length < 2) {
      events.push(createEvent('leverage_build_up', date));
      lastEventIndex = i;
    }
    
    // Forced deleveraging
    else if (priceChange < -15 && leverageLevel < 13 && i > lastEventIndex + 20) {
      events.push(createEvent('forced_deleveraging', date));
      lastEventIndex = i;
    }
    
    // Stablecoin supply jump
    else if (stableSupplyChange > 8 && events.filter(e => e.event_id === 'stablecoin_supply_jump').length < 2) {
      events.push(createEvent('stablecoin_supply_jump', date));
      lastEventIndex = i;
    }
    
    // Liquidity drought
    else if (priceChange < -10 && stableSupplyChange < -5 && events.filter(e => e.event_id === 'liquidity_drought').length < 2) {
      events.push(createEvent('liquidity_drought', date));
      lastEventIndex = i;
    }
    
    // Regulatory shock (random, low frequency)
    else if (Math.random() < 0.002 && i > lastEventIndex + 30 && events.filter(e => e.event_id === 'regulatory_shock').length === 0) {
      events.push(createEvent('regulatory_shock', date));
      lastEventIndex = i;
    }
    
    // Macro risk-off
    else if (priceChange < -20 && volatility[i] > 80 && events.filter(e => e.event_id === 'macro_risk_off').length < 2) {
      events.push(createEvent('macro_risk_off', date));
      lastEventIndex = i;
    }
    
    // Policy pivot rally
    else if (priceChange > 20 && i > 180 && events.filter(e => e.event_id === 'policy_pivot_rally').length < 2) {
      events.push(createEvent('policy_pivot_rally', date));
      lastEventIndex = i;
    }
  });
  
  // Ensure we have at least 8 events by adding some at key points
  if (events.length < 8) {
    const missingEvents = EVENT_DEFINITIONS.filter(
      def => !events.find(e => e.event_id === def.event_id)
    );
    
    missingEvents.slice(0, 8 - events.length).forEach((def, idx) => {
      const eventDate = dailyDates[Math.floor(dailyDates.length / (8 - events.length) * (idx + 1))];
      events.push(createEvent(def.event_id, eventDate));
    });
  }
  
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function createEvent(eventId: string, date: Date): Event {
  const definition = EVENT_DEFINITIONS.find(d => d.event_id === eventId);
  
  if (!definition) {
    throw new Error(`Event definition not found: ${eventId}`);
  }
  
  return {
    event_id: definition.event_id,
    label: definition.label,
    date: date.toISOString(),
    category: definition.category,
    severity: definition.severity,
    description: definition.description,
  };
}
