import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiSliders, FiX } from "react-icons/fi";
import FilterSidebar from "../components/Product/FilterSidebar";
import SortOptions from "../components/Product/SortOptions";
import ProductGrid from "../components/Product/ProductGrid";
import { fetchProductsByFilters } from "../redux/slices/productSlice";
import { formatPrice } from "../utils/formatPrice";
import { FILTER_KEYS, productPath } from "../utils/product";
import { absoluteUrl, breadcrumbJsonLd, collectionPath } from "../utils/seo";
import useSeo from "../hooks/useSeo";

const PAGE_SIZE = 24;

const COLLECTION_TITLES = {
  all: "All products",
  "new-arrivals": "New in",
  sale: "Sale",
  featured: "Featured",
};

const titleFor = (collection, params) => {
  const search = params.get("search");
  if (search) return `Results for "${search}"`;
  const base = COLLECTION_TITLES[collection] || collection.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const parts = [params.get("gender"), params.get("category")].filter(Boolean);
  return collection === "all" && parts.length ? parts.join(" · ") : base;
};

// Only gender and category define an indexable landing page; search and
// narrower filters are kept out of the index to avoid near-duplicate pages.
const INDEXABLE_PARAMS = ["gender", "category"];

const seoFor = (collection, params, title, total) => {
  const path = collectionPath(collection, Object.fromEntries(params));
  const filtered = [...params.keys()].some((key) => !INDEXABLE_PARAMS.includes(key) && key !== "sortBy");
  const label = title.replace(" · ", " ").toLowerCase();
  return {
    path,
    noindex: filtered,
    description: `Shop ${label} at Nowhere: ${total ? `${total} styles` : "modern essentials"} for men and women, made in Pakistan. Free delivery over Rs. 5,000, cash on delivery and 30-day returns.`,
  };
};

const chipLabel = (key, value) => {
  if (key === "minPrice") return `From ${formatPrice(value)}`;
  if (key === "maxPrice") return `Up to ${formatPrice(value)}`;
  if (key === "onSale") return "On sale";
  if (key === "inStock") return "In stock";
  return value;
};

const CollectionPage = () => {
  const { collection = "all" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error, total, page, pages } = useSelector((state) => state.products);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const title = titleFor(collection, searchParams);
  const seo = seoFor(collection, searchParams, title, total);
  const origin = window.location.origin;
  useSeo({
    title,
    ...seo,
    jsonLd: [
      breadcrumbJsonLd(origin, [
        { name: "Home", path: "/" },
        { name: title, path: seo.path },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: products.slice(0, 24).map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(origin, productPath(product)),
          name: product.name,
        })),
      },
    ],
  });
  const queryKey = searchParams.toString();

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({ collection, ...Object.fromEntries(searchParams), page: 1, limit: PAGE_SIZE })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, collection, queryKey]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const loadMore = () =>
    dispatch(
      fetchProductsByFilters({ collection, ...Object.fromEntries(searchParams), page: page + 1, limit: PAGE_SIZE })
    );

  const removeFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    const list = (params.get(key) || "").split(",").filter((v) => v && v !== value);
    if (list.length && !["minPrice", "maxPrice", "onSale", "inStock"].includes(key)) params.set(key, list.join(","));
    else params.delete(key);
    setSearchParams(params);
  };

  const chips = [...FILTER_KEYS, "search"].flatMap((key) => {
    const value = searchParams.get(key);
    if (!value) return [];
    if (["size", "color", "material", "brand"].includes(key)) {
      return value.split(",").filter(Boolean).map((v) => ({ key, value: v }));
    }
    return [{ key, value }];
  });

  return (
    <div className="container-page py-8 md:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Shop</p>
          <h1 className="heading-display mt-2 text-4xl md:text-5xl">{title}</h1>
          <p className="mt-2 text-sm text-ink-muted">{loading && products.length === 0 ? "Loading..." : `${total} ${total === 1 ? "product" : "products"}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsSidebarOpen(true)} className="btn-outline px-4 py-2 lg:hidden">
            <FiSliders className="h-4 w-4" /> Filters
          </button>
          <SortOptions />
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {chips.map(({ key, value }) => (
            <button key={`${key}-${value}`} onClick={() => removeFilter(key, value)} className="chip">
              {key === "search" ? `"${value}"` : chipLabel(key, value)} <FiX className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-10">
        <div
          className={`fixed inset-0 z-50 bg-ink/40 transition-opacity lg:hidden ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[88%] max-w-sm transition-transform duration-300 lg:sticky lg:top-24 lg:z-auto lg:h-[calc(100vh-7rem)] lg:w-60 lg:max-w-none lg:flex-shrink-0 lg:translate-x-0 lg:overflow-y-auto lg:pr-2 lg:scrollbar-hide ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Filters"
        >
          <FilterSidebar onClose={isSidebarOpen ? () => setIsSidebarOpen(false) : undefined} />
        </aside>

        <div className="min-w-0 flex-1">
          <ProductGrid products={products} loading={loading} error={error} columns="grid-cols-2 md:grid-cols-3 2xl:grid-cols-4" />
          {page < pages && products.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <p className="text-xs text-ink-muted">
                Showing {products.length} of {total}
              </p>
              <button onClick={loadMore} disabled={loading} className="btn-outline min-w-[200px]">
                {loading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
