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
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/housing">
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/property-type" element={<PropertyTypeSelection />} />
            <Route path="/property-info" element={<PropertyInfoForm />} />
            <Route path="/floor-plan-editor" element={<FloorPlanEditor />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App; 