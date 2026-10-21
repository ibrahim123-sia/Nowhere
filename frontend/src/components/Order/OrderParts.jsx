import React from "react";
import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { formatPrice } from "../../utils/formatPrice";
import { imageUrl, productPath } from "../../utils/product";
import { estimatedDelivery, formatDate } from "../../utils/order";

const STEPS = ["Processing", "Shipped", "Delivered"];

const STATUS_STYLES = {
  Processing: "bg-amber-100 text-amber-800",
  Shipped: "bg-sky-100 text-sky-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-stone-200 text-ink-soft",
};

export const StatusBadge = ({ status }) => (
  <span className={`badge ${STATUS_STYLES[status] || "bg-stone-100 text-ink-soft"}`}>{status}</span>
);

// Processing -> Shipped -> Delivered progress, with dates from the status history.
export const OrderTimeline = ({ order }) => {
  if (order.status === "Cancelled") {
    return (
      <div className="rounded-2xl bg-stone-100 p-5 text-sm">
        <p className="font-semibold">This order was cancelled</p>
        {order.cancelledAt && <p className="mt-1 text-ink-muted">on {formatDate(order.cancelledAt)}{order.cancelReason ? ` · ${order.cancelReason}` : ""}</p>}
      </div>
    );
  }

  const reached = STEPS.indexOf(order.status);
  const dateFor = (step) => order.statusHistory?.find((e) => e.status === step)?.at || (step === "Processing" ? order.createdAt : null);

  return (
    <ol className="grid grid-cols-3 gap-2">
      {STEPS.map((step, i) => {
        const done = i <= reached;
        const date = dateFor(step);
        return (
          <li key={step} className="relative">
            <div className="flex items-center">
              <span className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${done ? "border-ink bg-ink text-white" : "border-stone-300 bg-white text-stone-300"}`}>
                {done ? <FiCheck className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
              </span>
              {i < STEPS.length - 1 && <span className={`h-0.5 flex-1 ${i < reached ? "bg-ink" : "bg-stone-300"}`} />}
            </div>
            <p className={`mt-2 text-sm font-semibold ${done ? "" : "text-ink-muted"}`}>{step}</p>
            <p className="text-xs text-ink-muted">{done && date ? formatDate(date) : step === "Delivered" ? `Est. ${estimatedDelivery(order).split(" - ")[1]}` : ""}</p>
          </li>
        );
      })}
    </ol>
  );
};

export const OrderItems = ({ items, linkProducts = true }) => (
  <ul className="divide-y divide-stone-200">
    {items.map((item) => (
      <li key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4 py-4">
        <img src={imageUrl(item.image, 160)} alt={item.name} className="h-20 w-16 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          {linkProducts ? (
            <Link to={productPath({ _id: item.productId, name: item.name })} className="text-sm font-medium hover:underline">{item.name}</Link>
          ) : (
            <p className="text-sm font-medium">{item.name}</p>
          )}
          <p className="mt-0.5 text-xs text-ink-muted">
            {item.color} · Size {item.size} · Qty {item.quantity}
          </p>
        </div>
        <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
      </li>
    ))}
  </ul>
);

export const OrderTotals = ({ order }) => {
  const items = order.itemsPrice || order.orderItems.reduce((t, i) => t + i.price * i.quantity, 0);
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd>{formatPrice(items)}</dd></div>
      <div className="flex justify-between"><dt className="text-ink-soft">Shipping</dt><dd>{order.shippingPrice ? formatPrice(order.shippingPrice) : "Free"}</dd></div>
      {order.discount > 0 && (
        <div className="flex justify-between text-success"><dt>Promo {order.couponCode}</dt><dd>-{formatPrice(order.discount)}</dd></div>
      )}
      <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(order.totalPrice)}</dd></div>
      <p className="pt-1 text-xs text-ink-muted">
        {order.paymentMethod === "COD" ? "Cash on delivery" : order.paymentMethod} · {order.isPaid ? "Paid" : "Payment due on delivery"}
      </p>
    </dl>
  );
};

export const ShippingAddress = ({ address, email }) => (
  <div className="text-sm leading-relaxed text-ink-soft">
    {address.fullName && <p className="font-semibold text-ink">{address.fullName}</p>}
    <p>{address.address}</p>
    <p>{address.city}{address.postalCode ? ` ${address.postalCode}` : ""}, {address.country}</p>
    {address.phone && <p>{address.phone}</p>}
    {email && <p>{email}</p>}
  </div>
);
