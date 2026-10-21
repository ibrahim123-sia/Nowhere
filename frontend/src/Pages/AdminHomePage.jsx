import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../redux/slices/adminOrderSlice";
import SalesChart from "../components/Admin/SalesChart";
import { StatusBadge } from "../components/Order/OrderParts";
import { ErrorState, PageLoader } from "../components/Common/Feedback";
import { formatPrice } from "../utils/formatPrice";
import { formatDate, orderRef } from "../utils/order";
import { imageUrl } from "../utils/product";
import useSeo from "../hooks/useSeo";

const StatTile = ({ label, value, hint, to }) => {
  const body = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-medium">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </>
  );
  return to ? (
    <Link to={to} className="card p-5 transition hover:border-ink">{body}</Link>
  ) : (
    <div className="card p-5">{body}</div>
  );
};

const AdminHomePage = () => {
  useSeo({ title: "Admin dashboard", noindex: true });
  const dispatch = useDispatch();
  const { stats, statsLoading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (statsLoading && !stats) return <PageLoader label="Loading dashboard" />;
  if (error && !stats) return <ErrorState message={error} onRetry={() => dispatch(fetchAdminStats())} />;
  if (!stats) return null;

  const status = stats.ordersByStatus || {};

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="heading-display text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-muted">Revenue excludes cancelled orders.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Revenue" value={formatPrice(stats.revenue)} hint={`${stats.orderCount} ${stats.orderCount === 1 ? "order" : "orders"}`} />
        <StatTile label="Avg. order" value={formatPrice(stats.averageOrderValue)} />
        <StatTile label="To fulfil" value={status.Processing || 0} hint={`${status.Shipped || 0} shipped`} to="/admin/orders?status=Processing" />
        <StatTile label="Products" value={stats.productCount} hint={`${stats.lowStock.length} low on stock`} to="/admin/products" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="card p-6">
          <SalesChart data={stats.salesLast30Days} />
        </div>
        <div className="card p-6">
          <h2 className="font-semibold">Orders by status</h2>
          <ul className="mt-4 space-y-3">
            {["Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
              <li key={s} className="flex items-center justify-between text-sm">
                <StatusBadge status={s} />
                <span className="font-semibold">{status[s] || 0}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6">
            <h2 className="font-semibold">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm link-underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="mt-4 w-full min-w-[520px] text-sm">
              <thead className="border-y border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {stats.recentOrders.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-ink-muted">No orders yet</td></tr>
                )}
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-3">
                      <p className="font-mono text-xs font-semibold">{orderRef(order)}</p>
                      <p className="text-xs text-ink-muted">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-6 py-3">{order.user?.name || order.shippingAddress?.fullName || "Guest"}</td>
                    <td className="px-6 py-3 font-medium">{formatPrice(order.totalPrice)}</td>
                    <td className="px-6 py-3"><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold">Low stock</h2>
          {stats.lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">Everything is well stocked.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.lowStock.map((p) => (
                <li key={p._id}>
                  <Link to={`/admin/product/${p._id}/edit`} className="flex items-center gap-3 rounded-xl p-1 hover:bg-stone-50">
                    <img src={imageUrl(p.images?.[0]?.url, 100)} alt="" className="h-12 w-10 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-ink-muted">{p.sku}</p>
                    </div>
                    <span className={`badge ${p.countInStock === 0 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                      {p.countInStock === 0 ? "Sold out" : `${p.countInStock} left`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
