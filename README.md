# Digital Assets Intelligence

Monetary infrastructure analytics tracking digital asset market structure, stablecoin growth, on-chain liquidity, ETF positioning, and derivative leverage conditions.

**This repository demonstrates dashboard architecture, modeling logic, and visualization systems. Production data pipelines and proprietary datasets are not included.**

## Overview

This dashboard frames cryptocurrency markets as monetary plumbing and liquidity rails, analyzing:
- Market structure dynamics (regimes, volatility, drawdowns)
- Stablecoin infrastructure as dollar liquidity proxy
- On-chain transaction and network activity
- Institutional ETF positioning and flows
- Derivatives leverage and funding dynamics
- Liquidity stress and risk regime classification

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
└───────┬──────────────────────────────┬───────────────────┘
        │                              │
┌───────▼──────────────┐    ┌──────────▼───────────────────┐
│ SyntheticDataProvider│    │  OpenDataProvider (stub)     │
│  Realistic generator │    │  Free/keyless APIs only      │
└──────────────────────┘    └──────────────────────────────┘
```

The DataProvider pattern separates UI from data sources, protecting production pipelines while enabling portfolio demonstration.

## Folder Structure

```
jf-digital-assets-intelligence/
├── src/
│   ├── app/              # Zustand state management
│   ├── components/
│   │   ├── charts/       # Reusable chart components
│   │   └── layout/       # Layout components (Header, Sidebar, etc.)
│   ├── data/
│   │   ├── synthetic/    # Synthetic data generator
│   │   └── adapters/     # Data provider adapters
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

## Data Modes

### Synthetic Mode (Default)
Generates realistic digital asset market behavior with:
- Bull/bear market regimes
- Volatility clustering  
- Stablecoin supply dynamics
- ETF flow persistence
- Derivatives leverage cycles
- 8+ labeled market events

### Open Mode (Optional)
Stub for connecting free, keyless open data endpoints. No API keys required.

Set via environment variable:
```bash
VITE_DATA_MODE=synthetic  # Default
VITE_DATA_MODE=open       # Stub mode
```

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

✅ No API keys committed
✅ No production endpoints  
✅ No real database credentials
✅ No proprietary datasets

See [docs/SECURITY.md](docs/SECURITY.md) for detailed security guidance.

## Metrics

See [docs/METRICS.md](docs/METRICS.md) for complete metric definitions, units, and expected ranges.

## Contributing to Real Data Adapters

To add a real data adapter:

1. Create a new provider class implementing `DataProvider` interface
2. Map external data to `TimeSeries` and `Event` schemas
3. Update `src/data/index.ts` factory
4. Use **only keyless, free endpoints**
5. No API keys in code—use environment variables

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

**Portfolio Disclaimer**: This project demonstrates software engineering capabilities. Production systems use proprietary data pipelines, paid vendor integrations, and secure infrastructure not included in this repository.
