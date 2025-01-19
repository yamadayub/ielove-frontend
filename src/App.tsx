import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

// ClerkのPublishable Keyが設定されいるか確認
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const jaJP = {
  socialButtonsBlockButton: "{{provider}}でログイン",
  formFieldLabel__emailAddress: "メールアドレス",
  formFieldLabel__password: "パスワード",
  formButtonPrimary: "ログイン",
  footerActionLink: "アカウントを作成",
  footerActionText: "アカウントをお持ちでないですか？",
  dividerText: "または",
  formFieldAction__forgotPassword: "パスワードをお忘れですか？",
  signUp: {
    socialButtonsBlockButton: "{{provider}}で登録",
    formButtonPrimary: "アカウントを作成",
    footerActionLink: "ログイン",
    footerActionText: "すでにアカウントをお持ちですか？",
    formFieldLabel__firstName: "名",
    formFieldLabel__lastName: "姓",
    formFieldInputPlaceholder__firstName: "名を入力",
    formFieldInputPlaceholder__lastName: "姓を入力",
    formFieldInputPlaceholder__emailAddress: "メールアドレスを入力",
    formFieldInputPlaceholder__password: "パスワードを入力"
  }
};

export const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <ClerkProvider 
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        localization={jaJP}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"     // サインアップページのパス
        afterSignInUrl="/"       // ログイン後のリダイレクト先
        afterSignUpUrl="/"       // サインアップ後のリダイレクト先
        debug={true}
      >
        <Router>
          <ScrollToTop />
          <QueryProvider>
            <div className="min-h-screen bg-gray-50">
              <div className="fixed top-0 left-0 right-0 z-50">
                <div className="bg-white">
                  <Header />
                </div>
              </div>
              <div className="pt-[50px] pb-14">
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
                      <EditUserProfilePage />
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