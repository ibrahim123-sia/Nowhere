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
        country:"USA"
    }

}

const OrderConfirmationPage = () => {
  return (
    <div>
      
    </div>
  )
}

export default OrderConfirmationPage
