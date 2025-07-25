import React from 'react'


const checkout={
    _id: "12323",
    createdAt: new Date(),
    checkoutItem:
    [
        {
            productId:"1",
            name:"jacket",
            color:"black",
            size:"M",
            price:150,
            quantity:1,
            image:"https://picsm.photos/150?random=1",
        },
        {
            productId:"2",
            name:"shirt",
            color:"blue",
            size:"XL",
            price:120,
            quantity:1,
            image:"https://picsm.photos/150?random=1",
        },
    ],
    shippingAddress:{
        address:"123 xyz ",
        city:"newyork",
        country:"USA",
    },

}

const OrderConfirmationPage = () => {
  return (
    <div className='m-w-4xl mx-auto p-6 bg-white'>
      <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>
        Thanks You For Your Order!
      </h1>

    {checkout &&
        <div className='p-6 rounded-lg border'>
            <div className='flex justify-between mb-20'>
              {/*order id and date  */}
              <div>
                <h2 className='text-xl font-semibold'>
                  Order ID: {checkout._id}
                </h2>
                <p className='text-gray-500'>
                  Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>  
        </div>
    }

    </div>
  )
}

export default OrderConfirmationPage
