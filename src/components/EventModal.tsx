import React from 'react';
import { formatDate } from '../lib/utils.js';
import { useAppStore } from '../app/store.js';

export const EventModal: React.FC = () => {
  const { selectedEvent, setSelectedEvent } = useAppStore();
  
  if (!selectedEvent) return null;
  
  const getSeverityColor = (severity: number): string => {
    if (severity >= 4) return 'bg-red-100 text-red-800';
    if (severity >= 3) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };
  
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      policy: 'bg-blue-100 text-blue-800',
      market: 'bg-green-100 text-green-800',
      microstructure: 'bg-purple-100 text-purple-800',
      regulation: 'bg-red-100 text-red-800',
      liquidity: 'bg-indigo-100 text-indigo-800',
    };
    
    return colors[category] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedEvent.label}
            </h2>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="flex gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedEvent.category)}`}>
              {selectedEvent.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedEvent.severity)}`}>
              Severity: {selectedEvent.severity}/5
            </span>
          </div>
          
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              Date: {formatDate(selectedEvent.date)}
            </span>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
