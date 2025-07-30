const express=require("express")
const Order=require("../models/Order")
const {protect}=require("../middleware/authMiddleware")

const router=express.Router();

//@route GET /api/orders/my-orders
//@desc get logged-in user order
//@access private

router.get("/my-orders",protect,async(req,res)=>{

    try{
        //find the order for the authenticated user
        const orders=await Order.find({user:req.user._id}).sort({
            createdAr:-1,
        }); //sort by most recent order
        res.json(orders)
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"})

    }
});

//@route GET /api/orders/:id
//@desc get order details by id
//@access private

router.get("/:id",protect,async(req,res)=>{

    try{
        const order=await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );

        if(!order){
            return res.status(404).json({message:"Order not found"})
        }

        //return the order detail
        res.json(order)

    }catch(error){
        console.error(error);
         res.status(500).json({message:"Server error"})
        
    }
})

module.exports=router;
