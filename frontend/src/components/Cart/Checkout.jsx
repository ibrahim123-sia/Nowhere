import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import { mergeCart } from "../../redux/slices/cartSlice"; // Your existing action

const Checkout = () => {
  const [checkoutId, setCheckoutId] = useState();
  const [isMergingCart, setIsMergingCart] = useState(false);
  const [hasAttemptedMerge, setHasAttemptedMerge] = useState(false);
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  // Check if we need to merge the guest cart with user cart
  useEffect(() => {
    const mergeGuestCart = async () => {
      // If user is logged in, we have a guestId, and haven't attempted merge yet
      if (user && guestId && !hasAttemptedMerge) {
        setIsMergingCart(true);
        setHasAttemptedMerge(true);
        
        try {
          await dispatch(mergeCart({ guestId, userId: user._id })).unwrap();
          console.log("Cart merged successfully");
        } catch (err) {
          console.error("Failed to merge cart:", err);
          // Even if merge fails, we can still proceed with checkout
          // The user might not have a guest cart anymore
        } finally {
          setIsMergingCart(false);
        }
      }
    };

    mergeGuestCart();
  }, [user, guestId, dispatch, hasAttemptedMerge]);

  // CSS classes
  const pageWrapper = "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8";
  const formWrapper = "w-full bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100";
  const summaryWrapper = "w-full bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100";
  const inputClass = "w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm";
  const buttonPrimary = "w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg";
  const buttonDisabled = "w-full bg-gray-400 text-white p-3 rounded-lg font-medium cursor-not-allowed";
  const labelClass = "block text-sm font-medium mb-2 text-gray-600";
  const headingSecondary = "text-lg font-semibold text-indigo-800 mb-4";

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!cart || cart.products.length === 0 || isMergingCart) return;

    try {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress: {
            fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
          },
          paymentMethod: "COD",
          totalPrice: cart.totalPrice,
        })
      );

      if (res.payload && res.payload._id) {
        const newCheckoutId = res.payload._id;
        setCheckoutId(newCheckoutId);

        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${newCheckoutId}/pay`,
          {
            paymentStatus: "paid",
            paymentDetails: { method: "Cash on Delivery" },
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${newCheckoutId}/finalize`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );

        navigate("/order-confirmation");
      }
    } catch (err) {
      console.error("Order submission failed:", err);
      // Handle specific error cases
      if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      }
    }
  };

  if (loading || isMergingCart) return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-600">
        {isMergingCart ? "Merging your cart..." : "Loading your cart..."}
      </p>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
      Error: {error}
    </div>
  );
  
  if (!cart || !cart.products || cart.products.length === 0) return (
    <div className="text-center p-8 bg-white rounded-lg shadow">
      <p className="text-gray-600">Your cart is empty</p>
      <button 
        onClick={() => navigate("/")}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        Continue Shopping
      </button>
    </div>
  );

  return (
    <div className={pageWrapper}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left section - Shipping Form */}
          <div className={formWrapper}>
            <form onSubmit={handleSubmitOrder}>
              <h2 className={headingSecondary}>Contact Details</h2>
              <div className="mb-6">
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={user ? user.email : ""}
                  className={inputClass}
                  disabled
                />
              </div>

              <h2 className={headingSecondary}>Delivery Information</h2>
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    required
                    value={shippingAddress.firstName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    required
                    value={shippingAddress.lastName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className={labelClass}>Address</label>
                <input
                  type="text"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, address: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    className={inputClass}
                    required
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Postal Code</label>
                  <input
                    type="text"
                    className={inputClass}
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className={labelClass}>Country</label>
                <input
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div className="mb-8">
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, phone: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={isMergingCart ? buttonDisabled : buttonPrimary}
                disabled={isMergingCart}
              >
                {isMergingCart ? "Processing..." : "Confirm Your Order"}
              </button>
            </form>
          </div>

          {/* Right section - Order Summary */}
          <div className={summaryWrapper}>
            <h3 className={headingSecondary}>Order Summary</h3>
            <div className="space-y-4 mb-6">
              {cart.products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    />
                    <div>
                      <h3 className="text-md font-medium text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500">Size: {product.size}</p>
                      <p className="text-sm text-gray-500">Color: {product.color}</p>
                      <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                    </div>
                  </div>
                  <p className="text-md font-semibold text-indigo-700">${product.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-800 font-medium">${cart.totalPrice?.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Shipping</p>
                <p className="text-green-600 font-medium">Free</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <p className="text-lg font-semibold text-gray-800">Total</p>
                <p className="text-xl font-bold text-indigo-700">${cart.totalPrice?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;