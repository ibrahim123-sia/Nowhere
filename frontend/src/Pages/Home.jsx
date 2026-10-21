import React from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Product/GenderCollectionSection";
import NewArrivals, { ProductCarousel } from "../components/Product/NewArrivals";
import FeaturedCollection from "../components/Product/FeaturedCollection";
import FeaturesSection from "../components/Product/FeaturesSection";
import AssistantPromo from "../components/Agent/AssistantPromo";
import usePageTitle from "../hooks/usePageTitle";

const Home = () => {
  usePageTitle();

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      <ProductCarousel eyebrow="Customer favourites" title="Best sellers" endpoint="/products/best-sellers?limit=10" viewAllTo="/collections/all?sortBy=popularity" />
      <AssistantPromo />
      <ProductCarousel eyebrow="Limited time" title="On sale now" endpoint="/products?collection=sale&limit=10" viewAllTo="/collections/sale" />
      <FeaturedCollection />
      <ProductCarousel eyebrow="For her" title="Women's bottoms" endpoint="/products?gender=Women&category=Bottom Wear&limit=10" viewAllTo="/collections/all?gender=Women&category=Bottom Wear" />
      <FeaturesSection />
    </div>
  );
};

export default Home;
