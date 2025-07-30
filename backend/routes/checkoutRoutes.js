const express=require("express")
const Checkout=require("../models/Checkout");
const Cart=require("../models/Cart");
const Product=require("../models/Product");
const Order=require("../models/Order");
const {protect}=require("../middleware/authMiddleware");

const router=express.Router();

//@route POST /api/checkout
//@desc create a new checkout session
//@acess private

router.post("/",protect,async(req,res)=>{
    const {checkoutItems,shippingAddress,paymentMethod,totalPrice}=req.body;

        if(!CheckoutItems || CheckoutItems.length===0){
            return res.status(400).json({message:"no item in checkout"})
        }
    try{

        //create a new checkout session
        const newCheckout=await  Checkout.create({
            user:req.user._id,
            checkoutItems:checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus:"Pending",
            isPaid:false,
        })
        console.log(`Checkour created for user: ${req.user._id}`);
        res.status(201).json(newCheckout)

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"server error"})

    }
})

//@route PUT /api/checkout/:id/pay
//@desc update checkout to mark as paid after successfull payment
//@acess private
router.put("/:id/pay",protect,async(req,res)=>{
    const {paymentStatus,paymentDetails}=req.body;

    try{
        const checkout=await Checkout.findById(req.params.id);

        if(!checkout){
            return res.status(404).json({message:"Checkout not found"})
        }

        if(paymentStatus==="paid"){
            checkout.isPaid=true;
            checkout.paymentStatus=paymentStatus,
            checkout.paymentDetails=paymentDetails,
            checkout.paidAt=Date.now();
            await checkout.save();
            res.status(200).json(checkout)
        }
        else{
            res.status(400).json({message:"Invalid Payment Status"})
        }

    }
    catch(error){
        console.error(error)
        res.status(500).json({message:"Server error"})
    }
})

//@route POST /api/checkout/:id/finalized
//@desc Finalize checkout and convert to an order  after payment confirmation
//@acess private

router.post("/:id/finalize",protect,async(req,res)=>{

    try{

        const checkout=await Checkout.findById(req.params.id)
        if(!checkout){
            return res.status(404).json({message:"checkout not found"})
        }

        if(checkout.isPaid && !checkout.isFinalized){
            //create final order base on checkout details

            const finalOrder=await Order.create({
                user:checkout.user,
                orderItems:checkout.orderItems,
                shippingAddress:checkout.shippingAddress,
                paymentMethod:checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid:true,
                paidAt:checkout.isPaid,
                isDelivered:false,
                paymentStatus:"Paid",
                paymentDetails:checkout.paymentDetails,

            });

            //mark checkout as finalize
            checkout.isFinalized=true,
            checkout.finalizedAt=Date.now();
            await checkout.save();
            //Delete the cart associate with the user
            await Cart.findOneAndDelete({user:checkout.user});
            res.status(201).json(finalOrder);
        }
        else if(checkout.isFinalized){
            res.status(400).json({message:"Checkout already Finalized"})
        }
        else{
            res.status(400).json({message:"Checkout is not paid"})
        }

    }catch(error){
        console.error(error)
        res.status(500).json({message:"Server error"})
    }
})

module.exports=router;