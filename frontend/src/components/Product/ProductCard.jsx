import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart } from "react-icons/fi";
import { toast } from "sonner";
import Price from "../Common/Price";
import Rating from "../Common/Rating";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import { discountPercent, imageSrcSet, imageUrl, isOnSale, productPath, swatchStyle } from "../../utils/product";

const ProductCard = ({ product, sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw" }) => {
  const dispatch = useDispatch();
  const wishlisted = useSelector((state) =>
    state.wishlist.items.some((item) => item._id === product._id)
  );

  const [primary, secondary] = product.images || [];
  const soldOut = product.countInStock === 0;
  const lowStock = product.countInStock > 0 && product.countInStock <= 5;

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <article className="group relative">
      <Link to={productPath(product)} className="block rounded-2xl focus-visible:ring-offset-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
          {primary?.url ? (
            <>
              <img
                src={imageUrl(primary.url, 600)}
                srcSet={imageSrcSet(primary.url)}
                sizes={sizes}
                alt={primary.altText || product.name}
                loading="lazy"
                className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03] ${secondary ? "group-hover:opacity-0" : ""} ${soldOut ? "opacity-60" : ""}`}
              />
              {secondary?.url && (
                <img
                  src={imageUrl(secondary.url, 600)}
                  srcSet={imageSrcSet(secondary.url)}
                  sizes={sizes}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-muted">No image</div>
          )}

          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {soldOut && <span className="badge bg-ink text-white">Sold out</span>}
            {!soldOut && isOnSale(product) && (
              <span className="badge bg-sale text-white">-{discountPercent(product)}%</span>
            )}
            {lowStock && <span className="badge bg-white/90 text-ink">Only {product.countInStock} left</span>}
          </div>
        </div>

        <div className="mt-3 space-y-1 px-0.5">
          {product.brand && <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{product.brand}</p>}
          <h3 className="line-clamp-1 text-sm font-medium text-ink">{product.name}</h3>
          <Price product={product} size="sm" />
          <div className="flex items-center justify-between pt-0.5">
            {product.numReviews > 0 ? <Rating value={product.rating} count={product.numReviews} size="h-3.5 w-3.5" /> : <span />}
            {product.colors?.length > 0 && (
              <div className="flex items-center gap-1" aria-label={`${product.colors.length} colours`}>
                {product.colors.slice(0, 4).map((color) => (
                  <span key={color} title={color} className="h-3 w-3 rounded-full ring-1 ring-inset ring-black/10" style={swatchStyle(color)} />
                ))}
                {product.colors.length > 4 && <span className="text-[10px] text-ink-muted">+{product.colors.length - 4}</span>}
              </div>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={handleWishlist}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
      >
        <FiHeart className={`h-4 w-4 ${wishlisted ? "fill-sale text-sale" : ""}`} />
      </button>
    </article>
  );
};

export default ProductCard;
