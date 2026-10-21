import React from "react";
import { Link } from "react-router-dom";
import HeroImg from "../../assets/rabbit-hero.jpg";

const Hero = () => {
  return (
    <section className="container-page pt-4">
      <div className="relative overflow-hidden rounded-[2rem]">
        <img
          src={HeroImg}
          alt="Two friends in light summer clothing at the beach"
          className="h-[78vh] max-h-[760px] min-h-[520px] w-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="max-w-xl p-8 text-white md:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">New season</p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] md:text-7xl">
              Clothes for wherever you're going.
            </h1>
            <p className="mt-5 max-w-md text-base text-white/85 md:text-lg">
              Easy linen, sharp shirting and denim that lasts. Designed and made in Pakistan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/collections/all?gender=Women" className="btn-light">
                Shop women
              </Link>
              <Link to="/collections/all?gender=Men" className="btn border border-white/40 text-white hover:bg-white/10">
                Shop men
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
