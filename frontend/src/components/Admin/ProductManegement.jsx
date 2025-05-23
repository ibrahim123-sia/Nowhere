import React from 'react'

const ProductManegement = () => {
    const products=[{
        _id:1234,
        name:"shirt",
        price:110,
        sku:12387654
    }]

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6 '>Product Management</h2>
      <div className='overflow-x-auto shadow-md sm:rounded-lg'>

        <table className='min-w-full text-left text-gray-500'>
            <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                <tr className=''>
                    <th className='py-3 px-4'>Name</th>
                    <th className='py-3 px-4'>Price</th>
                    <th className='py-3 px-4'>Sku</th>
                    <th className='py-3 px-4'>Action</th>
                </tr>
            </thead>
            <tbody>
                {products.length>0 ? products.map((product)=>{
                    <tr key={product._id} className='border-b hover:bg-gray-50 cursor-pointer'>
                        <td className='p-4 font-medium text-gray-90 whitespace-nowrap0'></td>
                    </tr>
                }) : (
                    <tr></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductManegement
