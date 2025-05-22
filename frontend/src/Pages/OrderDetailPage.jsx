import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [OrderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    const mockOrderDetail = {
      _id: id,
      createdAt: new Date(),
      isPaid: true,
      isDelivered: false,
      paymentMethod: "paypal",
      shippingMethod: "standard",
      shippingAddress: { city: "karachi", country: "pakistan" },
      orderItems: [
        {
          productId: 1,
          name: "jacket",
          price: 120,
          quanitity: 1,
          image: "https://picsum.photos/150?random=1",
        },
        {
          productId: 2,
          name: "pent",
          price: 150,
          quanitity: 3,
          image: "https://picsum.photos/150?random=2",
        },
      ],
    };
    setOrderDetail(mockOrderDetail);
  }, [id]);
  return (
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
                }
                px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {OrderDetail.isPaid ? "Approved" : "Pending"}
              </span>

              <span
                className={`${
                  OrderDetail.isDelivered
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }
                px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {OrderDetail.isDelivered ? "Delivered" : "Pending Delivery"}
              </span>
            </div>
          </div>
          {/* payment shipping information */}
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
