import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiCheck, FiCheckCircle, FiChevronLeft, FiChevronRight, FiHeart, FiMinus, FiPackage, FiPlus, FiX } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import CartContents from "../Cart/CartContents";
import { closeAgent, respondToAction, sendAgentMessage } from "../../redux/slices/agentSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import { formatPrice } from "../../utils/formatPrice";
import { imageUrl, isLightColor, swatchStyle } from "../../utils/product";
import { Spinner } from "../Common/Feedback";

const MAX_QTY = 10;

// Closes the chat and opens the checkout page.
const useGoToCheckout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return () => {
    dispatch(closeAgent());
    navigate("/checkout");
  };
};

const addCardToBag = (dispatch, card, line) =>
  dispatch(addToCart({ productId: card.id, ...line }))
    .unwrap()
    .then(() => toast.success(`${card.name} added to your bag`))
    .catch((error) => {
      toast.error(error.message);
      throw error;
    });

// Chat cards carry a trimmed product; this is the shape the wishlist stores.
// Cards saved before `stock` was sent only know "more than 5 left".
const wishlistProduct = (card) => ({
  _id: card.id,
  name: card.name,
  brand: card.brand,
  price: card.originalPrice ?? card.price,
  discountPrice: card.originalPrice ? card.price : undefined,
  images: card.image ? [{ url: card.image, altText: card.name }] : [],
  rating: card.rating,
  numReviews: card.reviews,
  colors: card.colors,
  countInStock: card.stock ?? (card.inStock ? card.onlyLeft || MAX_QTY : 0),
});

const maxQtyOf = (card) => Math.max(1, Math.min(card.stock ?? card.onlyLeft ?? MAX_QTY, MAX_QTY));

const CardPrice = ({ card }) => (
  <p className="text-xs">
    <span className={`font-semibold ${card.originalPrice ? "text-sale" : ""}`}>{formatPrice(card.price)}</span>
    {card.originalPrice && <span className="ml-1 text-[10px] text-ink-muted line-through">{formatPrice(card.originalPrice)}</span>}
  </p>
);

const ScrollButton = ({ side, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute top-[32%] z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white/95 text-ink shadow-soft transition hover:border-ink sm:flex ${
      side === "left" ? "-left-2" : "-right-2"
    }`}
    aria-label={side === "left" ? "Previous products" : "More products"}
  >
    {side === "left" ? <FiChevronLeft className="h-4 w-4" /> : <FiChevronRight className="h-4 w-4" />}
  </button>
);

const Stepper = ({ value, max, onChange }) => (
  <div className="flex items-center rounded-full border border-stone-300">
    <button onClick={() => onChange(value - 1)} disabled={value <= 1} className="p-1.5 text-ink-soft hover:text-ink disabled:opacity-30" aria-label="Decrease quantity">
      <FiMinus className="h-3 w-3" />
    </button>
    <span className="w-6 text-center text-xs font-semibold">{value}</span>
    <button onClick={() => onChange(value + 1)} disabled={value >= max} className="p-1.5 text-ink-soft hover:text-ink disabled:opacity-30" aria-label="Increase quantity">
      <FiPlus className="h-3 w-3" />
    </button>
  </div>
);

// Colour, size and quantity picker that opens under the product row.
const QuickAdd = ({ card, mode, onClose }) => {
  const dispatch = useDispatch();
  const goToCheckout = useGoToCheckout();
  const { streaming, enabled } = useSelector((state) => state.agent);
  const colors = card.colors || [];
  const sizes = card.sizes || [];
  const [color, setColor] = useState(colors[0] || "");
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : "");
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [busy, setBusy] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, []);

  const submit = (action) => {
    if (!size) {
      setSizeError(true);
      return;
    }
    setBusy(action);
    addCardToBag(dispatch, card, { size, color, quantity })
      .then(() => (action === "buy" ? goToCheckout() : onClose()))
      .catch(() => {})
      .finally(() => setBusy(null));
  };

  const askAboutSize = () => {
    dispatch(sendAgentMessage(`Which size should I get in the ${card.name}?`));
    onClose();
  };

  return (
    <div ref={ref} className="animate-fade-up rounded-2xl border border-ink/15 bg-white p-3.5">
      <div className="flex items-start gap-3">
        {card.image && <img src={imageUrl(card.image, 120)} alt="" className="h-14 w-11 flex-shrink-0 rounded-lg object-cover" />}
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-xs font-semibold leading-snug">{card.name}</p>
          <CardPrice card={card} />
        </div>
        <button onClick={onClose} className="rounded-full p-1 text-ink-muted hover:bg-stone-100 hover:text-ink" aria-label="Close size picker">
          <FiX className="h-4 w-4" />
        </button>
      </div>

      {colors.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px]">
            <span className="font-semibold">Colour:</span> <span className="text-ink-soft">{color}</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2 pl-0.5">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={c}
                aria-label={c}
                aria-pressed={color === c}
                className={`relative h-7 w-7 rounded-full ring-1 ring-inset ring-black/10 transition ${color === c ? "ring-2 ring-ink ring-offset-2" : "hover:scale-105"}`}
                style={swatchStyle(c)}
              >
                {color === c && <span className={`absolute inset-0 m-auto h-1.5 w-1.5 rounded-full ${isLightColor(c) ? "bg-ink" : "bg-white"}`} />}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <p className={`text-[11px] ${sizeError ? "text-sale" : ""}`}>
            <span className="font-semibold">Size:</span>{" "}
            <span className={sizeError ? "" : "text-ink-soft"}>{size || (sizeError ? "Please choose a size" : "Select a size")}</span>
          </p>
          {enabled !== false && (
            <button onClick={askAboutSize} disabled={streaming} className="text-[11px] font-medium text-ink-soft link-underline disabled:opacity-40">
              Not sure? Ask Iris
            </button>
          )}
        </div>
        <div className="mt-2 grid grid-cols-6 gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSize(s);
                setSizeError(false);
              }}
              aria-pressed={size === s}
              className={`rounded-lg border py-1.5 text-[11px] font-medium transition ${
                size === s ? "border-ink bg-ink text-white" : sizeError ? "border-sale/50 hover:border-ink" : "border-stone-300 hover:border-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold">Quantity</span>
        <Stepper value={quantity} max={maxQtyOf(card)} onChange={setQuantity} />
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={() => submit("add")} disabled={Boolean(busy)} className={`${mode === "buy" ? "btn-outline" : "btn-primary"} flex-1 px-3 py-2.5 text-xs`}>
          {busy === "add" ? <Spinner className="h-3.5 w-3.5" /> : "Add to bag"}
        </button>
        <button onClick={() => submit("buy")} disabled={Boolean(busy)} className={`${mode === "buy" ? "btn-primary" : "btn-outline"} flex-1 px-3 py-2.5 text-xs`}>
          {busy === "buy" ? <Spinner className="h-3.5 w-3.5" /> : "Buy now"}
        </button>
      </div>
    </div>
  );
};

// Product results with Add to bag / Buy now. Products with a single size and
// colour are added straight away; the rest open the picker first.
export const ProductCardsRow = ({ cards, onNavigate }) => {
  const dispatch = useDispatch();
  const goToCheckout = useGoToCheckout();
  const bag = useSelector((state) => state.cart.cart?.products || []);
  const wishlist = useSelector((state) => state.wishlist.items);
  const [picking, setPicking] = useState(null);
  const [busy, setBusy] = useState(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });
  const scroller = useRef(null);

  const updateEdges = () => {
    const el = scroller.current;
    if (!el) return;
    setEdges({ atStart: el.scrollLeft <= 4, atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [cards.length]);

  const scrollByCard = (direction) => scroller.current?.scrollBy({ left: direction * 172, behavior: "smooth" });

  const act = (card, mode) => {
    const sizes = card.sizes || [];
    const colors = card.colors || [];
    if (sizes.length !== 1 || colors.length > 1) {
      setPicking({ card, mode });
      return;
    }
    setBusy(`${card.id}:${mode}`);
    addCardToBag(dispatch, card, { size: sizes[0], color: colors[0] || "", quantity: 1 })
      .then(() => mode === "buy" && goToCheckout())
      .catch(() => {})
      .finally(() => setBusy(null));
  };

  const toggleSaved = (card, saved) => {
    dispatch(toggleWishlist(wishlistProduct(card)));
    toast.success(saved ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div ref={scroller} onScroll={updateEdges} className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 scrollbar-hide">
          {cards.map((card) => {
            const inBag = bag.filter((item) => item.productId === card.id).reduce((n, item) => n + item.quantity, 0);
            const saved = wishlist.some((item) => item._id === card.id);
            return (
              <article
                key={card.id}
                className={`relative flex w-40 flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-white transition ${
                  picking?.card.id === card.id ? "border-ink" : "border-stone-200 hover:border-stone-400"
                }`}
              >
                <Link to={card.url} onClick={onNavigate} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    {card.image && (
                      <img src={imageUrl(card.image, 300)} alt={card.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    )}
                    {!card.inStock && <span className="badge absolute left-2 top-2 bg-ink text-white">Sold out</span>}
                    {card.inStock && card.onlyLeft && <span className="badge absolute left-2 top-2 bg-white/90 text-ink">{card.onlyLeft} left</span>}
                    {inBag > 0 && (
                      <span className="badge absolute bottom-2 left-2 gap-1 bg-ink text-white">
                        <FiCheck className="h-3 w-3" /> In bag{inBag > 1 ? ` · ${inBag}` : ""}
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5 px-2.5 pt-2.5">
                    <p className="line-clamp-2 text-xs font-medium leading-snug group-hover:underline">{card.name}</p>
                    <CardPrice card={card} />
                    {card.reviews > 0 && <p className="text-[10px] text-ink-muted">★ {Number(card.rating).toFixed(1)} ({card.reviews})</p>}
                  </div>
                </Link>
                <button
                  onClick={() => toggleSaved(card, saved)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink transition hover:bg-white"
                  aria-label={saved ? `Remove ${card.name} from wishlist` : `Save ${card.name} to wishlist`}
                  aria-pressed={saved}
                >
                  <FiHeart className={`h-3.5 w-3.5 ${saved ? "fill-sale text-sale" : ""}`} />
                </button>
                <div className="mt-auto space-y-1.5 p-2.5">
                  {card.inStock ? (
                    <>
                      <button onClick={() => act(card, "add")} disabled={Boolean(busy)} className="btn-primary w-full gap-1.5 px-3 py-2 text-[11px]">
                        {busy === `${card.id}:add` ? (
                          <Spinner className="h-3.5 w-3.5" />
                        ) : (
                          <>
                            <HiOutlineShoppingBag className="h-3.5 w-3.5" /> Add to bag
                          </>
                        )}
                      </button>
                      <button onClick={() => act(card, "buy")} disabled={Boolean(busy)} className="btn-outline w-full px-3 py-2 text-[11px]">
                        {busy === `${card.id}:buy` ? <Spinner className="h-3.5 w-3.5" /> : "Buy now"}
                      </button>
                    </>
                  ) : (
                    <Link to={card.url} onClick={onNavigate} className="btn-outline w-full px-3 py-2 text-[11px]">
                      View details
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {!edges.atStart && <ScrollButton side="left" onClick={() => scrollByCard(-1)} />}
        {!edges.atEnd && <ScrollButton side="right" onClick={() => scrollByCard(1)} />}
      </div>
      {picking && <QuickAdd key={picking.card.id} card={picking.card} mode={picking.mode} onClose={() => setPicking(null)} />}
    </div>
  );
};

// The shopper's bag with quantity, remove and checkout controls. Only the
// latest one in the chat is live; earlier ones show the snapshot they had.
export const CartCard = ({ card, isLatest, onNavigate }) => {
  const dispatch = useDispatch();
  const goToCheckout = useGoToCheckout();
  const { cart } = useSelector((state) => state.cart);
  const { shipping } = useSelector((state) => state.store.config);
  const { streaming, enabled } = useSelector((state) => state.agent);
  const products = cart?.products || [];

  if (!isLatest) {
    return (
      <p className="flex items-center gap-1.5 text-[11px] text-ink-muted">
        <HiOutlineShoppingBag className="h-3.5 w-3.5" />
        Bag at this point: {card.itemCount} item{card.itemCount === 1 ? "" : "s"} · {formatPrice(card.total)}
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center gap-2.5 rounded-2xl border border-dashed border-stone-300 px-4 py-3 text-xs text-ink-muted">
        <HiOutlineShoppingBag className="h-4 w-4" /> Your bag is empty.
      </div>
    );
  }

  const count = products.reduce((n, item) => n + item.quantity, 0);
  const subtotal = products.reduce((total, item) => total + item.price * item.quantity, 0);
  const remaining = Math.max(shipping.freeShippingThreshold - subtotal, 0);
  const progress = Math.min((subtotal / shipping.freeShippingThreshold) * 100, 100);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="flex items-center gap-2 border-b border-stone-200 bg-cream px-4 py-2.5">
        <HiOutlineShoppingBag className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-wider">Your bag</p>
        <span className="ml-auto text-[11px] text-ink-muted">
          {count} item{count === 1 ? "" : "s"}
        </span>
      </div>
      <div className="max-h-72 overflow-y-auto px-4 pt-4">
        <CartContents cart={cart} onNavigate={onNavigate} compact />
      </div>
      <div className="space-y-3 border-t border-stone-200 p-4">
        <div>
          <p className="text-[11px] text-ink-soft">
            {remaining > 0 ? (
              <>
                You're <span className="font-semibold text-ink">{formatPrice(remaining)}</span> away from free delivery
              </>
            ) : (
              <span className="font-semibold text-success">You've unlocked free delivery</span>
            )}
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-stone-200">
            <div className="h-full rounded-full bg-ink transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-soft">Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={goToCheckout} className="btn-primary flex-1 px-4 py-2.5 text-xs">
            Checkout
          </button>
          {enabled !== false && (
            <button
              onClick={() => dispatch(sendAgentMessage("I'd like to place the order here in the chat"))}
              disabled={streaming}
              className="btn-outline px-4 py-2.5 text-xs"
            >
              Order in chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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
