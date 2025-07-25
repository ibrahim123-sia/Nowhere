import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from './components/Layout/UserLayout'
import Home from "./Pages/Home";
import {Toaster} from 'sonner'
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import CollectionPage from "./Pages/CollectionPage";
import ProductDetail from "./components/Product/ProductDetail";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./Pages/OrderConfirmationPage";
import OrderDetailPage from "./Pages/OrderDetailPage";
import MyOrdersPage from "./Pages/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./Pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";
const App = () => {
  return (

    <BrowserRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}>
    <Toaster position="top-right"/>
    <Routes>
      <Route path='/' element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="profile" element={<Profile/>}/>
        <Route path="collections/:collection" element={<CollectionPage/>}/>
        <Route path="product/:id" element={<ProductDetail/>}/>
        <Route path="checkout" element={<Checkout/>}/>
        <Route path="order-confirmation" element={<OrderConfirmationPage/>}/>
        <Route path="order/:id" element={<OrderDetailPage/>}/>
        <Route path="my-orders" element={<MyOrdersPage/>}/>
      </Route>
      {/* admin route */}
       <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="product/:id/edit" element={<EditProductPage/>}/>
          <Route path="orders" element={<OrderManagement />} />
        </Route>
    </Routes>
  </BrowserRouter>
  
  )
}

export default App
