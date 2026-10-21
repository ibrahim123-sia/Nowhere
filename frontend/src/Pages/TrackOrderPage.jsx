import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearTrackedOrder, trackOrder } from "../redux/slices/orderSlice";
import { OrderItems, OrderTimeline, OrderTotals, ShippingAddress, StatusBadge } from "../components/Order/OrderParts";
import { formatDate, orderRef } from "../utils/order";
import useSeo from "../hooks/useSeo";

// Order lookup for guests (and anyone on another device): order number + email.
const TrackOrderPage = () => {
  useSeo({ title: "Track your order", noindex: true });
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const { trackedOrder: order, loading, error } = useSelector((state) => state.orders);
  const [form, setForm] = useState({ orderNumber: params.get("number") || "", email: params.get("email") || "" });

  useEffect(() => {
    if (form.orderNumber && form.email) dispatch(trackOrder(form));
    return () => dispatch(clearTrackedOrder());
    // Look up automatically when arriving from a confirmation link.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(trackOrder({ orderNumber: form.orderNumber.trim(), email: form.email.trim() }));
  };

  return (
    <div className="container-page max-w-4xl py-12">
      <p className="eyebrow">Order status</p>
      <h1 className="heading-display mt-2 text-4xl md:text-5xl">Track your order</h1>
      <p className="mt-3 text-ink-soft">Enter your order number (from your confirmation email) and the email you used at checkout.</p>

      <form onSubmit={submit} className="card mt-8 grid gap-4 p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="orderNumber" className="label">Order number</label>
          <input id="orderNumber" className="input uppercase" placeholder="NW-XXXXXXXX" required value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} />
        </div>
        <div>
          <label htmlFor="trackEmail" className="label">Email</label>
          <input id="trackEmail" type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Searching..." : "Track"}</button>
      </form>

      {error && !order && <p className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-800">{error}</p>}

      {order && (
        <div className="mt-10 space-y-6 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Order {orderRef(order)}</h2>
              <p className="text-sm text-ink-muted">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="card p-6 md:p-8">
            <OrderTimeline order={order} />
          </div>
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <div className="card p-6">
              <OrderItems items={order.orderItems} />
            </div>
            <div className="space-y-6">
              <div className="card p-6"><OrderTotals order={order} /></div>
              <div className="card p-6"><ShippingAddress address={order.shippingAddress} /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
