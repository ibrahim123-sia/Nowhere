import React from "react";
import { Link } from "react-router-dom";
import feature from "../../assets/featured.webp";

const FeaturedCollection = () => {
  return (
    <section className="container-page mt-24">
      <div className="grid overflow-hidden rounded-[2rem] bg-cream lg:grid-cols-2">
        <div className="flex flex-col justify-center p-10 md:p-16">
          <p className="eyebrow">Comfort &amp; style</p>
          <h2 className="heading-display mt-3 text-4xl leading-tight md:text-5xl">Apparel designed for everyday life.</h2>
          <p className="mt-5 max-w-md text-ink-soft">
            Breathable cottons and easy fits that take you from the office to the weekend. Pieces you'll reach for again and again.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/collections/essentials" className="btn-primary">
              Shop essentials
            </Link>
            <Link to="/collections/workwear" className="btn-outline">
              Workwear edit
            </Link>
          </div>
        </div>
        <img src={feature} alt="Everyday apparel collection" loading="lazy" className="h-full max-h-[560px] w-full object-cover" />
      </div>
    </section>
  );
};

export default FeaturedCollection;
