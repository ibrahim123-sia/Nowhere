import React from "react";
import { useSelector } from "react-redux";
import { formatPrice } from "../../utils/formatPrice";

const Topbar = () => {
  const { shipping } = useSelector((state) => state.store.config);

  return (
    <div className="bg-ink text-white">
      <div className="container-page flex items-center justify-center gap-6 py-2 text-[11px] font-medium tracking-wide sm:text-xs">
        <span>Free delivery over {formatPrice(shipping.freeShippingThreshold)}</span>
        <span className="hidden text-white/40 sm:inline">|</span>
        <span className="hidden sm:inline">Cash on delivery across Pakistan</span>
        <span className="hidden text-white/40 md:inline">|</span>
        <span className="hidden md:inline">30-day easy returns</span>
      </div>
    </div>
  );
};

export default Topbar;
