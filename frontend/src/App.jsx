import React, { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import store from "./redux/store";
import { logout } from "./redux/slices/authSlice";
import { clearCart, fetchCart } from "./redux/slices/cartSlice";
import { fetchStoreConfig } from "./redux/slices/storeSlice";
import { clearAgentLocal, fetchAgentStatus } from "./redux/slices/agentSlice";
import UserLayout from "./components/Layout/UserLayout";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import ScrollToTop from "./components/Common/ScrollToTop";
import { PageLoader } from "./components/Common/Feedback";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import CollectionPage from "./Pages/CollectionPage";
import ProductDetail from "./components/Product/ProductDetail";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./Pages/OrderConfirmationPage";
import OrderDetailPage from "./Pages/OrderDetailPage";
import MyOrdersPage from "./Pages/MyOrdersPage";
import TrackOrderPage from "./Pages/TrackOrderPage";
import WishlistPage from "./Pages/WishlistPage";
import NotFoundPage from "./Pages/NotFoundPage";

// Import support pages
import FAQPage from "./components/Common/Support/FAQPage";
import AboutUsPage from "./components/Common/Support/AboutUsPage";
import FeaturesPage from "./components/Common/Support/FeaturesPage";
import ContactUsPage from "./components/Common/Support/ContactUsPage";

// Admin pages are loaded on demand so shoppers don't download them.
const AdminLayout = lazy(() => import("./components/Admin/AdminLayout"));
const AdminHomePage = lazy(() => import("./Pages/AdminHomePage"));
const UserManagement = lazy(() => import("./components/Admin/UserManagement"));
const ProductManagement = lazy(() => import("./components/Admin/ProductManagement"));
const EditProductPage = lazy(() => import("./components/Admin/EditProductPage"));
const AddProductPage = lazy(() => import("./components/Admin/AddProductPage"));
const OrderManagement = lazy(() => import("./components/Admin/OrderManagement"));

// App-wide effects: store config, cart sync and session expiry.
const AppEffects = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);
  const previousUser = useRef(userId);

  useEffect(() => {
    dispatch(fetchStoreConfig());
    dispatch(fetchAgentStatus());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCart());
    if (previousUser.current && !userId) dispatch(clearAgentLocal());
    previousUser.current = userId;
  }, [userId, dispatch]);

  useEffect(() => {
    const onExpired = () => {
      dispatch(logout());
      dispatch(clearCart());
      toast.error("Your session expired. Please sign in again.");
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [dispatch]);

  return null;
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppEffects />
        <ScrollToTop />
        <Toaster position="top-center" richColors closeButton />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="collections/:collection" element={<CollectionPage />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="track-order" element={<TrackOrderPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
              <Route path="order/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

              {/* Support Pages */}
              <Route path="about" element={<AboutUsPage />} />
              <Route path="faqs" element={<FAQPage />} />
              <Route path="contact" element={<ContactUsPage />} />
              <Route path="features" element={<FeaturesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="product/new" element={<AddProductPage />} />
              <Route path="product/:id/edit" element={<EditProductPage />} />
              <Route path="orders" element={<OrderManagement />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
