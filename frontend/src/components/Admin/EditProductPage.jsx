import React, { useState } from 'react';

const EditProductPage = () => {
  const [productData, setProductData] = useState({
    name: 'Classic Oxford Button-Down Shirt',
    description: `This classic Oxford shirt is tailored for a polished yet casual look. Crafted from high-quality cotton, it features a button-down collar and a comfortable, slightly relaxed fit. Perfect for both formal and casual occasions, it comes with long sleeves, a button placket, and a yoke at the back. The shirt is finished with a gently rounded hem and adjustable button cuffs.`,
    price: 39.99,
    countInStock: 20,
    sku: 'OX-SH-001',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Red', 'Blue', 'Yellow'],
    images: [
      { url: 'https://picsum.photos/150?random=1' },
      { url: 'https://picsum.photos/150?random=2' }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  setProductData((prevData)=>({...prevData,[name]:value}) )
  };

  const handleImageUpload = async (e) => {
   const file=e.target.files[0]
   console.log(file)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Product:', productData);
    // Add API logic here
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

        
          <div className='mb-6'>
            <label className=' block font-semibold mb-2'>Price</label>
            <input
              type='number'
              name='price'
              value={productData.price}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md p-2'
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
            />
          </div>
        

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>SKU</label>
          <input
            type='text'
            name='sku'
            value={productData.sku}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Sizes (comma-separated)</label>
          <input
            type='text'
            name='sizes'
            value={productData.sizes.join(', ')}
            onChange={(e)=>setProductData({...prevData, sizes:e.target.value.split(",").map((size)=>size.trim()),})}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

         <div className='mb-6'>
          <label className='block font-semibold mb-2'>Colors (comma-separated)</label>
          <input
            type='text'
            name='colors'
            value={productData.colors.join(', ')}
            onChange={(e)=>setProductData({...prevData, sizes:e.target.value.split(",").map((color)=>color.trim()),})}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Upload Image</label>
          <input
            type='file'
            onChange={handleImageUpload}
            
          />
          <div className='flex gap-4 mt-4'>
            {productData.images.map((img, idx) => (
              <div key={idx}>
                    <img
                key={idx}
                src={img.url}
                alt={`Preview ${idx}`}
                className='w-20 h-20 object-cover rounded-md shadow-md'
              />
              </div>
            ))}
          </div>
        </div>

        
          <button
            type='submit'
            className=' bg-green-600 text-white  py-2 rounded-md hover:bg-green-700 w-full mt-6'
          >
            Update Product
          </button>
        
      </form>
    </div>
  );
};

export default EditProductPage;
