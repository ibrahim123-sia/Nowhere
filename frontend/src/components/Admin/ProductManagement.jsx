import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch("http://localhost:5000/api/products", {
          headers: {
            'x-auth-token': token
          }
        });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: "DELETE",
          headers: {
            'x-auth-token': token
          }
        });
        
        if (res.ok) {
          setProducts(products.filter(p => p._id !== productId));
          alert('Product deleted successfully');
        } else {
          alert('Failed to delete product');
        }
      } catch (err) {
        console.error('Error deleting product', err);
      }
    }
  };

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className="flex justify-between items-center mb-6">
        <h2 className='text-2xl font-bold'>Product Management</h2>
        <Link 
          to="/admin/newproduct" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>
      
      <div className='overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='min-w-full text-left text-gray-500'>
          {/* ... table structure from your code ... */}
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className='border-b hover:bg-gray-50'>
                  <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>
                    {product.name}
                  </td>
                  <td className='p-4'>${product.price}</td>
                  <td className='p-4'>{product.sku}</td>
                  <td className='p-4'>
                    <Link
                      to={`/admin/product/${product._id}/edit`}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className='text-center py-4 text-gray-500'>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;