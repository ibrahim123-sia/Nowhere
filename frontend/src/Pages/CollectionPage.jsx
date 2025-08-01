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
  const [ searchParams  ]= useSearchParams();
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
    // it will close sidebar if click outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setisSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener when sidebar is open
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]); // Depend on `isSidebarOpen` to reattach listener when state changes

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile filter button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" />
        Filters
      </button>
      {/*filter side bar  */}
      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0
      `}
      >
        <FilterSidebar />
      </div>
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        {/* sort option */}
        <SortOptions />

        {/* product grid */}
        <ProductGrid products={products} loading={loading} error={error}/>
      </div>
    </div>
  );
};

export default CollectionPage;
