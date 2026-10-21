import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../../utils/api";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "./ProductGrid";

// Horizontal product carousel fed by any product list endpoint.
const ProductCarousel = ({ eyebrow, title, endpoint, viewAllTo }) => {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  useEffect(() => {
    let active = true;
    api
      .get(endpoint)
      .then(({ data }) => active && setProducts(Array.isArray(data) ? data : data.products || []))
      .catch(() => active && setProducts([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [endpoint]);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScroll({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  };

  useEffect(updateButtons, [products]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (!loading && products.length === 0) return null;

  const arrow = "flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 transition hover:border-ink disabled:opacity-30";

  return (
    <section className="container-page mt-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="heading-display mt-2 text-3xl md:text-4xl">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {viewAllTo && (
            <Link to={viewAllTo} className="mr-2 hidden text-sm font-semibold link-underline sm:inline">
              View all
            </Link>
          )}
          <button onClick={() => scroll(-1)} disabled={!canScroll.left} className={arrow} aria-label="Scroll left">
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => scroll(1)} disabled={!canScroll.right} className={arrow} aria-label="Scroll right">
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} onScroll={updateButtons} className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide md:gap-6">
        {(loading ? Array.from({ length: 4 }) : products).map((product, i) => (
          <div key={product?._id || i} className="w-[68%] flex-shrink-0 snap-start sm:w-[40%] lg:w-[23%]">
            {loading ? <ProductCardSkeleton /> : <ProductCard product={product} sizes="(min-width: 1024px) 23vw, 60vw" />}
          </div>
        ))}
      </div>
    </section>
  );
};

const NewArrivals = () => (
  <ProductCarousel eyebrow="Just landed" title="New arrivals" endpoint="/products/new-arrivals?limit=10" viewAllTo="/collections/new-arrivals" />
);

export { ProductCarousel };
export default NewArrivals;
