# Digital Assets Intelligence

**Example Dashboard - For Portfolio Demonstration Only**

This is a demonstration dashboard showcasing software engineering and DevOps capabilities through dashboard architecture, data modeling, and visualization systems. 

**⚠️ Important: This uses synthetic data only. No real APIs are connected, and no production data sources are included.**

## Overview

This example dashboard demonstrates analytics capabilities by modeling digital asset market concepts:
- Market structure dynamics (regimes, volatility, drawdowns)
- Stablecoin infrastructure as dollar liquidity proxy
- On-chain transaction and network activity
- Institutional ETF positioning and flows
- Derivatives leverage and funding dynamics
- Liquidity stress and risk regime classification

All data is synthetically generated to showcase the dashboard functionality without requiring actual data sources.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    React + TypeScript                     │
│                        Frontend                           │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│              DataProvider Interface                       │
│   getSeries() | getLatest() | getMetadata() | getEvents()│
└───────┬──────────────────────────────────────────────────┘
        │
┌───────▼──────────────┐    
│ SyntheticDataProvider│    (Example Implementation)
│  Realistic generator │    
└──────────────────────┘    
```

The DataProvider pattern separates UI from data sources. This example uses synthetic data generation, but the architecture supports connecting any data source through the same interface.

## Folder Structure

```
jf-digital-assets-intelligence/
├── src/
│   ├── app/              # Zustand state management
│   ├── components/
│   │   ├── charts/       # Reusable chart components
│   │   └── layout/       # Layout components (Header, Sidebar, etc.)
│   ├── data/
│   │   ├── synthetic/    # Synthetic data generator (example implementation)
│   │   ├── DataProvider.ts  # Data provider interface
│   │   └── index.ts      # Provider factory
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and helpers
│   ├── models/           # Zod schemas
│   └── pages/            # Dashboard pages
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md
│   ├── METRICS.md
│   └── SECURITY.md
└── public/               # Static assets
```

## Example Data Implementation

This dashboard uses **synthetic data generation** to demonstrate functionality:
- Bull/bear market regimes
- Volatility clustering  
- Stablecoin supply dynamics
- ETF flow persistence
- Derivatives leverage cycles
- 8+ labeled market events

This approach showcases the dashboard's capabilities without requiring external API connections or data subscriptions.

## How to Run

### Prerequisites
- Node.js 18+ and npm

### Installation and Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will start at `http://localhost:5173/`

## Features

### Interactive Dashboard
- **Navigation**: Overview, Market Structure, Stablecoin Rail, On-Chain Liquidity, ETF Positioning, Derivatives Leverage, Risk Regime
- **Filters**: Date range, asset selector (BTC/ETH/TOTAL/STABLES), event overlay toggle
- **KPI Strip**: Real-time key metrics (BTC price, market cap, stablecoin supply, ETF flows, leverage ratio, liquidity stress)

### Charts (10+)
1. BTC price with volatility overlay
2. Total crypto market cap with regime shading
3. Stablecoin supply and net issuance
4. On-chain transfer volume and active addresses
5. Network fee proxy (congestion indicator)
6. ETF net flows and cumulative positioning
7. Futures open interest and leverage ratio
8. Funding rates and liquidation volume
9. Crypto liquidity stress index
10. Risk regime timeline

Each chart includes:
- Hover tooltips
- Event markers (clickable)
- Export as PNG
- Download data as JSON
- Definition tooltips
- Source attribution

### Event System
Synthetic events generated from market conditions:
- ETF inflow surge
- Leverage build-up
- Forced deleveraging
- Stablecoin supply jump
- Liquidity drought
- Regulatory shock
- Macro risk-off
- Policy pivot rally

Click event markers on charts to view detailed event information.

### Methodology
Right-side drawer explaining:
- DataProvider architecture
- Synthetic data generation logic
- Schema validation approach
- How to connect real data sources
- Security best practices

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State**: Zustand
- **Validation**: Zod
- **Routing**: React Router (future)

## Security

✅ No API keys or credentials required
✅ No external data connections  
✅ No production endpoints
✅ No proprietary datasets

This is a standalone example dashboard using only synthetic data.

See [docs/SECURITY.md](docs/SECURITY.md) for guidance on implementing secure data integrations.

## Metrics

See [docs/METRICS.md](docs/METRICS.md) for complete metric definitions, units, and expected ranges.

## Extending with Real Data Sources

This example dashboard can be extended to connect real data sources. The DataProvider interface architecture demonstrates how to:

1. **Implement the DataProvider interface** in a new class
2. **Map external data formats** to the TimeSeries and Event schemas
3. **Handle data fetching** with proper error handling and caching
4. **Manage API credentials** securely through environment variables

For detailed guidance on implementing data integrations with DevOps best practices, see [docs/INSTRUCTIONS.md](docs/INSTRUCTIONS.md).

**Note:** This repository intentionally does not include specific API implementations or recommendations to keep it as a generic engineering showcase.

## Customization

### Typography and Spacing
Adjust in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Your Font', 'sans-serif'],
    },
    spacing: { /* custom spacing */ }
  }
}
```

### Adding Metrics
1. Update synthetic generator in `src/data/synthetic/generator.ts`
2. Add metadata in `SyntheticDataProvider.ts`
3. Create chart component
4. Add to relevant page

## License

MIT License - see [LICENSE](LICENSE)

## Author

Jasmine Fosque

---

**Portfolio Disclaimer**: This is an example dashboard demonstrating software engineering and DevOps capabilities. It uses synthetic data only and does not connect to any real data sources or APIs. Production systems would require proper data pipelines, API integrations, and secure infrastructure.
