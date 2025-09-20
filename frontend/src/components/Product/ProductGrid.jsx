import React from 'react'
import { Link } from 'react-router-dom'
import { FiLoader, FiAlertCircle, FiHeart } from 'react-icons/fi'
import { toast } from 'sonner'

const ProductGrid = ({ products, loading, error }) => {
  const [wishlistItems, setWishlistItems] = useState([])

  const toggleWishlist = (productId) => {
    if (wishlistItems.includes(productId)) {
      setWishlistItems(wishlistItems.filter(id => id !== productId))
      toast.success('Removed from wishlist')
    } else {
      setWishlistItems([...wishlistItems, productId])
      toast.success('Added to wishlist')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] py-12">
        <div className="flex flex-col items-center text-indigo-600">
          <FiLoader className="animate-spin h-10 w-10 mb-4" />
          <p className="text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px] py-12">
        <div className="flex flex-col items-center text-red-500 max-w-md text-center">
          <FiAlertCircle className="h-10 w-10 mb-4" />
          <p className="text-lg mb-4">Error loading products: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px] py-12">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">No products found</p>
          <Link 
            to="/collections/all" 
            className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors shadow-md"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product) => (
        <div key={product._id} className="group relative">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleWishlist(product._id)
            }}
            className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            aria-label={wishlistItems.includes(product._id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FiHeart 
              className={`h-5 w-5 ${wishlistItems.includes(product._id) ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} 
            />
          </button>

          <Link 
            to={`/product/${product._id}`} 
            className="block outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <img 
                  src={product.images[0]?.url || '/placeholder-product.jpg'} 
                  alt={product.images[0]?.altText || product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Sale Badge */}
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    SALE
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-gray-900 font-medium text-sm line-clamp-2 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through mr-2">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-gray-800 font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  {product.rating && (
                    <div className="flex items-center text-sm text-gray-500">
                      <svg 
                        className="h-4 w-4 text-yellow-400 mr-1" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {product.rating.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default ProductGrid