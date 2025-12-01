import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        
        // Debug: Log the response to see its structure
        console.log("API Response:", response);
        console.log("Response data:", response.data);
        
        // Handle different response structures
        let products = [];
        
        if (Array.isArray(response.data)) {
          // Case 1: Direct array
          products = response.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          // Case 2: Object with products array
          products = response.data.products;
        } else if (response.data && Array.isArray(response.data.data)) {
          // Case 3: Object with data array
          products = response.data.data;
        } else if (response.data && response.data.products) {
          // Case 4: Single product or different structure
          products = [response.data.products];
        } else {
          // Case 5: Unexpected response
          console.warn("Unexpected API response structure:", response.data);
          products = [];
        }
        
        console.log("Processed products:", products);
        setNewArrivals(products);
        
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        console.error("Error response:", error.response?.data);
        setError(error.message || "Failed to load new arrivals");
        setNewArrivals([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewArrivals();
  }, []);

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.clientWidth < container.scrollWidth
      );
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      updateScrollButtons();
      container.addEventListener("scroll", updateScrollButtons);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButtons);
      }
    };
  }, [newArrivals]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollStart(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const walk = e.pageX - startX;
    scrollRef.current.scrollLeft = scrollStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!newArrivals || newArrivals.length === 0) {
    return (
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-gray-600">No new arrivals available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            New Arrivals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest styles freshly added to keep your wardrobe on the
            cutting edge of fashion.
          </p>
          
          {/* Navigation Arrows - Only show if there are items */}
          {newArrivals.length > 0 && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden md:flex space-x-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full ${
                  canScrollLeft
                    ? "bg-white text-indigo-600 shadow-md hover:bg-indigo-50"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                } transition-colors duration-200`}
                aria-label="Scroll left"
              >
                <FiChevronLeft className="text-xl" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`p-2 rounded-full ${
                  canScrollRight
                    ? "bg-white text-indigo-600 shadow-md hover:bg-indigo-50"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                } transition-colors duration-200`}
                aria-label="Scroll right"
              >
                <FiChevronRight className="text-xl" />
              </button>
            </div>
          )}
        </div>

        {/* Product Carousel */}
        <div
          ref={scrollRef}
          className={`relative overflow-x-auto flex gap-6 scrollbar-hide pb-6 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {newArrivals.map((product) => {
            // Safely access product properties with optional chaining
            const productId = product?._id || product?.id;
            const productName = product?.name || "Unnamed Product";
            const productPrice = product?.price || 0;
            const productImages = product?.images || [];
            const mainImage = productImages[0] || {};
            
            if (!productId) {
              console.warn("Product missing ID:", product);
              return null;
            }

            return (
              <div
                key={productId}
                className="flex-shrink-0 w-72 sm:w-80 lg:w-96 relative group"
              >
                <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
                  {mainImage.url ? (
                    <img
                      src={mainImage.url}
                      alt={mainImage.altText || productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable="false"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />
                </div>
                <div className="mt-4">
                  <Link 
                    to={`/product/${productId}`} 
                    className="block group-hover:text-indigo-600 transition-colors duration-200"
                  >
                    <h3 className="font-medium text-gray-900">{productName}</h3>
                    <p className="text-gray-600 mt-1">${productPrice.toFixed(2)}</p>
                  </Link>
                </div>
                <Link
                  to={`/product/${productId}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View ${productName}`}
                />
              </div>
            );
          })}
        </div>

        {/* Mobile Navigation - Only show if there are items */}
        {newArrivals.length > 0 && (
          <div className="flex justify-center space-x-4 mt-6 md:hidden">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full ${
                canScrollLeft
                  ? "bg-white text-indigo-600 shadow-md hover:bg-indigo-50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              } transition-colors duration-200`}
              aria-label="Scroll left"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full ${
                canScrollRight
                  ? "bg-white text-indigo-600 shadow-md hover:bg-indigo-50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              } transition-colors duration-200`}
              aria-label="Scroll right"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;