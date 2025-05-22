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
import OrderConfirmationPage from './Pages/OrderConfirmationPage'
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
        <Route path="product/:id" element={<ProductDetail/>}></Route>
        <Route path="checkout" element={<Checkout/>}></Route>
        <Route path="order-confirmation" element={<OrderConfirmationPage/>}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
  
  )
}

export default App
