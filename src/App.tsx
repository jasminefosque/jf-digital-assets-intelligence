import { useState } from 'react';
import { Header } from './components/layout/Header';
import { FilterBar } from './components/layout/FilterBar';
import { KPIStrip } from './components/layout/KPIStrip';
import { Sidebar } from './components/layout/Sidebar';
import { EventModal } from './components/EventModal';
import { MethodologyDrawer } from './components/MethodologyDrawer';
import { OverviewPage } from './pages/OverviewPage';
import { useEvents } from './hooks/useData';

function App() {
  const [currentPage, setCurrentPage] = useState('overview');
  
  // Load events on mount
  useEvents();
  
  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage />;
      case 'methodology':
        // Methodology is shown in drawer, default to overview
        return <OverviewPage />;
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Page Under Construction
              </h2>
              <p className="text-gray-600">
                {currentPage} page is being implemented
              </p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FilterBar />
      <KPIStrip />
      
      <div className="flex">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>
      
      <EventModal />
      <MethodologyDrawer />
    </div>
  );
}

export default App;
