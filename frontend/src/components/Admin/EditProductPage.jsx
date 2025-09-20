import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux"
import {fetchProductDetails, updateProduct} from "../../redux/slices/productSlice"
import axios from "axios";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const {selectedProduct, loading, error} = useSelector((state) => state.products);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collection: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false); //image uploading state

  useEffect(() => {
    if(id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if(selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, {url: data.imageUrl, altText: ""}]
      }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({id, productData}));
    navigate("/admin/products");
  };

  // CSS classes based on your reference files
  const formWrapper = "w-full max-w-5xl bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100 mx-auto";
  const inputClass = "w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm";
  const buttonPrimary = "w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg";
  const labelClass = "block text-sm font-medium mb-2 text-gray-600";
  const errorClass = "text-red-500 mb-4 text-sm p-2 bg-red-50 rounded-md";

 if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={errorClass}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className={formWrapper}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Product Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className={inputClass}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Price ($)</label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Count in Stock</label>
              <input
                type="number"
                name="countInStock"
                value={productData.countInStock}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>SKU</label>
              <input
                type="text"
                name="sku"
                value={productData.sku}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <input
                type="text"
                name="category"
                value={productData.category}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Sizes (comma-separated, e.g., S, M, L)
              </label>
              <input
                type="text"
                name="sizes"
                value={productData.sizes.join(", ")}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    sizes: e.target.value.split(",").map((size) => size.trim()),
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Colors (comma-separated)
              </label>
              <input
                type="text"
                name="colors"
                value={productData.colors.join(", ")}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    colors: e.target.value
                      .split(",")
                      .map((color) => color.trim()),
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass}>Upload Image</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200">
                Choose File
                <input 
                  type="file" 
                  onChange={handleImageUpload} 
                  className="hidden"
                />
              </label>
              {uploading && (
                <div className="flex items-center text-indigo-600">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              {productData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image.url} 
                    alt={image.AltText || "Product Image"}
                    className="w-24 h-24 object-cover rounded-md border border-gray-200"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className={buttonPrimary}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;