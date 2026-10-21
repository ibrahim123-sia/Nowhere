import React from "react";
import { useSelector } from "react-redux";
import { FiHeart } from "react-icons/fi";
import ProductGrid from "../components/Product/ProductGrid";
import { EmptyState } from "../components/Common/Feedback";
import useSeo from "../hooks/useSeo";

const WishlistPage = () => {
  useSeo({ title: "Wishlist", noindex: true });
  const items = useSelector((state) => state.wishlist.items);

  return (
    <div className="container-page py-10">
      <h1 className="heading-display text-4xl">Wishlist</h1>
      <p className="mt-2 text-sm text-ink-muted">{items.length} saved {items.length === 1 ? "item" : "items"} on this device</p>
      <div className="mt-8">
        {items.length === 0 ? (
          <EmptyState icon={<FiHeart />} title="Nothing saved yet" description="Tap the heart on any product to save it for later." actionLabel="Discover products" actionTo="/collections/all" />
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
