const mongoose=require("mongoose");
const dotenv=require("dotenv");
const Product=require("./models/Product");
const User=require("./models/User");
const Cart=require("./models/Cart");
const product=require("./data/products")

dotenv.config();

//connect to DB
mongoose.connect(process.env.MONGO_URI);

const seedData=async()=>{
    try{
        // clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        //create a default admin user
        const createdUser=await User.create({
            name:"Syed Ibrahim Ali",
            email:"syedibrahimali1111@gmail.com",
            password:"123456",
            role:"admin"
        });

        const UserID = createdUser._id;

        const sampleProducts=product.map((product)=>{
            return {...product, user: UserID}
        })

        //insert the data into database
        await Product.insertMany(sampleProducts);
        console.log("Product Data seeded successfully");
        process.exit();

    }
    catch(error){
        console.error("Error seeing the data", error);
        process.exit(1);
    }
}

seedData();
