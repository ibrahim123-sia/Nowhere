import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Product/GenderCollectionSection";
import NewArrivals from "../components/Product/NewArrivals";
import ProductDetails from "../components/Product/ProductDetail";
import ProductGrid from "../components/Product/ProductGrid";
import FeaturedCollection from "../components/Product/FeaturedCollection";
import FeaturesSection from "../components/Product/FeaturesSection";
import Login from "./Login";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {fetchProductsByFilters} from "../redux/slices/productSlice"


const Home = () => {

  const dispatch=useDispatch(); 
  const {products,loading,error}=useSelector((state)=>state.products);
  const [bestSellerProduct,setbestSellerProduct]=useState(null);

  useEffect(()=>{
    //fetch product for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender:"Women",
        category:"Bottom Wear",
        limit:8
      })
    );
    //fetch best seller product
    const fetchBestSeller=async()=>{
      try {
          const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
          setbestSellerProduct(response.data)
          
      } catch (error) {
        console.error(error);
        
      }
    };
    fetchBestSeller();

  },[dispatch])

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* best seller */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerProduct?(<ProductDetails productId={bestSellerProduct._id} />):(
        <p className="text-center">Loading best seller product ...</p>
      )}
      

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears For Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error}/>
      </div>
      <FeaturedCollection/>
      <FeaturesSection/>
      <Login/>
    </div>
  );
};

export default Home;
