import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [dispatch, checkout, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // After 10 days
    return orderDate.toLocaleDateString();
  };

  // CSS classes based on your reference files
  const pageWrapper = "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8";
  const contentWrapper = "w-full max-w-4xl bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100 mx-auto";
  const headingPrimary = "text-4xl font-bold text-center text-indigo-800 mb-8";
  const headingSecondary = "text-xl font-semibold text-gray-800 mb-4";
  const textMuted = "text-gray-600 text-sm";
  const successText = "text-indigo-600 text-sm font-medium";

  return (
    <div className={pageWrapper}>
      <div className={contentWrapper}>
        <h1 className={headingPrimary}>
          Thank You For Your Order!
        </h1>

        {checkout && (
          <div className="space-y-8">
            {/* Order Info & Estimated Delivery */}
            <div className="flex justify-between items-start flex-wrap gap-6 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
              <div>
                <h2 className="text-lg font-semibold text-indigo-800">Order ID: {checkout._id}</h2>
                <p className={textMuted}>
                  Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={successText}>
                  Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)}
                </p>
              </div>
            </div>

            {/* Ordered Items */}
            <div>
              <h3 className={headingSecondary}>Ordered Items</h3>
              <div className="space-y-4">
                {checkout.checkoutItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                      />
                      <div>
                        <h4 className="text-md font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          {item.color} | {item.size}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-md font-medium text-indigo-700">${item.price}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment */}
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold mb-3 text-indigo-800">Payment</h4>
                <p className={textMuted}>Cash on Delivery</p>
              </div>

              {/* Delivery */}
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold mb-3 text-indigo-800">Delivery Address</h4>
                <p className={textMuted}>
                  {checkout.shippingAddress.address}
                </p>
                <p className={textMuted}>
                  {checkout.shippingAddress.city},{" "}
                  {checkout.shippingAddress.country}
                </p>
                {checkout.shippingAddress.postalCode && (
                  <p className={textMuted}>
                    Postal Code: {checkout.shippingAddress.postalCode}
                  </p>
                )}
              </div>
            </div>

            {/* Total Amount */}
            <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-indigo-800">Total Amount</h4>
                <p className="text-xl font-bold text-indigo-700">
                  ${checkout.totalPrice}
                </p>
              </div>
            </div>

            {/* Continue Shopping Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => navigate("/collections/all")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-8 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;