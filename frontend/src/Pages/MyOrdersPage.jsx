import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // CSS classes - removed the outer wrapper styles since Profile already provides them
  const contentWrapper = "w-full bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100";
  const headingPrimary = "text-2xl font-bold text-indigo-800 mb-8";
  const tableHeader = "bg-indigo-50 text-xs uppercase font-semibold text-indigo-800";
  const tableRow = "border-b border-gray-200 hover:bg-indigo-50 cursor-pointer transition-colors duration-200";
  const statusBadge = "px-3 py-1 rounded-full text-xs font-medium";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg max-w-md mx-auto my-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={contentWrapper}>
      <h1 className={headingPrimary}>My Orders</h1>
      
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full text-left text-gray-700">
          <thead className={tableHeader}>
            <tr>
              <th className="py-4 px-6">Image</th>
              <th className="py-4 px-6">Order ID</th>
              <th className="py-4 px-6">Created</th>
              <th className="py-4 px-6">Shipping Address</th>
              <th className="py-4 px-6">Items</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className={tableRow}
                >
                  <td className="py-4 px-6">
                    <img
                      src={order.orderItems[0]?.image}
                      alt={order.orderItems[0]?.name || "Order item"}
                      className="w-12 h-12 object-cover rounded-md border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="py-4 px-6 font-medium text-indigo-700 whitespace-nowrap">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>
                  <td className="py-4 px-6 text-center text-gray-900 font-medium">
                    {order.orderItems.length}
                  </td>
                  <td className="py-4 px-6 font-semibold text-indigo-700">
                    ${order.totalPrice?.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`${statusBadge} ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 px-6 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <p className="text-lg text-gray-600 mb-2">You have no orders yet</p>
                    <button
                      onClick={() => navigate("/collections/all")}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-6 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg"
                    >
                      Start Shopping
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {orders.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;