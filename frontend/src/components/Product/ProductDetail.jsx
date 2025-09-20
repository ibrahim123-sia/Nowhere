import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FiMinus, FiPlus, FiLoader, FiHeart, FiShare2 } from "react-icons/fi";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetail = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts, similarLoading } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "increment") setQuantity((prev) => prev + 1);
    if (action === "decrement" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Added to cart");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to add to cart");
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="animate-spin h-10 w-10 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!selectedProduct) {
    return null;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-12">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
              {selectedProduct.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image.url)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    mainImage === image.url
                      ? "border-indigo-600"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.altText || `Product thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative w-full">
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={mainImage || selectedProduct.images?.[0]?.url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={toggleWishlist}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <FiHeart className={`h-5 w-5 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
                </button>
                <button 
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Share product"
                >
                  <FiShare2 className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {selectedProduct.name}
                </h1>
                {selectedProduct.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ${selectedProduct.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-2xl font-semibold text-indigo-600">
                ${selectedProduct.price.toFixed(2)}
              </span>
              
              {selectedProduct.rating && (
                <div className="flex items-center mt-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">
                    ({selectedProduct.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
              
              <p className="text-gray-600 mt-6">
                {selectedProduct.description}
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color: <span className="font-normal text-gray-700">{selectedColor}</span></h3>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-indigo-600 ring-2 ring-indigo-100"
                        : "border-transparent hover:border-gray-200"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size: <span className="font-normal text-gray-700">{selectedSize}</span></h3>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                      selectedSize === size
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-900 border-gray-300 hover:border-indigo-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <FiMinus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium text-gray-900">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled || !selectedSize || !selectedColor}
              className={`w-full py-4 px-6 rounded-lg font-medium transition-all ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              } ${
                !selectedSize || !selectedColor
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isButtonDisabled ? (
                <span className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin h-5 w-5" />
                  Adding...
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>

            {/* Product Details */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Brand</p>
                  <p className="text-gray-900">{selectedProduct.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Material</p>
                  <p className="text-gray-900">{selectedProduct.material}</p>
                </div>
                {selectedProduct.careInstructions && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Care Instructions</p>
                    <p className="text-gray-900">{selectedProduct.careInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="border-t border-gray-200 px-8 py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={similarLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;