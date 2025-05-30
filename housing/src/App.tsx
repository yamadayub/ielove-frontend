import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

// Pages
import Dashboard from './pages/Dashboard';
import PropertyTypeSelection from './pages/PropertyTypeSelection';
import PropertyInfoForm from './pages/PropertyInfoForm';
import FloorPlanEditor from './pages/FloorPlanEditor';
import IsometricView from './pages/IsometricView';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // Vite の base 設定に合わせて basename を設定
  const basename = '/housing';
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={basename}>
        <div className="App min-h-screen overflow-y-auto">
          <Routes>
            {/* /housing/配下のルートのみを処理 */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/property-type" element={<PropertyTypeSelection />} />
            <Route path="/property-info" element={<PropertyInfoForm />} />
            <Route path="/floor-plan-editor" element={<FloorPlanEditor />} />
            <Route path="/isometric-view" element={<IsometricView />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App; 