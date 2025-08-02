import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <>Error: {error}</>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
        {!OrderDetail ? (
          <p>No Order Detail Found</p>
        ) : (
          // order information
          <div className="p-4 sm:p-6 rounded-lg border">
            <div className="flex flex-col sm:flex-row justify-between mb-8">
              <div>
                <h3 className="text-lg md:text-xl font-semibold">
                  Order ID: #{OrderDetail._id}
                </h3>
                <p className="text-gray-600">
                  {new Date(OrderDetail.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                <span
                  className={`${
                    OrderDetail.isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  } px-3 py-1 rounded-full text-sm font-medium mb-2`}
                >
                  {OrderDetail.isPaid ? "Approved" : "Pending"}
                </span>

                <span
                  className={`${
                    OrderDetail.isDelivered
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  } px-3 py-1 rounded-full text-sm font-medium mb-2`}
                >
                  {OrderDetail.isDelivered ? "Delivered" : "Pending Delivery"}
                </span>
              </div>
            </div>
            {/*customer, payment, shipping information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
              <div className="">
                <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
                <p>Payment Method: {OrderDetail.paymentMethod}</p>
                <p>Status: {OrderDetail.isPaid ? "Paid" : "Unpaid"}</p>
              </div>
              <div className="">
                <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
                <p>Shipping Method: {OrderDetail.shippingMethod}</p>
                <p>
                  Address:{" "}
                  {`${OrderDetail.shippingAddress.city}, ${OrderDetail.shippingAddress.country}`}
                </p>
              </div>
            </div>
            {/* product list */}
            <div className="overflow-x-auto">
              <h4 className="text-lg font-semibold mb-4">Products</h4>
              <table className=" min-w-full text-gray-600 mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Unit Price</th>
                    <th className="py-2 px-4">Quantity</th>
                    <th className="py-2 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {OrderDetail.orderItems.map((item) => (
                    <tr key={item.productId} className="border-b">
                      <td className="py-2 px-4 flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-blue-500 hover:underline"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-2 px-4">${item.price}</td>
                      <td className="py-2 px-4">{item.quanitity}</td>
                      <td className="py-2 px-4">
                        ${item.price * item.quanitity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* back to order */}
            <Link to="/my-orders" className="text-blue-500 hover:underline">
              Back To My Order
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderDetailPage;
