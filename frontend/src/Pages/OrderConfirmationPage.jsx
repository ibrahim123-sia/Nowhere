import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiCheckCircle } from "react-icons/fi";
import { OrderItems, OrderTimeline, OrderTotals, ShippingAddress } from "../components/Order/OrderParts";
import { estimatedDelivery, orderRef } from "../utils/order";
import useSeo from "../hooks/useSeo";

const OrderConfirmationPage = () => {
  useSeo({ title: "Order confirmed", noindex: true });
  const order = useSelector((state) => state.checkout.lastOrder);
  const { user } = useSelector((state) => state.auth);
  const { shipping } = useSelector((state) => state.store.config);

  if (!order) return <Navigate to={user ? "/my-orders" : "/"} replace />;

  const trackLink = `/track-order?number=${encodeURIComponent(order.orderNumber || "")}&email=${encodeURIComponent(order.email || "")}`;

  return (
    <div className="container-page max-w-4xl py-12">
      <div className="text-center">
        <FiCheckCircle className="mx-auto h-14 w-14 text-success" />
        <h1 className="heading-display mt-5 text-4xl md:text-5xl">Thank you for your order!</h1>
        <p className="mt-3 text-ink-soft">
          Order <span className="font-mono font-semibold text-ink">{orderRef(order)}</span> is confirmed.
          {order.email && <> A confirmation has been sent to <span className="font-semibold text-ink">{order.email}</span>.</>}
        </p>
        <p className="mt-2 text-sm text-ink-muted">Estimated delivery: {estimatedDelivery(order, shipping.estimatedDays)}</p>
      </div>

      <div className="card mt-10 p-6 md:p-8">
        <OrderTimeline order={order} />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <h2 className="mb-2 font-semibold">Items</h2>
          <OrderItems items={order.orderItems} />
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 font-semibold">Payment</h2>
            <OrderTotals order={order} />
          </div>
          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Delivering to</h2>
            <ShippingAddress address={order.shippingAddress} />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {user ? (
          <Link to={`/order/${order._id}`} className="btn-primary">View order</Link>
        ) : (
          <Link to={trackLink} className="btn-primary">Track this order</Link>
        )}
        <Link to="/collections/all" className="btn-outline">Continue shopping</Link>
      </div>
      {!user && (
        <p className="mt-6 text-center text-sm text-ink-muted">
          Want faster checkout next time? <Link to="/register" className="link-underline text-ink">Create an account</Link>
        </p>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
