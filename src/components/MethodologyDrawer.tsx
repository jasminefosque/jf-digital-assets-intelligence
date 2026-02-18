import React from 'react';
import { useAppStore } from '../app/store.js';

export const MethodologyDrawer: React.FC = () => {
  const { isMethodologyOpen, setMethodologyOpen } = useAppStore();
  
  if (!isMethodologyOpen) return null;
  
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setMethodologyOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 overflow-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Methodology</h2>
            <button
              onClick={() => setMethodologyOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              DataProvider Pattern
            </h3>
            <p className="text-gray-700 leading-relaxed">
              This dashboard implements an abstracted DataProvider interface that separates
              UI components from data sources. The interface defines four core methods:
              <code>getSeries()</code>, <code>getLatest()</code>, <code>getMetadata()</code>,
              and <code>getEvents()</code>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This architecture protects production pipelines by allowing the synthetic
              data layer to be swapped for real open data sources without altering any
              UI components. Production datasets, proprietary models, and paid API usage
              patterns remain private.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              Synthetic Data Engine
            </h3>
            <p className="text-gray-700 leading-relaxed">
              The synthetic generator produces realistic digital asset behavior including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Market Regimes:</strong> Bull, bear, and sideways periods with realistic duration and transition probabilities</li>
              <li><strong>Volatility Clustering:</strong> Realized volatility calculated from price returns with regime-based dynamics</li>
              <li><strong>Leverage Cycles:</strong> Open interest builds up during bull markets and deleverages during drawdowns</li>
              <li><strong>Flow Persistence:</strong> ETF flows exhibit momentum and lag price movements</li>
              <li><strong>Stablecoin Dynamics:</strong> Supply expands in bull markets and contracts during risk-off periods</li>
              <li><strong>Liquidation Cascades:</strong> Spikes occur during high volatility and leverage</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              Event System
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Eight predefined event types are generated based on market conditions:
              ETF inflow surges, leverage build-ups, forced deleveraging, stablecoin
              supply jumps, liquidity droughts, regulatory shocks, macro risk-off events,
              and policy pivot rallies. Events are clickable on charts to display detailed
              information.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              Schema Validation
            </h3>
            <p className="text-gray-700 leading-relaxed">
              All data models are validated using Zod schemas. TimeSeries objects include
              metric ID, label, unit, frequency, observations array, optional asset filter,
              and source type. Event objects include event ID, label, date, category,
              severity (1-5), and description.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              Connecting Real Data Sources
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To connect real data sources:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-1">
              <li>Implement a new class conforming to the DataProvider interface</li>
              <li>Map external data to the TimeSeries and Event schemas</li>
              <li>Update the factory in <code>src/data/index.ts</code></li>
              <li>Set <code>VITE_DATA_MODE=open</code> in your environment</li>
            </ol>
            <p className="text-gray-700 leading-relaxed">
              UI components remain unchanged. All transformations happen in the provider layer.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              Security Guidance
            </h3>
            <p className="text-gray-700 leading-relaxed">
              <strong>Never commit API keys to version control.</strong> Use environment
              variables for all secrets. Store production credentials in secure secret
              management systems. This repository demonstrates architectural patterns
              only—production data pipelines are not included.
            </p>
            <p className="text-gray-700 leading-relaxed">
              For local development, create a <code>.env.local</code> file (which is
              gitignored) to store environment variables. For production deployments,
              use your platform's secret management (e.g., Vercel Environment Variables,
              AWS Secrets Manager).
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              Export Functionality
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Each chart includes export buttons to download the current view's dataset
              as JSON or export the chart as PNG. These features enable reproducibility
              and sharing of analysis without exposing underlying data pipelines.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setMethodologyOpen(false)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
