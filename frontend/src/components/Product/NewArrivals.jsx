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
        
        console.log('🔄 Starting API fetch...');
        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`;
        console.log('📡 API URL:', apiUrl);
        
        const response = await axios.get(apiUrl);
        
        console.log('✅ API Response received:', response);
        console.log('📊 response.data:', response.data);
        console.log('🔍 Type of response.data:', typeof response.data);
        console.log('📋 Is response.data array?', Array.isArray(response.data));
        
        if (response.data) {
          console.log('🔑 response.data keys:', Object.keys(response.data));
          console.log('🔍 response.data constructor:', response.data.constructor.name);
        }

        // EXTREMELY SAFE data extraction
        let arrivalsData = response.data;
        
        // If it's not an array, try to find arrays in common structures
        if (arrivalsData && !Array.isArray(arrivalsData)) {
          console.log('⚠️ response.data is not an array, searching for nested array...');
          
          // Check all possible nested array properties
          const possibleArrayProps = ['products', 'data', 'items', 'newArrivals', 'result', 'docs', 'records'];
          for (const prop of possibleArrayProps) {
            if (Array.isArray(arrivalsData[prop])) {
              console.log(`✅ Found array in property: ${prop}`);
              arrivalsData = arrivalsData[prop];
              break;
            }
          }
        }

        // Final safety check - ensure we have an array
        if (!Array.isArray(arrivalsData)) {
          console.error('❌ Final data is not an array:', arrivalsData);
          console.log('🔧 Converting to empty array for safety');
          arrivalsData = [];
        }

        console.log('🎯 Final arrivals data:', arrivalsData);
        console.log('📦 Final data length:', arrivalsData.length);
        
        setNewArrivals(arrivalsData);
        
      } catch (err) {
        console.error('❌ API Error:', err);
        console.error('Error response:', err.response);
        setError("Failed to load new arrivals. Please try again later.");
        setNewArrivals([]);
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
      setTimeout(updateScrollButtons, 300);
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
      
      if (newArrivals.length > 0) {
        setTimeout(updateScrollButtons, 100);
      }
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

  // ULTRA-SAFE rendering with multiple checks
  const renderProducts = () => {
    console.log('🎨 Rendering products...');
    console.log('📦 newArrivals state:', newArrivals);
    console.log('🔍 Is newArrivals array?', Array.isArray(newArrivals));
    
    if (!Array.isArray(newArrivals)) {
      console.error('❌ CRITICAL: newArrivals is not an array during render!');
      return (
        <div className="text-center py-8 text-red-600">
          Data format error. Please refresh the page.
        </div>
      );
    }

    if (newArrivals.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No new arrivals available.
        </div>
      );
    }

    return newArrivals.map((product, index) => {
      // Additional safety for each product
      if (!product || typeof product !== 'object') {
        console.warn(`⚠️ Invalid product at index ${index}:`, product);
        return null;
      }

      return (
        <div
          key={product._id || `product-${index}`}
          className="flex-shrink-0 w-72 sm:w-80 lg:w-96 relative group"
        >
          <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-100">
            <img
              src={product.images?.[0]?.url || '/placeholder-image.jpg'}
              alt={product.images?.[0]?.altText || product.name || 'Product image'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              draggable="false"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                New
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <Link 
              to={`/product/${product._id}`} 
              className="block group-hover:text-indigo-600 transition-colors duration-200"
            >
              <h3 className="font-medium text-gray-900 line-clamp-1">
                {product.name || 'Unnamed Product'}
              </h3>
              <p className="text-gray-600 mt-1">
                ${product.price ? product.price.toFixed(2) : '0.00'}
              </p>
            </Link>
          </div>
          
          <Link
            to={`/product/${product._id}`}
            className="absolute inset-0 z-10"
            aria-label={`View ${product.name || 'product'}`}
          />
        </div>
      );
    });
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
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the latest styles freshly added to keep your wardrobe on the
              cutting edge of fashion.
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-gray-500">Loading new arrivals...</div>
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
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  console.log('🏁 Final render - newArrivals:', newArrivals);

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
          
          {Array.isArray(newArrivals) && newArrivals.length > 0 && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden md:flex space-x-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full border ${
                  canScrollLeft
                    ? "bg-white text-indigo-600 shadow-md hover:bg-indigo-50 border-indigo-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                } transition-colors duration-200`}
                aria-label="Scroll left"
              >
                <FiChevronLeft className="text-xl" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`p-2 rounded-full border ${
                  canScrollRight
                    ? "bg-white text-indigo-600 shadow-md hover:bg-indigo-50 border-indigo-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
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
          {renderProducts()}
        </div>

        {/* Mobile Navigation */}
        {Array.isArray(newArrivals) && newArrivals.length > 0 && (
          <div className="flex justify-center space-x-4 mt-6 md:hidden">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border ${
                canScrollLeft
                  ? "bg-white text-indigo-600 shadow-md hover:bg-indigo-50 border-indigo-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              } transition-colors duration-200`}
              aria-label="Scroll left"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border ${
                canScrollRight
                  ? "bg-white text-indigo-600 shadow-md hover:bg-indigo-50 border-indigo-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
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