import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { Header } from './features/common/components/layout/Header';
import { BottomNav } from './features/common/components/layout/BottomNav';
import { Breadcrumb } from './features/common/components/navigation/Breadcrumb';
import { HomePage } from './pages/HomePage';
import { PropertyPage } from './pages/property/PropertyPage';
import { RoomPage } from './pages/room/RoomPage';
import { CheckoutPage } from './pages/purchase/CheckoutPage';
import { CompletePage } from './pages/purchase/CompletePage';
import { MyPage } from './pages/user/MyPage';
import { CreatePropertyPage } from './pages/property/CreatePropertyPage';
import { EditPropertyPage } from './pages/property/EditPropertyPage';
import { EditRoomPage } from './pages/room/EditRoomPage';
import { EditProductPage } from './pages/product/EditProductPage';
import { ProductDetailPage } from './pages/product/ProductDetailPage';
import { QueryProvider } from './providers/QueryProvider';
import { AuthPage } from './features/auth/pages/AuthPage';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { SearchPage } from './pages/search/SearchPage';
import { EditUserProfilePage } from './pages/user/EditUserProfilePage';
import { ScrollToTop } from './features/common/components/ScrollToTop';
import { EditListingPage } from './pages/listing/EditListingPage';
import { Toaster } from 'react-hot-toast';
import { CheckoutSuccess } from './pages/purchase/CheckoutSuccess';
import { CheckoutCancel } from './pages/purchase/CheckoutCancel';
import { PropertyDetailPage } from './pages/property/PropertyDetailPage';
import { OnboardingCompletePage } from './pages/seller/OnboardingCompletePage';
import { ErrorPage } from './pages/ErrorPage';
import { FavoritesPage } from './pages/favorites/FavoritesPage';
import { EditDrawingPage } from './pages/drawing/EditDrawingPage';
import { TermsOfService } from './features/common/components/legal/TermsOfService';
import { CommercialTransactionLaw } from './features/common/components/legal/CommercialTransactionLaw';
import { PrivacyPolicy } from './features/common/components/legal/PrivacyPolicy';
import { EditMyPage } from './pages/user/EditMyPage';

// ClerkのPublishable Keyが設定されいるか確認
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <ClerkProvider 
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_aW52aXRpbmctZnJvZy0zMy5jbGVyay5hY2NvdW50cy5kZXYk'}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
      >
        <Router future={{ v7_startTransition: true }}>
          <ScrollToTop />
          <QueryProvider>
            <div className="min-h-screen bg-gray-50">
              <div className="fixed top-0 left-0 right-0 z-50">
                <div className="bg-white">
                  <Header />
                </div>
              </div>
              <div className="pt-12 pb-14">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/sign-in/*" element={<AuthPage />} />
                  <Route path="/sign-up/*" element={<AuthPage />} />
                  <Route path="/property/create" element={
                    <ProtectedRoute>
                      <CreatePropertyPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mypage" element={
                    <ProtectedRoute>
                      <MyPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/property/:propertyId/edit" element={
                    <ProtectedRoute>
                      <EditPropertyPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/property/:propertyId/room/:roomId/edit" element={
                    <ProtectedRoute>
                      <EditRoomPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/property/:propertyId/room/:roomId/product/:productId/edit" element={<EditProductPage />} />
                  <Route path="/property/:propertyId/room/:roomId/product/:productId" element={<ProductDetailPage />} />
                  <Route path="/property/:id" element={<PropertyPage />} />
                  <Route path="/property/:id/detail" element={<PropertyDetailPage />} />
                  <Route path="/property_mock/:id" element={<div>Mock Property Page</div>} />
                  <Route path="/property/:propertyId/room/:roomId" element={<RoomPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/checkout/success" element={
                    <ProtectedRoute>
                      <CheckoutSuccess />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout/cancel" element={
                    <ProtectedRoute>
                      <CheckoutCancel />
                    </ProtectedRoute>
                  } />
                  <Route path="/complete" element={<CompletePage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/mypage/edit" element={
                    <ProtectedRoute>
                      <EditMyPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/listings/:id/edit" element={<EditListingPage />} />
                  <Route path="/seller/onboarding/complete" element={<OnboardingCompletePage />} />
                  <Route path="/error" element={<ErrorPage />} />
                  <Route path="/property/:propertyId/drawing/:drawingId/edit" element={
                    <ProtectedRoute>
                      <EditDrawingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/commercial-law" element={<CommercialTransactionLaw />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                </Routes>
              </div>
              <BottomNav />
            </div>
          </QueryProvider>
        </Router>
      </ClerkProvider>
    </>
  );
};

export default App;