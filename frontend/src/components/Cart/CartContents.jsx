import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiMinus, FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import { removeFromCart, updateCartItemQuantity } from "../../redux/slices/cartSlice";
import { formatPrice } from "../../utils/formatPrice";
import { imageUrl } from "../../utils/product";

const CartContents = ({ cart, onNavigate, compact = false }) => {
  const dispatch = useDispatch();

  const changeQuantity = (item, delta) => {
    const quantity = item.quantity + delta;
    if (quantity < 1) return;
    dispatch(
      updateCartItemQuantity({ productId: item.productId, quantity, size: item.size, color: item.color })
    )
      .unwrap()
      .catch((err) => toast.error(err.message));
  };

  const remove = (item) => {
    dispatch(removeFromCart({ productId: item.productId, size: item.size, color: item.color }))
      .unwrap()
      .then(() => toast.success(`${item.name} removed`))
      .catch((err) => toast.error(err.message));
  };

  return (
    <ul className="divide-y divide-stone-200">
      {cart.products.map((item) => (
        <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 py-4 first:pt-0">
          <Link to={`/product/${item.productId}`} onClick={onNavigate} className="flex-shrink-0">
            <img
              src={imageUrl(item.image, 200)}
              alt={item.name}
              className={`${compact ? "h-20 w-16" : "h-28 w-[5.5rem]"} rounded-xl object-cover`}
            />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link to={`/product/${item.productId}`} onClick={onNavigate} className="line-clamp-2 text-sm font-medium hover:underline">
                  {item.name}
                </Link>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {item.color} · Size {item.size}
                </p>
              </div>
              <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
            <div className="mt-auto flex items-center justify-between pt-3">
              <div className="flex items-center rounded-full border border-stone-300">
                <button
                  onClick={() => changeQuantity(item, -1)}
                  disabled={item.quantity <= 1}
                  className="p-2 text-ink-soft hover:text-ink disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="h-3.5 w-3.5" />
                </button>
                <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                <button onClick={() => changeQuantity(item, 1)} className="p-2 text-ink-soft hover:text-ink" aria-label="Increase quantity">
                  <FiPlus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button onClick={() => remove(item)} className="text-xs font-medium text-ink-muted underline-offset-4 hover:text-sale hover:underline">
                Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CartContents;
