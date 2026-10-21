import React from "react";
import { Link } from "react-router-dom";
import { FiAward, FiCreditCard, FiRefreshCw, FiMaximize2, FiTruck } from "react-icons/fi";
import usePageTitle from "../../../hooks/usePageTitle";

const FEATURES = [
  { icon: FiTruck, title: "Delivery across Pakistan", text: "3-5 working days to all major cities. Free on orders of Rs. 5,000 or more, Rs. 250 otherwise." },
  { icon: FiCreditCard, title: "Cash on delivery", text: "No card needed. Check out as a guest with just your email, and pay when your order arrives." },
  { icon: FiRefreshCw, title: "30-day returns", text: "Unworn items with tags can be returned or exchanged within 30 days of delivery." },
  { icon: FiMaximize2, title: "Honest sizing", text: "Size guides on every product, plus fit feedback from verified buyers in the reviews." },
  { icon: FiAward, title: "Quality fabrics", text: "Cotton, linen blends and denim chosen for comfort in our climate, with care instructions on every piece." },
];

const FeaturesPage = () => {
  usePageTitle("Why shop with us");
  return (
    <div className="container-page py-14">
      <div className="max-w-2xl">
        <p className="eyebrow">Why Nowhere</p>
        <h1 className="heading-display mt-2 text-4xl md:text-5xl">Everything you expect, and a little more.</h1>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream"><Icon className="h-5 w-5" /></span>
            <h2 className="mt-6 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center rounded-[2rem] bg-ink px-8 py-14 text-center text-white">
        <h2 className="font-display text-3xl md:text-4xl">Ready to find your next favourite?</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/collections/new-arrivals" className="btn-light">Shop new arrivals</Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
