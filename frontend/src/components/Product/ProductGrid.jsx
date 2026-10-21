import React from "react";
import ProductCard from "./ProductCard";
import { EmptyState, ErrorState } from "../Common/Feedback";

export const ProductCardSkeleton = () => (
  <div>
    <div className="skeleton aspect-[4/5] rounded-2xl" />
    <div className="skeleton mt-3 h-3 w-1/3" />
    <div className="skeleton mt-2 h-4 w-3/4" />
    <div className="skeleton mt-2 h-4 w-1/4" />
  </div>
);

const ProductGrid = ({ products, loading, error, columns = "grid-cols-2 md:grid-cols-3 xl:grid-cols-4", skeletons = 8, emptyAction = true }) => {
  if (loading && (!products || products.length === 0)) {
    return (
      <div className={`grid ${columns} gap-x-4 gap-y-8 md:gap-x-6`}>
        {Array.from({ length: skeletons }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={`We couldn't load products. ${error}`} onRetry={() => window.location.reload()} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No matches found"
        description="Try removing a filter or searching for something else."
        actionLabel={emptyAction ? "Browse all products" : undefined}
        actionTo={emptyAction ? "/collections/all" : undefined}
      />
    );
  }

  return (
    <div className={`grid ${columns} gap-x-4 gap-y-8 md:gap-x-6`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
