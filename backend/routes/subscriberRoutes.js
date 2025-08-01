const express=require("express")
const router=express.Router();
const Subscriber=require("../models/Subscriber")

//@route POST /api/subscribe
//@desc handle news letter subscription
//@access public

router.post("/subscribe",async(req,res)=>{
    const {email}=req.body

    if(!email){
        return res.status(400).json({message:"Email is required"})
    }
    try{
        //check if the email is already subscribe

        let subscriber=await Subscriber.findOne({email});

        if(subscriber){
            return res.status(400).json({message:"Email is already subscribe"})
        }

        //create new subscriber
        subscriber=new Subscriber({email});
        await subscriber.save();
        res.status(201).json({message:"Successfully"})

    }
    catch(error){
        console.error(error)
        res.status(500).json({message:"Server error"})

    }
})

module.exports=router
