/**
 * Format a number as currency
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a number with specified decimals
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${formatNumber(value, decimals)}%`;
}

/**
 * Format a large number with abbreviations (K, M, B, T)
 */
export function formatLargeNumber(value: number, decimals: number = 2): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e12) {
    return `${sign}${formatNumber(absValue / 1e12, decimals)}T`;
  } else if (absValue >= 1e9) {
    return `${sign}${formatNumber(absValue / 1e9, decimals)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}${formatNumber(absValue / 1e6, decimals)}M`;
  } else if (absValue >= 1e3) {
    return `${sign}${formatNumber(absValue / 1e3, decimals)}K`;
  }
  
  return `${sign}${formatNumber(absValue, decimals)}`;
}

/**
 * Format a date
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Format a date for chart axis (shorter format)
 */
export function formatChartDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export chart as PNG (requires html2canvas or similar)
 * For now, this is a placeholder
 */
export function exportChartAsPNG(elementId: string, filename: string): void {
  // TODO: Implement with html2canvas or similar library
  console.log(`Export ${elementId} as ${filename}`);
  alert('Export as PNG feature coming soon. For now, use browser screenshot tools.');
}

/**
 * Calculate change and change percentage
 */
export function calculateChange(current: number, previous: number): { change: number; changePercent: number } {
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
  
  return { change, changePercent };
}

/**
 * Get color for positive/negative value
 */
export function getValueColor(value: number): string {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
