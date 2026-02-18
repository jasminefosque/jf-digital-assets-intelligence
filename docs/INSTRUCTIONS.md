# Final Instructions and Customization Guide

This document provides instructions for customizing, extending, and deploying the Digital Assets Intelligence dashboard.

## Repository Rename (If Needed)

If you want to rename the repository:

### On GitHub
1. Go to repository Settings
2. Scroll to "Repository name"
3. Enter new name
4. Click "Rename"

### Locally
```bash
git remote set-url origin https://github.com/yourusername/new-repo-name.git
```

## Customization Guide

### 1. Typography and Fonts

#### Add Custom Font
Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Playfair Display', 'serif'],
      mono: ['Fira Code', 'monospace'],
    },
  },
}
```

Load fonts in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### Adjust Font Sizes
```javascript
// tailwind.config.js
theme: {
  extend: {
    fontSize: {
      'xxs': '0.625rem',
      '3xl': '2rem',
      // Add custom sizes
    },
  },
}
```

### 2. Spacing and Layout

#### Adjust Container Width
```javascript
// tailwind.config.js
theme: {
  extend: {
    maxWidth: {
      '8xl': '88rem',
      '9xl': '96rem',
    },
  },
}
```

#### Custom Spacing
```javascript
theme: {
  extend: {
    spacing: {
      '72': '18rem',
      '84': '21rem',
      '96': '24rem',
    },
  },
}
```

### 3. Color Scheme

#### Update Brand Colors
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      brand: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        // ... your brand colors
        900: '#0c4a6e',
      },
      accent: {
        // accent colors
      },
    },
  },
}
```

#### Apply to Components
```typescript
// Update Header.tsx, FilterBar.tsx, etc.
className="bg-brand-600 hover:bg-brand-700"
```

### 4. Chart Styling

#### Default Chart Colors
Edit `src/pages/OverviewPage.tsx`:

```typescript
<TimeSeriesLineChart
  data={btcPrice.data}
  color="#your-color-hex"
  // ...
/>
```

#### Chart Dimensions
```typescript
// In chart components
<ResponsiveContainer width="100%" height={500}> // Adjust height
```

### 5. Adding New Metrics

#### Step 1: Update Generator
```typescript
// src/data/synthetic/generator.ts
generateYourMetric(dailyDates: Date[]): number[] {
  const values: number[] = [];
  
  dailyDates.forEach((date) => {
    const regime = this.getRegimeAtDate(date);
    const value = /* your calculation */;
    values.push(value);
  });
  
  return values;
}
```

#### Step 2: Cache in Provider
```typescript
// src/data/synthetic/SyntheticDataProvider.ts
private generateAllData(): void {
  // ... existing metrics
  const yourMetric = this.generator.generateYourMetric(this.dailyDates);
  this.cachedData.set('your_metric_id', yourMetric);
}
```

#### Step 3: Add Metadata
```typescript
// In getMetadata() method
your_metric_id: {
  label: 'Your Metric Label',
  unit: 'Units',
  notes: 'Description of your metric',
},
```

#### Step 4: Create Chart
```typescript
// In relevant page component
const yourMetric = useTimeSeries('your_metric_id');

<ChartCard
  title="Your Metric"
  subtitle="Description"
  definition="Detailed definition"
  data={yourMetric.data}
  chartId="your-metric"
>
  <TimeSeriesLineChart
    data={yourMetric.data}
    color="#color"
    yAxisFormatter={(v) => formatNumber(v, 2)}
    tooltipFormatter={(v) => formatNumber(v, 3)}
  />
</ChartCard>
```

### 6. Adding a Real Open Data Adapter

#### Step 1: Create Adapter Class
```typescript
// src/data/adapters/CoinGeckoAdapter.ts
import type { DataProvider, GetSeriesParams } from '../DataProvider';
import type { TimeSeries } from '../../models/schemas';

export class CoinGeckoAdapter implements DataProvider {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  
  async getSeries(metricId: string, params?: GetSeriesParams): Promise<TimeSeries> {
    // Only implement metrics you can get from free endpoint
    if (metricId === 'btc_price') {
      const response = await fetch(
        `${this.baseUrl}/coins/bitcoin/market_chart?vs_currency=usd&days=365`
      );
      const data = await response.json();
      
      return {
        metric_id: 'btc_price',
        label: 'BTC Price',
        unit: 'USD',
        frequency: 'daily',
        observations: data.prices.map(([timestamp, value]: [number, number]) => ({
          date: new Date(timestamp).toISOString(),
          value,
        })),
        source_type: 'open',
      };
    }
    
    throw new Error(`Metric ${metricId} not available from CoinGecko free tier`);
  }
  
  // Implement other methods...
}
```

#### Step 2: Update Factory
```typescript
// src/data/index.ts
import { CoinGeckoAdapter } from './adapters/CoinGeckoAdapter';

export function createDataProvider(): DataProvider {
  const mode = import.meta.env.VITE_DATA_MODE || 'synthetic';
  
  switch (mode) {
    case 'synthetic':
      return new SyntheticDataProvider();
    case 'coingecko':
      return new CoinGeckoAdapter();
    case 'open':
      return new OpenDataProvider();
    default:
      return new SyntheticDataProvider();
  }
}
```

#### Step 3: Set Environment Variable
```bash
# .env.local
VITE_DATA_MODE=coingecko
```

### 7. Adding a New Page

#### Step 1: Create Page Component
```typescript
// src/pages/DerivativesPage.tsx
import React from 'react';
import { useTimeSeries } from '../hooks/useData';
import { ChartCard } from '../components/charts/ChartCard';
import { TimeSeriesLineChart } from '../components/charts/TimeSeriesLineChart';

export const DerivativesPage: React.FC = () => {
  const futuresOI = useTimeSeries('futures_open_interest');
  const leverageRatio = useTimeSeries('leverage_ratio_proxy');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Derivatives Leverage</h2>
        <p className="text-gray-600 mt-2">
          Derivatives market structure and leverage metrics
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add your charts here */}
      </div>
    </div>
  );
};
```

#### Step 2: Add Route
```typescript
// src/App.tsx
import { DerivativesPage } from './pages/DerivativesPage';

const renderPage = () => {
  switch (currentPage) {
    case 'overview':
      return <OverviewPage />;
    case 'derivatives':
      return <DerivativesPage />;
    // ...
  }
};
```

#### Step 3: Update Sidebar
Already configured in `src/components/layout/Sidebar.tsx`

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure Environment**
   - Go to Vercel dashboard → Project Settings → Environment Variables
   - Add: `VITE_DATA_MODE=synthetic`

3. **Deploy**
   - Push to GitHub
   - Auto-deploys on every commit

### Netlify

1. **Connect Repository**
   - Go to Netlify dashboard
   - New site from Git
   - Select repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Site settings → Environment variables
   - Add: `VITE_DATA_MODE=synthetic`

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/repo-name"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure**
   - Repository Settings → Pages
   - Source: gh-pages branch

### AWS S3 + CloudFront

1. **Build**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   aws s3 sync dist/ s3://your-bucket-name --acl public-read
   ```

3. **Configure S3 for Static Hosting**
   - Bucket properties → Static website hosting
   - Index document: `index.html`
   - Error document: `index.html`

4. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Default Root Object: `index.html`

## Performance Optimization

### Code Splitting
```typescript
// Lazy load pages
const OverviewPage = React.lazy(() => import('./pages/OverviewPage'));

<Suspense fallback={<Loading />}>
  <OverviewPage />
</Suspense>
```

### Chunk Size
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'recharts': ['recharts'],
          'vendor': ['react', 'react-dom'],
        },
      },
    },
  },
});
```

## Monitoring and Analytics

### Add Google Analytics
```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Add Error Tracking (Sentry)
```bash
npm install @sentry/react
```

```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
```bash
# Check TypeScript
npx tsc --noEmit
```

### Tailwind Not Working
- Ensure PostCSS config is correct
- Check tailwind.config.js content paths
- Restart dev server

### Charts Not Rendering
- Check browser console for errors
- Verify data is loading in React DevTools
- Check Recharts ResponsiveContainer parent has height

## Support and Resources

- React Docs: https://react.dev
- TypeScript Docs: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Recharts: https://recharts.org/en-US
- Zustand: https://github.com/pmndrs/zustand
- Zod: https://zod.dev

## License

MIT License - Free to use and modify for your portfolio.
