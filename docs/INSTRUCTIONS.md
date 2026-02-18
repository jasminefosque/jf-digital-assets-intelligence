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

### 6. Connecting Real Data Sources (DevOps/Engineering Showcase)

This section demonstrates how the dashboard architecture supports connecting real data sources through the DataProvider pattern. This showcases engineering capabilities for building production-ready data integrations.

#### Architecture Pattern

The DataProvider interface creates a clean separation between the UI and data sources:

```typescript
// src/data/DataProvider.ts
export interface DataProvider {
  getSeries(metricId: string, params?: GetSeriesParams): Promise<TimeSeries>;
  getLatest(metricId: string, params?: GetLatestParams): Promise<number>;
  getMetadata(metricId: string): Promise<Partial<TimeSeries>>;
  getEvents(params?: GetEventsParams): Promise<Event[]>;
}
```

#### Implementation Steps

**Step 1: Create a New Provider Class**

Create a new file implementing the DataProvider interface:

```typescript
// src/data/providers/YourDataProvider.ts
import type { DataProvider, GetSeriesParams } from '../DataProvider';
import type { TimeSeries } from '../../models/schemas';

export class YourDataProvider implements DataProvider {
  private baseUrl: string;
  private apiKey?: string;
  
  constructor() {
    // Configuration from environment variables
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    this.apiKey = import.meta.env.VITE_API_KEY;
  }
  
  async getSeries(metricId: string, params?: GetSeriesParams): Promise<TimeSeries> {
    // Implement data fetching logic
    // Transform external data format to TimeSeries schema
    // Handle errors appropriately
    
    const response = await fetch(`${this.baseUrl}/data/${metricId}`, {
      headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}
    });
    
    const data = await response.json();
    
    return {
      metric_id: metricId,
      label: data.name,
      unit: data.unit,
      frequency: 'daily',
      observations: data.values.map((item: any) => ({
        date: item.timestamp,
        value: item.value,
      })),
      source_type: 'api',
    };
  }
  
  async getLatest(metricId: string, params?: GetLatestParams): Promise<number> {
    // Implement latest value fetching
    // Could fetch from a different endpoint or reuse getSeries
  }
  
  async getMetadata(metricId: string): Promise<Partial<TimeSeries>> {
    // Return metadata about the metric
  }
  
  async getEvents(params?: GetEventsParams): Promise<Event[]> {
    // Fetch and transform events data
  }
}
```

**Step 2: Update the Provider Factory**

Modify the factory to support your new provider:

```typescript
// src/data/index.ts
import type { DataProvider } from './DataProvider';
import { SyntheticDataProvider } from './synthetic/SyntheticDataProvider';
import { YourDataProvider } from './providers/YourDataProvider';

export function createDataProvider(): DataProvider {
  const mode = import.meta.env.VITE_DATA_MODE || 'synthetic';
  
  switch (mode) {
    case 'synthetic':
      return new SyntheticDataProvider();
    case 'live':
      return new YourDataProvider();
    default:
      return new SyntheticDataProvider();
  }
}
```

**Step 3: Configure Environment Variables**

Add necessary configuration:

```bash
# .env.local (never commit this file)
VITE_DATA_MODE=live
VITE_API_BASE_URL=https://api.example.com/v1
VITE_API_KEY=your_api_key_here  # Use secrets management in production
```

**Step 4: Implement Error Handling and Caching**

```typescript
export class YourDataProvider implements DataProvider {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes
  
  async getSeries(metricId: string, params?: GetSeriesParams): Promise<TimeSeries> {
    // Check cache first
    const cached = this.cache.get(metricId);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }
    
    try {
      // Fetch data with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { /* ... */ }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await this.transformResponse(await response.json());
      
      // Cache the result
      this.cache.set(metricId, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${metricId}:`, error);
      // Fallback strategy: return cached data if available
      if (cached) {
        console.warn('Using stale cached data due to fetch error');
        return cached.data;
      }
      throw error;
    }
  }
}
```

#### DevOps Best Practices for Data Integration

**Security**
- Never commit API keys or credentials to version control
- Use environment variables for configuration
- Implement proper authentication and authorization
- Use secrets management systems (AWS Secrets Manager, HashiCorp Vault, etc.)
- Rotate API keys regularly

**Performance**
- Implement caching to reduce API calls
- Use request deduplication for concurrent requests
- Set appropriate timeout values
- Consider implementing rate limiting
- Use pagination for large datasets

**Reliability**
- Implement retry logic with exponential backoff
- Handle network errors gracefully
- Provide fallback data sources
- Monitor API health and availability
- Log errors for debugging

**Monitoring**
- Track API response times
- Monitor error rates
- Set up alerts for API failures
- Track API quota usage
- Log all external requests

**Testing**
- Mock API responses in tests
- Test error handling scenarios
- Validate data schema transformations
- Test caching behavior
- Load test API integrations

#### CI/CD Integration Example

```yaml
# .github/workflows/deploy.yml
name: Deploy Dashboard

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        env:
          VITE_DATA_MODE: ${{ secrets.DATA_MODE }}
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_API_KEY: ${{ secrets.API_KEY }}
        run: npm run build
        
      - name: Deploy
        # Deploy to your hosting service
        run: |
          # Deployment commands here
```

This architecture demonstrates production-ready patterns for:
- Clean separation of concerns
- Configurable data sources
- Secure credential management
- Error handling and resilience
- Performance optimization
- DevOps automation

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
