# Architecture Documentation

This document describes the architectural patterns and design decisions in the Digital Assets Intelligence example dashboard.

## Design Philosophy

This example dashboard demonstrates:
1. **Clean separation of concerns** between UI and data sources
2. **Professional architecture patterns** suitable for production systems
3. **Synthetic data generation** that demonstrates realistic market modeling
4. **Production-ready code quality** with strong typing and validation

**Note**: This is an example implementation using synthetic data only. No real APIs or data sources are connected.

## DataProvider Pattern

### Purpose
The DataProvider interface abstracts all data access, allowing the UI to remain completely decoupled from data sources. This demonstrates how to build extensible, maintainable data architectures.

### Interface Definition

```typescript
interface DataProvider {
  getSeries(metricId: string, params?: GetSeriesParams): Promise<TimeSeries>;
  getLatest(metricId: string, params?: GetLatestParams): Promise<number>;
  getMetadata(metricId: string): Promise<Partial<TimeSeries>>;
  getEvents(params?: GetEventsParams): Promise<Event[]>;
}
```

### Implementations

#### SyntheticDataProvider (Example Implementation)
- Generates 2 years of realistic digital asset market data
- Implements complex regime-based dynamics
- Creates correlated time series
- Produces labeled market events
- **No external dependencies—runs completely offline**

This example implementation demonstrates data modeling and generation capabilities.

### Factory Pattern

```typescript
function createDataProvider(): DataProvider {
  return new SyntheticDataProvider();
}
```

In a production system, this factory would support multiple provider implementations and environment-based configuration.

## Synthetic Data Engine

### Architecture

```
MarketRegime[] → Generator Methods → Cached Time Series
     ↓
Event Generator → Synthetic Events
```

### Regime Generation
1. **Regime Selection**: Probabilistic transitions between bull, bear, sideways
2. **Duration**: Realistic regime durations (30-180 days for bulls, 20-90 for bears)
3. **Volatility**: Regime-specific volatility ranges
4. **Persistence**: Regimes exhibit autocorrelation

### Price Generation
- **BTC Price**: Geometric Brownian motion with regime drift
- **ETH Price**: 85% correlated to BTC with idiosyncratic shocks
- **Market Cap**: Derived from BTC, ETH, and "others"

### Volatility Modeling
- **Realized Volatility**: 30-day rolling std dev of log returns
- **Clustering**: Smooth blending of realized and regime volatility
- **Annualization**: Daily vol × √252

### Correlation Structure
```
BTC Price ←→ Volatility (inverse)
    ↓
Market Cap ←→ On-Chain Volume
    ↓
Stablecoin Supply ←→ Market Regime
    ↓
Leverage Ratio ←→ Funding Rates
```

### Event Generation
Events are generated based on market conditions:
- **ETF Inflow Surge**: Recent flows > 1500M
- **Leverage Build-Up**: Leverage >20%, low vol change
- **Forced Deleveraging**: Price drop >15%, leverage <13%
- **Stablecoin Supply Jump**: Supply change >8B
- **Liquidity Drought**: Price drop + supply contraction

Minimum 15 days spacing between events to avoid clustering.

## Schema Validation

All data structures validated with Zod at runtime:

### TimeSeries Schema
```typescript
{
  metric_id: string,
  label: string,
  unit: string,
  frequency: enum('daily', 'weekly', 'monthly'),
  observations: Array<{date: ISO string, value: number}>,
  asset?: enum('BTC', 'ETH', 'TOTAL', 'STABLES'),
  notes?: string,
  source_type: enum('synthetic', 'open')
}
```

### Event Schema
```typescript
{
  event_id: string,
  label: string,
  date: ISO string,
  category: enum('policy', 'market', 'microstructure', 'regulation', 'liquidity'),
  severity: number (1-5),
  description: string
}
```

## State Management

### Zustand Store
Centralized state for:
- Selected asset filter
- Date range
- Event visibility toggle
- Active events list
- Selected event (for modal)
- Methodology drawer state

### Custom Hooks
- `useTimeSeries(metricId)`: Fetches time series with filters
- `useLatestValue(metricId)`: Fetches most recent value
- `useEvents()`: Loads and caches events

Hooks automatically re-fetch when filters change.

## Component Architecture

### Layout Hierarchy
```
App
├── Header
├── FilterBar
├── KPIStrip
├── Sidebar + Main Content
│   └── Page Components
│       └── Chart Components
├── EventModal
└── MethodologyDrawer
```

### Chart Component Pattern
All charts follow this pattern:
1. **ChartCard**: Wrapper with title, tooltips, export buttons
2. **Recharts Component**: Line/Area/Bar chart with data
3. **Event Markers**: Optional reference lines for events
4. **Tooltip Formatter**: Custom formatting per metric

### Reusable Components
- `TimeSeriesLineChart`: Standard line chart with events
- `DualAxisChart`: Two metrics on left/right axes
- `ChartCard`: Standard chart wrapper with metadata

## Data Flow

```
User Action (filter change)
    ↓
Zustand Store Update
    ↓
React Hook Re-execution
    ↓
DataProvider.getSeries()
    ↓
SyntheticDataProvider (cache lookup)
    ↓
Component Re-render
```

## Export Functionality

### JSON Download
1. User clicks "JSON" button
2. `downloadJSON()` creates blob from current data
3. Browser downloads as `{chartId}-{date}.json`

### PNG Export (Placeholder)
Future implementation with html2canvas or similar library.

## Security Architecture

### No Secrets in Code
- Environment variables only
- `.env.local` gitignored
- No production endpoints
- No API keys committed

### Production Recommendations
1. Use secret management system (AWS Secrets Manager, Vercel Env Vars)
2. Implement proper authentication
3. Use HTTPS only
4. Rate limit API calls
5. Validate all inputs
6. Implement CORS policies

## Testing Strategy

### Unit Tests (To Implement)
- Schema validation with Zod
- Synthetic generator functions
- Data transformations
- Utility functions

### Integration Tests (To Implement)
- DataProvider interface compliance
- Hook behavior with state changes
- Chart rendering with mock data

### E2E Tests (To Implement)
- User workflows
- Filter interactions
- Event modal opening
- Export functionality

## Performance Optimizations

### Current
- Pre-generate all synthetic data on mount
- Cache in SyntheticDataProvider
- React.memo for expensive components
- Lazy loading for heavy charts (future)

### Future
- Virtual scrolling for long time series
- Web Workers for data generation
- Code splitting by page
- Dynamic imports for chart libraries

### Extending the Architecture

This architecture demonstrates how to build extensible data integration systems:

#### Adding a New Data Provider
1. Implement `DataProvider` interface
2. Map external data formats to internal schemas
3. Implement error handling and retry logic
4. Add caching for performance
5. Update factory in `src/data/index.ts`

#### DevOps Considerations for Production Systems
- Secure credential management (environment variables, secrets managers)
- API rate limiting and quota management
- Monitoring and alerting for data quality
- Fallback strategies for API failures
- CI/CD integration for deployment

See [INSTRUCTIONS.md](INSTRUCTIONS.md) for detailed examples of implementing data integrations with DevOps best practices.

### Adding a New Metric
1. Add calculation in `SyntheticGenerator`
2. Cache in `SyntheticDataProvider.generateAllData()`
3. Add metadata in `getMetadata()`
4. Document in METRICS.md
5. Create chart component
6. Add to appropriate page

### Adding a New Page
1. Create page component in `src/pages/`
2. Use existing hooks to fetch data
3. Compose charts from reusable components
4. Add route to Sidebar
5. Update App.tsx router logic

## Build and Deploy

### Development
```bash
npm run dev  # Vite dev server with HMR
```

### Production Build
```bash
npm run build  # TypeScript compilation + Vite build
```

Output: `dist/` directory with static assets

### Deployment Options
- **Vercel**: Zero-config, auto-deploy from Git
- **Netlify**: Drag-and-drop or Git integration  
- **GitHub Pages**: Static hosting
- **AWS S3 + CloudFront**: Full control

Environment variables must be configured in hosting platform.

## Future Architecture Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Multi-tenancy**: Support multiple portfolios/users
3. **Custom Alerts**: User-defined threshold notifications
4. **Historical Snapshots**: Save and compare past states
5. **Advanced Analytics**: Correlation matrices, regression analysis
6. **Export to PDF**: Comprehensive reporting
7. **Dark Mode**: Theme switching
8. **Mobile Responsive**: Optimize for mobile devices

## Conclusion

This architecture demonstrates:
- **Maintainability**: Clear separation of concerns
- **Security awareness**: No hardcoded credentials or secrets
- **Professional patterns**: Industry-standard architectural approaches
- **Extensibility**: Easy to add new metrics and data providers

This example showcases software engineering and DevOps capabilities through a well-architected dashboard system.
