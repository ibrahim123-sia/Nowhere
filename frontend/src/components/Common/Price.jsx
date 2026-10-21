import React from "react";
import { formatPrice } from "../../utils/formatPrice";
import { discountPercent, effectivePrice, isOnSale } from "../../utils/product";

// Current price, with the original price struck through when on sale.
const Price = ({ product, size = "base", showBadge = false }) => {
  const sale = isOnSale(product);
  const sizes = {
    sm: "text-sm",
    base: "text-[15px]",
    lg: "text-2xl",
  };
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`font-semibold ${sale ? "text-sale" : "text-ink"} ${sizes[size]}`}>
        {formatPrice(effectivePrice(product))}
      </span>
      {sale && (
        <span className={`text-ink-muted line-through ${size === "lg" ? "text-base" : "text-xs"}`}>
          {formatPrice(product.price)}
        </span>
      )}
      {sale && showBadge && (
        <span className="badge bg-sale/10 text-sale">-{discountPercent(product)}%</span>
      )}
    </div>
  );
};

export default Price;
