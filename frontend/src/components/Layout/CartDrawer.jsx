import React, { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const navigate = useNavigate();
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        drawerOpen
      ) {
        toggleCartDrawer();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [drawerOpen, toggleCartDrawer]);

  const handleCheckout = () => {
    toggleCartDrawer();
    navigate(user ? "/checkout" : "/login?redirect=checkout");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-xl transform transition-all duration-300 ease-in-out flex flex-col z-50 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Your Shopping Cart</h2>
          <button
            onClick={toggleCartDrawer}
            className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 p-1 rounded-full"
            aria-label="Close cart"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Contents */}
        <div className="flex-grow p-6 overflow-y-auto">
          {cart?.products?.length > 0 ? (
            <CartContents cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <svg
                className="h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-gray-600 mb-4 text-lg">Your cart is empty</p>
              <button
                onClick={toggleCartDrawer}
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 flex items-center"
              >
                Continue Shopping
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart?.products?.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                ${cart?.cartTotal?.toFixed(2) || "0.00"}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Shipping, taxes, and discount codes calculated at checkout.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <span className="text-xs text-gray-500">Secure checkout</span>
              <div className="flex space-x-2">
                {["visa", "mastercard", "paypal"].map((method) => (
                  <div
                    key={method}
                    className="h-4 w-6 bg-gray-100 rounded-sm"
                    title={method}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;