import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProductPage = () => {
  
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    countInStock: 0,
    sku: '',
   category:"",
   brand:"",
   sizes:[],
   colors:[],
   collection: "",
   material:"",
   gender:"",
   images:[
    {
      url:"https://picsum.photos.150?random=1",
   },
    {
      url:"https://picsum.photos.150?random=2",
   },
  ]
  });
  
  const handleChange=(e)=>{
    const {name,value}=e.target;
    setProductData((prevData)=>({...prevData,[name]:value}))
  }

  return (
    <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
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
          <label className='block font-semibold mb-2'>
            Sizes (comma-separated, e.g., S, M, L)
          </label>
          <input
            type='text'
            name='sizes'
            value={productData.sizes.join(', ')}
            onChange={(e)=>setProductData({...productData,sizes:e.target.value.split(",").map((size)=>size.trim())})}
            className='w-full border border-gray-300 rounded-md p-2'
            
          />
        </div>

 
         <div className='mb-6'>
          <label className='block font-semibold mb-2'>
            Colors (comma-separated, e.g., Red, Blue, Green)
          </label>
          <input
            type='text'
            name='colors'
            value={productData.colors.join(', ')}
            onChange={(e)=>setProductData({...productData,colors:e.target.value.split(",").map((color)=>color.trim())})}
            className='w-full border border-gray-300 rounded-md p-2'
            
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
              
            />
          </div>
        </div>


        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Material</label>
          <input
            type='text'
            name='material'
            value={productData.material}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
          
          />
        </div>


        
        
        
      </form>
    </div>
  );
};

export default EditProductPage;