import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaypalButton from "./PaypalButton";

const Checkout = () => {
  const [checkoutId, setCheckoutId] = useState();
  const cart = {
    product: [
      {
        name: "stylish jacket",
        size: "M",
        color: "Black",
        price: 120,
        image: "https://picsum.photos/150?random=1",
      },
      {
        name: "stylish jacket",
        size: "M",
        color: "Black",
        price: 120,
        image: "https://picsum.photos/150?random=2",
      },
    ],
    totalPrice: 196,
  };

  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    Address: "",
    City: "",
    postalcode: "",
    country: "",
    phone: "",
  });

  const handlePaymentSuccess = (details) => {
    console.log("payment successfyl", details);
    navigate("order-confirmation");
  };

  const handleCreateCheckout = (e) => {
    e.preventDefault();
    setCheckoutId(123);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* left section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Detail</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value="abc@gmail.com"
              className="w-full p-2 border rounded "
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                required
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                required
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.Address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  Address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                required
                value={shippingAddress.City}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    City: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal code</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                required
                value={shippingAddress.postalcode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalcode: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded"
              >
                Continue to payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with Paypal</h3>
                <PaypalButton
                  amount={100}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => alert("Payment Fail. try again")}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* right section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.product.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start">
                <img src={product.image} alt={product.image} className="w-20 h-24 object-cover mr-4"/>
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-xl">${product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
