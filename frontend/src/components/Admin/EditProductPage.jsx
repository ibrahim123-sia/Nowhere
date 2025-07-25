import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    countInStock: 0,
    sku: '',
    sizes: [],
    colors: [],
    images: [],
    brand: '',
    material: '',
    originalPrice: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch product data');
        }
        
        const data = await res.json();
        setProductData(data);
      } catch (err) {
        console.error("Failed to fetch product", err);
        alert('Failed to fetch product data: ' + err.message);
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizesChange = (e) => {
    const sizes = e.target.value.split(',').map(size => size.trim());
    setProductData(prev => ({ ...prev, sizes }));
  };

  const handleColorsChange = (e) => {
    const colors = e.target.value.split(',').map(color => color.trim());
    setProductData(prev => ({ ...prev, colors }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Upload each image sequentially
      const uploadedImages = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);
        
        const response = await fetch('http://localhost:5000/api/admin/upload', {
          method: 'POST',
          body: formData,
          headers: token ? { 'x-auth-token': token } : {}
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed for ${files[i].name}`);
        }
        
        const result = await response.json();
        uploadedImages.push(result);
      }
      
      // Add new images to existing images
      setProductData(prev => ({
        ...prev,
        images: [
          ...prev.images,
          ...uploadedImages.map(img => ({
            url: img.url,
            altText: img.originalname || 'Product image'
          }))
        ]
      }));
      
      alert(`${files.length} image(s) uploaded successfully!`);
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload images: ' + err.message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = (index) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // FIXED SUBMIT HANDLER - sends full image objects
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Send full product data including image objects
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(productData)
      });
      
      if (res.ok) {
        alert('Product updated successfully!');
        navigate('/admin/products');
      } else {
        const errorData = await res.json();
        alert(`Failed to update product: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error('Error updating product', err);
      alert('An error occurred while updating the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md bg-white'>
      <h2 className='text-3xl font-bold mb-6'>Edit Product</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Product Name</label>
          <input    
            type='text'
            name='name'
            value={productData.name}
            onChange={handleChange}
            className='w-full border border-gray-500 rounded-md p-2'
            required
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Description</label>
          <textarea
            name='description'
            value={productData.description}
            onChange={handleChange}
            className='w-full border border-gray-500 rounded-md p-2'
            rows={4}
            required 
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='mb-6'>
            <label className=' block font-semibold mb-2'>Price ($)</label>
            <input
              type='number'
              name='price'
              value={productData.price}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md p-2'
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className='mb-6'>
            <label className='block font-semibold mb-2'>Original Price ($)</label>
            <input
              type='number'
              name='originalPrice'
              value={productData.originalPrice}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md p-2'
              min="0"
              step="0.01"
            />
          </div>
          
          <div className='mb-6'>
            <label className='block font-semibold mb-2'>Count in Stock</label>
            <input
              type='number'
              name='countInStock'
              value={productData.countInStock}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md p-2'
              min="0"
              required
            />
          </div>
          
          <div className='mb-6'>
            <label className='block font-semibold mb-2'>Brand</label>
            <input
              type='text'
              name='brand'
              value={productData.brand}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md p-2'
              required
            />
          </div>
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>SKU</label>
          <input
            type='text'
            name='sku'
            value={productData.sku}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
            required
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Material</label>
          <input
            type='text'
            name='material'
            value={productData.material}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
            required
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>
            Sizes (comma-separated, e.g., S, M, L)
          </label>
          <input
            type='text'
            value={productData.sizes.join(', ')}
            onChange={handleSizesChange}
            className='w-full border border-gray-300 rounded-md p-2'
            required
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>
            Colors (comma-separated, e.g., Red, Blue, Green)
          </label>
          <input
            type='text'
            value={productData.colors.join(', ')}
            onChange={handleColorsChange}
            className='w-full border border-gray-300 rounded-md p-2'
            required
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Product Images</label>
          
          <div className='border border-dashed border-gray-400 rounded-lg p-4 mb-4'>
            <input
              type='file'
              onChange={handleImageUpload}
              multiple
              accept='image/*'
              className='w-full mb-2'
              disabled={isSubmitting}
            />
            <p className='text-sm text-gray-500 mb-2'>
              Select multiple images (JPG, PNG, WEBP - Max 5MB each)
            </p>
            
            {uploadProgress > 0 && (
              <div className='mt-2'>
                <div className='w-full bg-gray-200 rounded-full h-2.5'>
                  <div 
                    className='bg-blue-600 h-2.5 rounded-full' 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className='text-sm text-center mt-1'>
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          
          <div className='mt-4'>
            <p className='font-medium mb-2'>Product Images:</p>
            <div className='flex flex-wrap gap-4'>
              {productData.images.map((img, idx) => (
                <div key={idx} className='relative group'>
                  <img
                    src={img.url}
                    alt={img.altText || `Product image ${idx + 1}`}
                    className='w-20 h-20 object-cover rounded-md shadow-md'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(idx)}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {productData.images.length === 0 && (
                <p className='text-gray-500 italic'>No images added yet</p>
              )}
            </div>
          </div>
        </div>
        
        <button
          type='submit'
          disabled={isSubmitting}
          className={`bg-green-600 text-white py-3 rounded-md hover:bg-green-700 w-full mt-6 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Updating Product...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;