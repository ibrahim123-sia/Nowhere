import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import CartContents from "../Cart/CartContents";
import { closeCartDrawer } from "../../redux/slices/cartSlice";
import { openAgent } from "../../redux/slices/agentSlice";
import { formatPrice } from "../../utils/formatPrice";

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, drawerOpen } = useSelector((state) => state.cart);
  const { shipping } = useSelector((state) => state.store.config);

  const close = () => dispatch(closeCartDrawer());

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  const products = cart?.products || [];
  const subtotal = products.reduce((total, item) => total + item.price * item.quantity, 0);
  const remaining = Math.max(shipping.freeShippingThreshold - subtotal, 0);
  const progress = Math.min((subtotal / shipping.freeShippingThreshold) * 100, 100);

  const handleCheckout = () => {
    close();
    navigate("/checkout");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={close}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-lift transition-transform duration-300 ease-out sm:w-[420px] ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <h2 className="heading-display text-2xl">
            Your bag {products.length > 0 && <span className="font-sans text-sm text-ink-muted">({cart.itemCount || products.length})</span>}
          </h2>
          <button onClick={close} className="rounded-full p-1.5 text-ink-muted hover:bg-stone-100 hover:text-ink" aria-label="Close cart">
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        {products.length > 0 && (
          <div className="border-b border-stone-200 px-6 py-4">
            <p className="text-xs text-ink-soft">
              {remaining > 0 ? (
                <>
                  You're <span className="font-semibold text-ink">{formatPrice(remaining)}</span> away from free delivery
                </>
              ) : (
                <span className="font-semibold text-success">You've unlocked free delivery</span>
              )}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-200">
              <div className="h-full rounded-full bg-ink transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {products.length > 0 ? (
            <CartContents cart={cart} onNavigate={close} compact />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <HiOutlineShoppingBag className="mb-4 h-12 w-12 text-stone-300" />
              <p className="heading-display text-xl">Your bag is empty</p>
              <p className="mt-1 max-w-xs text-sm text-ink-muted">Find something you love, or ask Nora to pick a few options for you.</p>
              <div className="mt-6 flex flex-col gap-2">
                <button onClick={() => { close(); navigate("/collections/all"); }} className="btn-primary">
                  Start shopping
                </button>
                <button onClick={() => { close(); dispatch(openAgent()); }} className="btn-ghost">
                  Ask Nora for ideas
                </button>
              </div>
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="border-t border-stone-200 bg-white px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-ink-soft">Subtotal</span>
              <span className="text-lg font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full py-3.5">
              Checkout
            </button>
            <p className="mt-3 text-center text-xs text-ink-muted">
              Cash on delivery · Shipping and promo codes at checkout
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
