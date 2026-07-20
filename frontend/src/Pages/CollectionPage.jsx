import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Product/FilterSidebar";
import SortOptions from "../components/Product/SortOptions";
import ProductGrid from "../components/Product/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setisSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const toggleSidebar = () => {
    setisSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    // Close sidebar if clicked outside (only applies on mobile)
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setisSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile filter button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden mb-4 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm"
      >
        <FaFilter />
        Filters
      </button>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
      )}

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-gray-50 p-4 transition-transform duration-300
            lg:static lg:z-auto lg:w-72 lg:flex-shrink-0 lg:translate-x-0 lg:p-0 lg:sticky lg:top-24
          `}
        >
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-grow min-w-0">
          <h2 className="text-2xl uppercase mb-4">All Collection</h2>

          {/* Sort options */}
          <SortOptions />

          {/* Product grid */}
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
