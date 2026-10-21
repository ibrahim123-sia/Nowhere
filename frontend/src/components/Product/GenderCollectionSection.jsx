import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import MenCollectionImage from "../../assets/mens-collection.jpg";
import WomenCollectionImage from "../../assets/womens-collection.jpg";

const TILES = [
  { title: "Women", subtitle: "Blouses, denim, tailoring", to: "/collections/all?gender=Women", image: WomenCollectionImage },
  { title: "Men", subtitle: "Shirts, tees, chinos", to: "/collections/all?gender=Men", image: MenCollectionImage },
];

const GenderCollectionSection = () => {
  return (
    <section className="container-page mt-6">
      <div className="grid gap-6 md:grid-cols-2">
        {TILES.map((tile) => (
          <Link key={tile.title} to={tile.to} className="group relative block overflow-hidden rounded-[2rem]">
            <img
              src={tile.image}
              alt={`${tile.title}'s collection`}
              loading="lazy"
              className="h-[460px] w-full object-cover transition duration-700 group-hover:scale-[1.03] md:h-[560px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8 text-white">
              <div>
                <h2 className="font-display text-4xl font-medium">{tile.title}</h2>
                <p className="mt-1 text-sm text-white/80">{tile.subtitle}</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink transition group-hover:rotate-45">
                <FiArrowUpRight className="h-5 w-5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GenderCollectionSection;
