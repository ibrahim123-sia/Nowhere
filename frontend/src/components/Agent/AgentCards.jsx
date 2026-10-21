import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiCheckCircle, FiPackage } from "react-icons/fi";
import { respondToAction } from "../../redux/slices/agentSlice";
import { formatPrice } from "../../utils/formatPrice";
import { imageUrl } from "../../utils/product";
import { Spinner } from "../Common/Feedback";

export const ProductCardsRow = ({ cards, onNavigate }) => (
  <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 scrollbar-hide">
    {cards.map((card) => (
      <Link
        key={card.id}
        to={card.url}
        onClick={onNavigate}
        className="group w-36 flex-shrink-0 snap-start overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:border-ink"
      >
        <div className="relative aspect-[4/5] bg-stone-100">
          {card.image && <img src={imageUrl(card.image, 300)} alt={card.name} loading="lazy" className="h-full w-full object-cover" />}
          {!card.inStock && <span className="badge absolute left-2 top-2 bg-ink text-white">Sold out</span>}
          {card.inStock && card.onlyLeft && <span className="badge absolute left-2 top-2 bg-white/90 text-ink">{card.onlyLeft} left</span>}
        </div>
        <div className="space-y-0.5 p-2.5">
          <p className="line-clamp-2 text-xs font-medium leading-snug">{card.name}</p>
          <p className="text-xs">
            <span className={`font-semibold ${card.originalPrice ? "text-sale" : ""}`}>{formatPrice(card.price)}</span>
            {card.originalPrice && <span className="ml-1 text-[10px] text-ink-muted line-through">{formatPrice(card.originalPrice)}</span>}
          </p>
          {card.reviews > 0 && <p className="text-[10px] text-ink-muted">★ {Number(card.rating).toFixed(1)} ({card.reviews})</p>}
        </div>
      </Link>
    ))}
  </div>
);

const Row = ({ label, value, strong }) => (
  <div className={`flex justify-between ${strong ? "pt-2 text-sm font-semibold text-ink" : "text-xs text-ink-soft"}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

// Order summary / cancellation request with Confirm and Cancel buttons. The
// buttons only show on the confirmation that is still waiting.
export const ConfirmCard = ({ card, isLatest }) => {
  const dispatch = useDispatch();
  const { pendingAction, actionLoading, streaming } = useSelector((state) => state.agent);
  const active = isLatest && Boolean(pendingAction);
  const { summary } = card;

  if (card.kind === "cancel") {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-4">
        <p className="text-sm font-semibold">Cancel order {summary.orderNumber}?</p>
        <p className="mt-1 text-xs text-ink-muted">
          {summary.items} item(s) · {formatPrice(summary.totalPrice)}. Items go back into stock.
        </p>
        <Actions active={active} loading={actionLoading} disabled={streaming} confirmLabel="Yes, cancel order" dispatch={dispatch} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="flex items-center gap-2 border-b border-stone-200 bg-cream px-4 py-2.5">
        <FiPackage className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-wider">Order summary</p>
      </div>
      <div className="space-y-3 p-4">
        <ul className="space-y-2.5">
          {summary.items.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              {item.image && <img src={imageUrl(item.image, 120)} alt="" className="h-12 w-10 rounded-lg object-cover" />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{item.name}</p>
                <p className="text-[11px] text-ink-muted">
                  {item.color} · {item.size} · Qty {item.quantity}
                </p>
              </div>
              <span className="text-xs font-semibold">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-stone-200 pt-3">
          <Row label="Subtotal" value={formatPrice(summary.itemsPrice)} />
          <Row label="Shipping" value={summary.shippingPrice ? formatPrice(summary.shippingPrice) : "Free"} />
          {summary.discount > 0 && <Row label={`Promo ${summary.couponCode}`} value={`-${formatPrice(summary.discount)}`} />}
          <Row label="Total (Cash on Delivery)" value={formatPrice(summary.totalPrice)} strong />
        </div>
        <div className="rounded-xl bg-stone-50 p-3 text-[11px] leading-relaxed text-ink-soft">
          <p className="font-semibold text-ink">{summary.shippingAddress.fullName}</p>
          <p>
            {summary.shippingAddress.address}, {summary.shippingAddress.city} {summary.shippingAddress.postalCode}
          </p>
          <p>
            {summary.shippingAddress.phone} · {summary.email}
          </p>
        </div>
        <Actions active={active} loading={actionLoading} disabled={streaming} confirmLabel="Confirm order" dispatch={dispatch} />
      </div>
    </div>
  );
};

const Actions = ({ active, loading, disabled, confirmLabel, dispatch }) =>
  active ? (
    <div className="mt-3 flex gap-2">
      <button onClick={() => dispatch(respondToAction("confirm"))} disabled={loading || disabled} className="btn-primary flex-1 px-4 py-2.5 text-xs">
        {loading ? <Spinner className="h-4 w-4" /> : confirmLabel}
      </button>
      <button onClick={() => dispatch(respondToAction("cancel"))} disabled={loading || disabled} className="btn-outline px-4 py-2.5 text-xs">
        Not now
      </button>
    </div>
  ) : (
    <p className="mt-3 text-[11px] text-ink-muted">This request is no longer waiting for confirmation.</p>
  );

export const OrderPlacedCard = ({ card, onNavigate }) => {
  const trackLink = `/track-order?number=${encodeURIComponent(card.orderNumber)}&email=${encodeURIComponent(card.email || "")}`;
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-2 text-success">
        <FiCheckCircle className="h-5 w-5" />
        <p className="text-sm font-semibold">Order placed</p>
      </div>
      <p className="mt-1 text-xs text-ink-soft">
        <span className="font-mono font-semibold text-ink">{card.orderNumber}</span> · {formatPrice(card.totalPrice)} · Cash on Delivery
      </p>
      <Link to={card.isGuest ? trackLink : `/order/${card.orderId}`} onClick={onNavigate} className="btn-outline mt-3 w-full py-2 text-xs">
        {card.isGuest ? "Track this order" : "View order"}
      </Link>
    </div>
  );
};
