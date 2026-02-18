import React from 'react';
import { useAppStore } from '../../app/store';

export const Header: React.FC = () => {
  const { isMethodologyOpen, setMethodologyOpen } = useAppStore();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Digital Assets Intelligence
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Monetary infrastructure analytics
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Synthetic Data Mode
            </span>
            
            <button
              onClick={() => setMethodologyOpen(!isMethodologyOpen)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Methodology
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
