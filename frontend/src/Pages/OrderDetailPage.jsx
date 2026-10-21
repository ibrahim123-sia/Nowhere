import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiArrowLeft } from "react-icons/fi";
import { cancelOrder, fetchOrderDetails } from "../redux/slices/orderSlice";
import { openCartDrawer, reorder } from "../redux/slices/cartSlice";
import { OrderItems, OrderTimeline, OrderTotals, ShippingAddress, StatusBadge } from "../components/Order/OrderParts";
import { EmptyState, PageLoader } from "../components/Common/Feedback";
import Modal from "../components/Common/Modal";
import { formatDate, orderRef } from "../utils/order";
import usePageTitle from "../hooks/usePageTitle";

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails: order, loading, error } = useSelector((state) => state.orders);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busy, setBusy] = useState(false);
  usePageTitle(order ? `Order ${orderRef(order)}` : "Order");

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading && !order) return <PageLoader label="Loading order" />;
  if (error || !order) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Order not found" description={error} actionLabel="My orders" actionTo="/my-orders" />
      </div>
    );
  }

  const handleCancel = async () => {
    setBusy(true);
    try {
      await dispatch(cancelOrder({ orderId: order._id })).unwrap();
      toast.success("Your order has been cancelled");
      setConfirmCancel(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleReorder = async () => {
    try {
      const result = await dispatch(reorder(order._id)).unwrap();
      if (result.added.length) {
        toast.success(`${result.added.length} item(s) added to your bag`);
        dispatch(openCartDrawer());
      }
      result.skipped.forEach((s) => toast.error(`${s.name}: ${s.reason}`));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container-page max-w-5xl py-10">
      <Link to="/my-orders" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
        <FiArrowLeft /> All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-display text-3xl md:text-4xl">Order {orderRef(order)}</h1>
          <p className="mt-1 text-sm text-ink-muted">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          {order.status === "Processing" && (
            <button onClick={() => setConfirmCancel(true)} className="btn-outline px-4 py-2 text-xs">Cancel order</button>
          )}
          <button onClick={handleReorder} className="btn-primary px-4 py-2 text-xs">Buy again</button>
        </div>
      </div>

      <div className="card mt-8 p-6 md:p-8">
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
            <h2 className="mb-3 font-semibold">Shipping address</h2>
            <ShippingAddress address={order.shippingAddress} email={order.email} />
          </div>
        </div>
      </div>

      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Cancel this order?">
        <p className="text-sm text-ink-soft">
          Order {orderRef(order)} hasn't shipped yet, so it can still be cancelled. This can't be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={handleCancel} disabled={busy} className="btn-danger flex-1">{busy ? "Cancelling..." : "Yes, cancel order"}</button>
          <button onClick={() => setConfirmCancel(false)} className="btn-outline">Keep order</button>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetailPage;
