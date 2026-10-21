import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiChevronDown, FiTrash2 } from "react-icons/fi";
import { deleteOrder, fetchAllOrders, updateOrderStatus } from "../../redux/slices/adminOrderSlice";
import { OrderItems, ShippingAddress, StatusBadge } from "../Order/OrderParts";
import ConfirmDialog from "./ConfirmDialog";
import { ErrorState } from "../Common/Feedback";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate, orderRef } from "../../utils/order";
import useSeo from "../../hooks/useSeo";

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];
const NEXT = { Processing: ["Shipped", "Cancelled"], Shipped: ["Delivered"], Delivered: [], Cancelled: [] };

const OrderManagement = () => {
  useSeo({ title: "Orders", noindex: true });
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const statusFilter = params.get("status") || "";
  const { orders, loading, error } = useSelector((state) => state.adminOrders);
  const [expanded, setExpanded] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchAllOrders(statusFilter));
  }, [dispatch, statusFilter]);

  const changeStatus = async (order, status) => {
    try {
      await dispatch(updateOrderStatus({ id: order._id, status })).unwrap();
      toast.success(`${orderRef(order)} marked ${status}`);
      if (statusFilter && statusFilter !== status) dispatch(fetchAllOrders(statusFilter));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await dispatch(deleteOrder(toDelete._id)).unwrap();
      toast.success("Order deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="heading-display text-3xl">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {["", ...STATUSES].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setParams(s ? { status: s } : {})}
            className={`rounded-full border px-4 py-2 text-sm transition ${statusFilter === s ? "border-ink bg-ink text-white" : "border-stone-300 bg-white hover:border-ink"}`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {error && <div className="mt-4"><ErrorState message={error} onRetry={() => dispatch(fetchAllOrders(statusFilter))} /></div>}

      <div className="card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {loading && orders.length === 0 &&
                [0, 1, 2].map((i) => (
                  <tr key={i}><td colSpan={5} className="px-5 py-3"><div className="skeleton h-10" /></td></tr>
                ))}
              {!loading && orders.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-ink-muted">No orders found.</td></tr>
              )}
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-stone-50">
                    <td className="px-5 py-3">
                      <button onClick={() => setExpanded(expanded === order._id ? null : order._id)} className="flex items-center gap-2 text-left">
                        <FiChevronDown className={`transition ${expanded === order._id ? "rotate-180" : ""}`} />
                        <span>
                          <span className="block font-mono text-xs font-semibold">{orderRef(order)}</span>
                          <span className="text-xs text-ink-muted">{formatDate(order.createdAt)} · {order.orderItems.length} item(s)</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium">{order.user?.name || order.shippingAddress?.fullName || "Guest"}</p>
                      <p className="text-xs text-ink-muted">
                        {order.user ? order.user.email : `Guest · ${order.email || "no email"}`}
                        {order.source === "assistant" && " · via Iris"}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium">{formatPrice(order.totalPrice)}</p>
                      <p className="text-xs text-ink-muted">{order.paymentMethod} · {order.isPaid ? "Paid" : "Unpaid"}</p>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {NEXT[order.status].map((status) => (
                          <button
                            key={status}
                            onClick={() => changeStatus(order, status)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status === "Cancelled" ? "border border-stone-300 hover:border-sale hover:text-sale" : "bg-ink text-white hover:bg-ink-soft"}`}
                          >
                            {status === "Cancelled" ? "Cancel" : `Mark ${status.toLowerCase()}`}
                          </button>
                        ))}
                        <button onClick={() => setToDelete(order)} className="btn-ghost px-2 py-1.5 hover:text-sale" aria-label="Delete order">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === order._id && (
                    <tr className="bg-stone-50/60">
                      <td colSpan={5} className="px-5 pb-5">
                        <div className="grid gap-6 rounded-2xl bg-white p-5 md:grid-cols-[1.5fr_1fr]">
                          <OrderItems items={order.orderItems} linkProducts={false} />
                          <div className="space-y-4">
                            <ShippingAddress address={order.shippingAddress} email={order.email} />
                            <ul className="space-y-1 text-xs text-ink-muted">
                              {order.statusHistory?.map((e, i) => (
                                <li key={i}>{e.status} · {formatDate(e.at)}{e.note ? ` · ${e.note}` : ""}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete order?"
        message={`Order ${toDelete ? orderRef(toDelete) : ""} will be removed permanently. Unshipped items go back into stock.`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
        busy={busy}
      />
    </div>
  );
};

export default OrderManagement;
