import React, { type ReactNode } from 'react';
import { downloadJSON, exportChartAsPNG } from '../../lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  definition?: string;
  children: ReactNode;
  data?: any;
  chartId?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  definition,
  children,
  data,
  chartId = 'chart',
}) => {
  const handleDownloadJSON = () => {
    if (data) {
      downloadJSON(data, `${chartId}-${new Date().toISOString().split('T')[0]}.json`);
    }
  };
  
  const handleExportPNG = () => {
    exportChartAsPNG(chartId, `${chartId}-${new Date().toISOString().split('T')[0]}.png`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {definition && (
              <div className="group relative">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {definition}
                </div>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {data && (
            <>
              <button
                onClick={handleDownloadJSON}
                className="text-xs px-3 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                title="Download data as JSON"
              >
                JSON
              </button>
              <button
                onClick={handleExportPNG}
                className="text-xs px-3 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                title="Export as PNG"
              >
                PNG
              </button>
            </>
          )}
        </div>
      </div>
      
      <div id={chartId} className="mt-4">
        {children}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Source: Synthetic Data (Portfolio Mode)
        </p>
      </div>
    </div>
  );
};
