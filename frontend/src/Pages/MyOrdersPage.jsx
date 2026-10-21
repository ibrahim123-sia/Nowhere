import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { StatusBadge } from "../components/Order/OrderParts";
import { EmptyState, ErrorState } from "../components/Common/Feedback";
import { formatPrice } from "../utils/formatPrice";
import { formatDate, orderRef } from "../utils/order";
import { imageUrl } from "../utils/product";
import useSeo from "../hooks/useSeo";

// Order history list. Rendered on its own page and inside the profile.
export const OrdersList = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => <div key={i} className="skeleton h-28" />)}
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchUserOrders())} />;
  if (orders.length === 0) {
    return <EmptyState title="No orders yet" description="When you place an order it will show up here." actionLabel="Start shopping" actionTo="/collections/all" />;
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order._id}>
          <Link to={`/order/${order._id}`} className="card flex flex-wrap items-center gap-4 p-4 transition hover:border-ink sm:flex-nowrap">
            <div className="flex -space-x-3">
              {order.orderItems.slice(0, 3).map((item, i) => (
                <img key={i} src={imageUrl(item.image, 120)} alt="" className="h-16 w-12 rounded-lg border-2 border-white object-cover" />
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm font-semibold">{orderRef(order)}</p>
              <p className="text-xs text-ink-muted">
                {formatDate(order.createdAt)} · {order.orderItems.reduce((n, i) => n + i.quantity, 0)} item(s) · {order.shippingAddress?.city}
              </p>
            </div>
            <StatusBadge status={order.status} />
            <p className="w-24 text-right text-sm font-semibold">{formatPrice(order.totalPrice)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const MyOrdersPage = () => {
  useSeo({ title: "My orders", noindex: true });
  return (
    <div className="container-page max-w-4xl py-10">
      <h1 className="heading-display mb-8 text-4xl">My orders</h1>
      <OrdersList />
    </div>
  );
};

export default MyOrdersPage;
