import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiMinus, FiPlus, FiHeart, FiShare2, FiTruck, FiRefreshCw, FiCreditCard, FiChevronDown } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import ProductGrid from "./ProductGrid";
import ProductReviews from "./ProductReviews";
import SizeGuideModal from "./SizeGuideModal";
import Price from "../Common/Price";
import Rating from "../Common/Rating";
import { PageLoader, EmptyState } from "../Common/Feedback";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productSlice";
import { addToCart, openCartDrawer } from "../../redux/slices/cartSlice";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import { openAgent, sendAgentMessage } from "../../redux/slices/agentSlice";
import { formatPrice } from "../../utils/formatPrice";
import { imageSrcSet, imageUrl, isLightColor, swatchStyle } from "../../utils/product";
import { addRecentlyViewed, getRecentlyViewed } from "../../utils/recentlyViewed";
import usePageTitle from "../../hooks/usePageTitle";

const Accordion = ({ title, children, defaultOpen = false }) => (
  <details className="group border-b border-stone-200 py-4" open={defaultOpen}>
    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
      {title}
      <FiChevronDown className="h-4 w-4 transition group-open:rotate-180" />
    </summary>
    <div className="pt-3 text-sm leading-relaxed text-ink-soft">{children}</div>
  </details>
);

const deliveryWindow = (days) => {
  const fmt = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const from = new Date();
  const to = new Date();
  from.setDate(from.getDate() + days.min);
  to.setDate(to.getDate() + days.max);
  return `${fmt(from)} - ${fmt(to)}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, detailLoading, detailError, similarProducts, similarLoading } = useSelector(
    (state) => state.products
  );
  const { shipping } = useSelector((state) => state.store.config);
  const { streaming } = useSelector((state) => state.agent);
  const wishlisted = useSelector((state) => state.wishlist.items.some((item) => item._id === id));

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const current = product?._id === id ? product : null;
  usePageTitle(current?.name);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    dispatch(fetchSimilarProducts({ id }));
    setActiveImage(0);
    setSelectedSize("");
    setQuantity(1);
    setSizeError(false);
  }, [dispatch, id]);

  useEffect(() => {
    if (!current) return;
    setSelectedColor(current.colors?.[0] || "");
    addRecentlyViewed(current);
  }, [current]);

  const recentlyViewed = useMemo(
    () => (current ? getRecentlyViewed().filter((p) => p._id !== current._id).slice(0, 4) : []),
    [current]
  );

  if (detailLoading && !current) return <PageLoader label="Loading product" />;

  if (detailError && !current) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Product not found" description="It may have sold out or been removed." actionLabel="Keep shopping" actionTo="/collections/all" />
      </div>
    );
  }

  if (!current) return null;

  const images = current.images?.length ? current.images : [{ url: "", altText: current.name }];
  const soldOut = current.countInStock === 0;
  const maxQty = Math.min(current.countInStock, 10);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      toast.error("Please select a size");
      return;
    }
    setAdding(true);
    dispatch(addToCart({ productId: current._id, quantity, size: selectedSize, color: selectedColor }))
      .unwrap()
      .then(() => {
        toast.success(`${current.name} added to your bag`);
        dispatch(openCartDrawer());
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setAdding(false));
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: current.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  const askIris = () => {
    dispatch(openAgent());
    if (!streaming) {
      dispatch(sendAgentMessage(`Tell me about the ${current.name}. How does it fit and what should I pair it with?`));
    }
  };

  const genderPath = current.gender ? `/collections/all?gender=${current.gender}` : "/collections/all";
  const categoryPath = `/collections/all?${new URLSearchParams({ ...(current.gender && { gender: current.gender }), category: current.category })}`;

  return (
    <div className="container-page py-6 md:py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link to={genderPath} className="hover:text-ink">{current.gender || "Shop"}</Link>
        <span>/</span>
        <Link to={categoryPath} className="hover:text-ink">{current.category}</Link>
        <span>/</span>
        <span className="text-ink">{current.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-hide md:hidden">
            {images.map((image, index) => (
              <img
                key={index}
                src={imageUrl(image.url, 800)}
                alt={image.altText || current.name}
                className="aspect-[4/5] w-[85%] flex-shrink-0 snap-center rounded-2xl object-cover"
              />
            ))}
          </div>
          <div className="hidden gap-4 md:grid md:grid-cols-[72px_1fr]">
            <div className="flex flex-col gap-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-xl border-2 transition ${activeImage === index ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
                  aria-label={`Show image ${index + 1}`}
                >
                  <img src={imageUrl(image.url, 160)} alt="" className="aspect-[4/5] w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-stone-100">
              <img
                src={imageUrl(images[activeImage]?.url, 1000)}
                srcSet={imageSrcSet(images[activeImage]?.url, [700, 1000, 1400])}
                sizes="(min-width: 1024px) 50vw, 90vw"
                alt={images[activeImage]?.altText || current.name}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Product info */}
        <div>
          {current.brand && <p className="eyebrow">{current.brand}</p>}
          <h1 className="heading-display mt-2 text-3xl md:text-4xl">{current.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Price product={current} size="lg" showBadge />
            {current.numReviews > 0 && (
              <a href="#reviews" className="flex items-center gap-2 text-sm hover:underline">
                <Rating value={current.rating} />
                <span className="text-ink-muted">{current.rating.toFixed(1)} · {current.numReviews} reviews</span>
              </a>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-ink-soft">{current.description}</p>

          {/* Colour */}
          <div className="mt-8">
            <p className="text-sm">
              <span className="font-semibold">Colour:</span> <span className="text-ink-soft">{selectedColor}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {current.colors?.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                  aria-label={color}
                  aria-pressed={selectedColor === color}
                  className={`relative h-9 w-9 rounded-full ring-1 ring-inset ring-black/10 transition ${
                    selectedColor === color ? "ring-2 ring-ink ring-offset-2" : "hover:scale-105"
                  }`}
                  style={swatchStyle(color)}
                >
                  {selectedColor === color && (
                    <span className={`absolute inset-0 m-auto h-1.5 w-1.5 rounded-full ${isLightColor(color) ? "bg-ink" : "bg-white"}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className={`text-sm ${sizeError ? "text-sale" : ""}`}>
                <span className="font-semibold">Size:</span>{" "}
                <span className={sizeError ? "" : "text-ink-soft"}>{selectedSize || (sizeError ? "Please choose a size" : "Select a size")}</span>
              </p>
              <button onClick={() => setGuideOpen(true)} className="text-xs font-semibold link-underline">
                Size guide
              </button>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
              {current.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  disabled={soldOut}
                  aria-pressed={selectedSize === size}
                  className={`rounded-xl border py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    selectedSize === size
                      ? "border-ink bg-ink text-white"
                      : sizeError
                        ? "border-sale/50 hover:border-ink"
                        : "border-stone-300 hover:border-ink"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {current.fit && (
              <p className="mt-3 text-xs text-ink-muted">
                {current.fit}.{" "}
                {current.numReviews > 0 && (
                  <a href="#reviews" className="link-underline">See fit notes from customers</a>
                )}
              </p>
            )}
          </div>

          {/* Stock */}
          <p className="mt-6 flex items-center gap-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${soldOut ? "bg-stone-400" : current.countInStock <= 5 ? "bg-amber-500" : "bg-success"}`} />
            {soldOut ? "Sold out" : current.countInStock <= 5 ? `Only ${current.countInStock} left, order soon` : "In stock, ready to ship"}
          </p>

          {/* Quantity + actions */}
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center rounded-full border border-stone-300">
              <button onClick={() => setQuantity((q) => Math.max(q - 1, 1))} disabled={quantity <= 1 || soldOut} className="p-3.5 disabled:opacity-30" aria-label="Decrease quantity">
                <FiMinus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(q + 1, maxQty))} disabled={quantity >= maxQty || soldOut} className="p-3.5 disabled:opacity-30" aria-label="Increase quantity">
                <FiPlus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={handleAddToCart} disabled={adding || soldOut} className="btn-primary min-w-[200px] flex-1 py-3.5">
              {soldOut ? "Sold out" : adding ? "Adding..." : "Add to bag"}
            </button>
            <button
              onClick={() => {
                dispatch(toggleWishlist(current));
                toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
              }}
              className="btn-outline px-4"
              aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={wishlisted}
            >
              <FiHeart className={`h-5 w-5 ${wishlisted ? "fill-sale text-sale" : ""}`} />
            </button>
            <button onClick={handleShare} className="btn-outline px-4" aria-label="Share product">
              <FiShare2 className="h-5 w-5" />
            </button>
          </div>

          <button onClick={askIris} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-stone-300 py-3 text-sm font-medium text-ink-soft transition hover:border-ink hover:text-ink">
            <HiSparkles className="h-4 w-4" /> Ask Iris about fit and styling
          </button>

          {/* Delivery promises */}
          <div className="mt-8 grid gap-4 rounded-2xl bg-cream p-5 sm:grid-cols-3">
            <div className="flex gap-3">
              <FiTruck className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Delivery {deliveryWindow(shipping.estimatedDays)}</p>
                <p className="text-xs text-ink-muted">Free over {formatPrice(shipping.freeShippingThreshold)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <FiCreditCard className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Cash on delivery</p>
                <p className="text-xs text-ink-muted">Pay when it arrives</p>
              </div>
            </div>
            <div className="flex gap-3">
              <FiRefreshCw className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">30-day returns</p>
                <p className="text-xs text-ink-muted">Easy exchanges</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Accordion title="Details" defaultOpen>
              {current.highlights?.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5">
                  {current.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              ) : (
                <p>{current.description}</p>
              )}
            </Accordion>
            <Accordion title="Fit & fabric">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  ["Fit", current.fit],
                  ["Material", current.material],
                  ["Season", current.season],
                  ["Made in", current.origin?.replace("Made in ", "")],
                  ["Occasion", current.occasion?.join(", ")],
                  ["SKU", current.sku],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <React.Fragment key={k}>
                      <dt className="text-ink-muted">{k}</dt>
                      <dd className="text-ink">{v}</dd>
                    </React.Fragment>
                  ))}
              </dl>
            </Accordion>
            {current.careInstructions?.length > 0 && (
              <Accordion title="Care">
                <ul className="list-disc space-y-1 pl-5">
                  {current.careInstructions.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </Accordion>
            )}
            <Accordion title="Shipping & returns">
              <p>
                Delivery in {shipping.estimatedDays.min}-{shipping.estimatedDays.max} working days across Pakistan. Shipping is{" "}
                {formatPrice(shipping.standardFee)}, free on orders over {formatPrice(shipping.freeShippingThreshold)}. Unworn items with
                tags can be returned or exchanged within 30 days.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <ProductReviews product={current} />
      </div>

      <section className="mt-20">
        <h2 className="heading-display mb-8 text-3xl">You may also like</h2>
        <ProductGrid products={similarProducts} loading={similarLoading} skeletons={4} emptyAction={false} />
      </section>

      {recentlyViewed.length > 0 && (
        <section className="mt-20">
          <h2 className="heading-display mb-8 text-3xl">Recently viewed</h2>
          <ProductGrid products={recentlyViewed} />
        </section>
      )}

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} category={current.category} />
    </div>
  );
};

export default ProductDetail;
