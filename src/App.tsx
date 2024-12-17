import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Breadcrumb } from './components/navigation/Breadcrumb';
import { HomePage } from './pages/HomePage';
import { PropertyPage } from './pages/PropertyPage';
import { RoomPage } from './pages/RoomPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CompletePage } from './pages/CompletePage';
import { MyPage } from './pages/MyPage';
import { CreatePropertyPage } from './pages/property/CreatePropertyPage';
import { EditPropertyPage } from './pages/property/EditPropertyPage';
import { EditRoomPage } from './pages/property/EditRoomPage';
import { EditMaterialPage } from './pages/property/EditMaterialPage';
import { MaterialDetailPage } from './pages/property/MaterialDetailPage';

// ClerkのPublishable Keyが設定されているか確認
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

// ログインが必要なルートを保護するコンポーネント
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export const App = () => {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <div className="fixed top-0 left-0 right-0 z-50">
            <Header />
            <Breadcrumb />
          </div>
          <div className="pt-24 md:pt-28 pb-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/property/create" element={<CreatePropertyPage />} />
              <Route path="/property/:propertyId/edit" element={<EditPropertyPage />} />
              <Route path="/property/:propertyId/room/:roomId/edit" element={<EditRoomPage />} />
              <Route path="/property/:propertyId/room/:roomId/material/:materialId/edit" element={<EditMaterialPage />} />
              <Route path="/property/:propertyId/room/:roomId/material/:materialId" element={<MaterialDetailPage />} />
              <Route path="/property/:id" element={<PropertyPage />} />
              <Route path="/property/:propertyId/room/:roomId" element={<RoomPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/complete" element={<CompletePage />} />
              <Route path="/favorites" element={<div>お気に入り</div>} />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </Router>
    </ClerkProvider>
  );
};

export default App;