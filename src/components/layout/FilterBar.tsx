import React from 'react';
import { useAppStore } from '../../app/store';
import type { Asset } from '../../models/schemas';

export const FilterBar: React.FC = () => {
  const { selectedAsset, setSelectedAsset, showEvents, setShowEvents, dateRange, setDateRange } = useAppStore();
  
  const assets: Asset[] = ['BTC', 'ETH', 'TOTAL', 'STABLES'];
  
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-6 flex-wrap">
        {/* Asset Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Asset:</label>
          <div className="flex gap-1">
            {assets.map((asset) => (
              <button
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selectedAsset === asset
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {asset}
              </button>
            ))}
          </div>
        </div>
        
        {/* Date Range */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">From:</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">To:</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Event Overlay Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show-events"
            checked={showEvents}
            onChange={(e) => setShowEvents(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="show-events" className="text-sm font-medium text-gray-700">
            Show Events
          </label>
        </div>
      </div>
    </div>
  );
};
