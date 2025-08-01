const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const products = require("../data/products");

const router = express.Router();

//helper functionto get a cart by user id or guest id

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

//@route POST /api/cart
//@ add a product to the cart for the guest and logged-in user
//@access public

router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Convert quantity to number
    const quantityNum = Number(quantity);

    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity =
          Number(cart.products[productIndex].quantity) + quantityNum;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity: quantityNum,
        });
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Create new cart with quantity as number
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId || "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity: quantityNum,
          },
        ],
        totalPrice: product.price * quantityNum,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route PUT /api/cart
//@desc update product quantity in the cart for a guest or a logged in user
//@access public

router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      // Convert quantity to number
      const quantityNum = Number(quantity);

      // Update quantity
      if (quantityNum > 0) {
        cart.products[productIndex].quantity = quantityNum;
      } else {
        cart.products.splice(productIndex, 1); // Remove product if quantity 0
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // Add await here to ensure save completes
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route DELETE /api/cart
//@desc remove product cart
//@access public

router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in the cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route GET /api/cart
//@desc get logged-in user's cart or guest's cart
//@access public

router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route GET /api/cart/merge
//@desc merge guest cart into user cart on login
//@access private

router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    //find the guest cart and user cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(400).json({ message: "guest cart is empty" });
      }

      if (userCart) {
        //merge guest cart into user cart
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (productIndex > -1) {
            //if the item exist in the user cart, update the quantity
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            //other add the guest item into the cart
            userCart.products.push(guestItem);
          }
        });
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        await userCart.save();

        //remove the guest cart after merging
        try{
          await Cart.findOneAndDelete({guestId})

        }
        catch(error){
          console.error("Error Deleting the guest cart",error)
        }

        res.status(200).json(userCart)
      }
      else{
        //if the user has no existing cart , assign the guest cart to user cart
        guestCart.user=req.user._id;
        guestCart.guestId=undefined;
        await guestCart.save();
        res.status(200).json(guestCart);
      }
    }
    else{
      if(userCart){
        //guest card has already been merged return uer cart
      return res.status(200).json(userCart)
      }
      else{
        res.status(404).json({message:"Guest Cart not found"})
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({message:"Server error"})
  }
});

module.exports = router;
