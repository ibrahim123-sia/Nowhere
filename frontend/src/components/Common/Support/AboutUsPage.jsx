import React from "react";
import { Link } from "react-router-dom";
import { FiFeather, FiHeart, FiRepeat } from "react-icons/fi";
import useSeo from "../../../hooks/useSeo";

const VALUES = [
  {
    icon: FiFeather,
    title: "Made to be worn",
    text: "Breathable cottons, linen blends and honest denim, cut for real weather and real days, not just photos.",
  },
  {
    icon: FiRepeat,
    title: "Fewer, better pieces",
    text: "We design essentials you'll reach for again and again, then keep them in the line instead of chasing trends.",
  },
  {
    icon: FiHeart,
    title: "Customer first",
    text: "Cash on delivery, 30-day returns, real fit notes in our reviews, and a stylist in chat whenever you need one.",
  },
];

const AboutUsPage = () => {
  useSeo({
    title: "About us",
    description: "Nowhere makes modern essentials for men and women in Pakistan: breathable cottons, linen blends and honest denim, with cash on delivery and 30-day returns.",
  });
  return (
    <div className="container-page py-14">
      <div className="max-w-3xl">
        <p className="eyebrow">Our story</p>
        <h1 className="heading-display mt-2 text-4xl leading-tight md:text-6xl">Clothes for everyday life, made in Pakistan.</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          Nowhere started in 2025 with a simple idea: modern, well-made clothing shouldn't be hard to find or hard to buy. We work
          with local workshops to make shirts, tees, denim and tailoring that feel good, last long and fit the way you live.
        </p>
      </div>

      <div className="mt-14 grid gap-6 overflow-hidden rounded-[2rem] lg:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
          alt="Inside a clothing studio"
          loading="lazy"
          className="h-full max-h-[520px] w-full rounded-[2rem] object-cover"
        />
        <div className="flex flex-col justify-center rounded-[2rem] bg-cream p-10 md:p-14">
          <h2 className="heading-display text-3xl">Shopping, made personal</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Online shopping should feel like walking into a good store. That's why we built Iris, an AI stylist who can find the
            right piece, check your size and stock, and place your order in a chat, in English, Urdu or Roman Urdu.
          </p>
          <Link to="/collections/all" className="btn-primary mt-8 w-fit">Explore the collection</Link>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {VALUES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream"><Icon className="h-5 w-5" /></span>
            <h3 className="mt-6 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsPage;
