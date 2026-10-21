import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiLock, FiTag } from "react-icons/fi";
import { fetchQuote, placeOrder } from "../../redux/slices/checkoutSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { formatPrice } from "../../utils/formatPrice";
import { imageUrl } from "../../utils/product";
import { EmptyState } from "../Common/Feedback";
import usePageTitle from "../../hooks/usePageTitle";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Hyderabad", "Sialkot", "Gujranwala"];

const Field = ({ label, id, className = "", ...props }) => (
  <div className={className}>
    <label htmlFor={id} className="label">{label}</label>
    <input id={id} className="input" {...props} />
  </div>
);

const Checkout = () => {
  usePageTitle("Checkout");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { quote, quoteLoading, loading, error } = useSelector((state) => state.checkout);

  const saved = user?.shippingAddress || {};
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({
    fullName: saved.fullName || user?.name || "",
    phone: saved.phone || user?.phone || "",
    address: saved.address || "",
    city: saved.city || "",
    postalCode: saved.postalCode || "",
    country: "Pakistan",
  });
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const items = cart?.products || [];
  const cartKey = items.map((i) => `${i.productId}${i.size}${i.color}${i.quantity}`).join("|");

  useEffect(() => {
    if (items.length) dispatch(fetchQuote({ couponCode: appliedCoupon, email: user ? undefined : email }));
    // Re-price whenever the cart or promo code changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, cartKey, appliedCoupon]);

  const applyCoupon = async (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const result = await dispatch(fetchQuote({ couponCode: code, email: user ? undefined : email })).unwrap().catch(() => null);
    if (result?.couponCode) {
      setAppliedCoupon(code);
      toast.success(`${code} applied`);
    } else {
      toast.error(result?.couponError || "That code didn't work");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const order = await dispatch(
        placeOrder({
          email: user ? undefined : email,
          shippingAddress: address,
          paymentMethod: "COD",
          couponCode: appliedCoupon || undefined,
        })
      ).unwrap();
      dispatch(clearCart());
      navigate("/order-confirmation", { state: { orderId: order._id } });
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Your bag is empty" description="Add a few pieces to your bag, then come back to check out." actionLabel="Start shopping" actionTo="/collections/all" />
      </div>
    );
  }

  const set = (field) => (e) => setAddress({ ...address, [field]: e.target.value });
  const subtotal = quote?.itemsPrice ?? items.reduce((t, i) => t + i.price * i.quantity, 0);

  return (
    <div className="container-page py-10">
      <h1 className="heading-display text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_420px]">
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">1. Contact</h2>
              {!user && (
                <Link to="/login?redirect=/checkout" className="text-sm link-underline">
                  Have an account? Sign in
                </Link>
              )}
            </div>
            {user ? (
              <p className="rounded-2xl bg-cream px-5 py-4 text-sm">
                Signed in as <span className="font-semibold">{user.email}</span>
              </p>
            ) : (
              <>
                <Field label="Email" id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                <p className="mt-2 text-xs text-ink-muted">We'll email your order confirmation and you can track it with this address. No account needed.</p>
              </>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">2. Delivery address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" id="fullName" autoComplete="name" required value={address.fullName} onChange={set("fullName")} />
              <Field label="Phone" id="phone" type="tel" autoComplete="tel" required pattern="\+?[0-9\s-]{10,15}" title="10 to 15 digits, e.g. 03001234567" value={address.phone} onChange={set("phone")} placeholder="03xx xxxxxxx" />
              <Field label="Address" id="address" className="sm:col-span-2" autoComplete="street-address" required value={address.address} onChange={set("address")} placeholder="House, street, area" />
              <Field label="City" id="city" list="pk-cities" autoComplete="address-level2" required value={address.city} onChange={set("city")} />
              <datalist id="pk-cities">
                {CITIES.map((c) => <option key={c} value={c} />)}
              </datalist>
              <Field label="Postal code" id="postalCode" autoComplete="postal-code" required value={address.postalCode} onChange={set("postalCode")} />
              <Field label="Country" id="country" className="sm:col-span-2" value="Pakistan" disabled />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">3. Payment</h2>
            <label className="flex items-start gap-4 rounded-2xl border-2 border-ink bg-white p-5">
              <input type="radio" checked readOnly className="mt-1 h-4 w-4 accent-ink" />
              <span>
                <span className="block text-sm font-semibold">Cash on delivery</span>
                <span className="mt-1 block text-xs text-ink-muted">Pay the courier in cash when your order arrives.</span>
              </span>
            </label>
          </section>

          {error && <p className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-800">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base lg:hidden">
            {loading ? "Placing order..." : `Place order · ${formatPrice(quote?.totalPrice ?? subtotal)}`}
          </button>
        </form>

        <aside className="h-fit space-y-6 rounded-3xl bg-cream p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="max-h-72 space-y-4 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <img src={imageUrl(item.image, 160)} alt={item.name} className="h-20 w-16 rounded-xl object-cover" />
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-ink-muted">{item.color} · {item.size}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <form onSubmit={applyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <FiTag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Promo code" className="input pl-10 uppercase" aria-label="Promo code" />
            </div>
            <button type="submit" className="btn-outline px-5" disabled={quoteLoading}>Apply</button>
          </form>

          <dl className="space-y-2 border-t border-stone-300/70 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd>{quote ? (quote.shippingPrice ? formatPrice(quote.shippingPrice) : "Free") : "..."}</dd>
            </div>
            {quote?.discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>
                  Promo {quote.couponCode}{" "}
                  <button type="button" onClick={() => { setAppliedCoupon(""); setCouponInput(""); }} className="ml-1 text-xs text-ink-muted underline">
                    remove
                  </button>
                </dt>
                <dd>-{formatPrice(quote.discount)}</dd>
              </div>
            )}
            {quote?.freeShippingRemaining > 0 && (
              <p className="text-xs text-ink-muted">Add {formatPrice(quote.freeShippingRemaining)} more for free delivery.</p>
            )}
            <div className="flex justify-between border-t border-stone-300/70 pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(quote?.totalPrice ?? subtotal)}</dd>
            </div>
          </dl>

          <button type="submit" form="checkout-form" disabled={loading} className="btn-primary hidden w-full py-4 text-base lg:flex">
            {loading ? "Placing order..." : "Place order"}
          </button>
          <p className="flex items-center justify-center gap-2 text-xs text-ink-muted">
            <FiLock className="h-3.5 w-3.5" /> Prices are confirmed securely on our server
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
