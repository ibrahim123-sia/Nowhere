import React from "react";
import { HiArrowPathRoundedSquare, HiOutlineBanknotes, HiTruck, HiOutlineSparkles } from "react-icons/hi2";

const FEATURES = [
  { icon: HiTruck, title: "Free delivery", description: "On orders over Rs. 5,000, in 3-5 working days" },
  { icon: HiOutlineBanknotes, title: "Cash on delivery", description: "Pay the courier when your order arrives" },
  { icon: HiArrowPathRoundedSquare, title: "30-day returns", description: "Easy exchanges on unworn items with tags" },
  { icon: HiOutlineSparkles, title: "AI stylist", description: "Nora helps you find, size and order in chat" },
];

const FeaturesSection = () => {
  return (
    <section className="container-page mt-24">
      <div className="grid grid-cols-2 gap-6 border-y border-stone-200 py-10 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-start gap-3 sm:flex-row">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-cream">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
