import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    sizes: [],
    colors: [],
    images: [],
    brand: "",
    material: "",
    originalPrice: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // CSS classes (updated to match reference theme)
  const formWrapper = "w-full max-w-5xl bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100 mx-auto";
  const inputClass = "w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm";
  const buttonPrimary = "w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg";
  const labelClass = "block text-sm font-medium mb-2 text-gray-600";
  const uploadArea = "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition duration-200 cursor-pointer bg-gray-50";

  // Handlers remain the same
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizesChange = (e) => {
    const sizes = e.target.value.split(",").map((size) => size.trim());
    setProductData((prev) => ({ ...prev, sizes }));
  };

  const handleColorsChange = (e) => {
    const colors = e.target.value.split(",").map((color) => color.trim());
    setProductData((prev) => ({ ...prev, colors }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsSubmitting(true);
      const uploadedImages = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);

        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            },
          }
        );

        uploadedImages.push({ url: data.imageUrl, altText: "" });
      }

      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      alert(`${uploadedImages.length} image(s) uploaded successfully!`);
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload images: " + err.message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("userToken"); 

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product created successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to create product:", err.response?.data || err.message);
      alert("Failed to create product: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className={formWrapper}>
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Add New Product
        </h2>

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
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className={labelClass}>Original Price ($)</label>
              <input
                type="number"
                name="originalPrice"
                value={productData.originalPrice}
                onChange={handleChange}
                className={inputClass}
                min="0"
                step="0.01"
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
                min="0"
                required
              />
            </div>

            <div>
              <label className={labelClass}>Brand</label>
              <input
                type="text"
                name="brand"
                value={productData.brand}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
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
            <label className={labelClass}>Material</label>
            <input
              type="text"
              name="material"
              value={productData.material}
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
              value={productData.sizes.join(", ")}
              onChange={handleSizesChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Colors (comma-separated, e.g., Red, Blue, Green)
            </label>
            <input
              type="text"
              value={productData.colors.join(", ")}
              onChange={handleColorsChange}
              className={inputClass}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass}>Product Images</label>
            <div className={uploadArea}>
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <svg
                    className="w-12 h-12 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-indigo-600 hover:text-indigo-500">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                  disabled={isSubmitting}
                />
              </label>

              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center mt-1 text-gray-600">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="font-medium mb-2 text-gray-600">Preview Images:</p>
              <div className="flex flex-wrap gap-4">
                {productData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img.url}
                      alt={img.altText || `Product image ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-md shadow border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {productData.images.length === 0 && (
                  <p className="text-gray-500 italic text-sm">
                    No images added yet
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${buttonPrimary} ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Product...
                </span>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;