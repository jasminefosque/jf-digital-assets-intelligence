import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
}

interface SidebarProps {
  currentPage: string;
  onPageChange: (pageId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'market-structure', label: 'Market Structure' },
    { id: 'stablecoin', label: 'Stablecoin Rail' },
    { id: 'on-chain', label: 'On-Chain Liquidity' },
    { id: 'etf', label: 'ETF Positioning' },
    { id: 'derivatives', label: 'Derivatives Leverage' },
    { id: 'risk', label: 'Risk Regime' },
    { id: 'methodology', label: 'Methodology' },
  ];
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === item.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};
