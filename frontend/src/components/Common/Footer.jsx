import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FiPhoneCall, FiMail } from "react-icons/fi";
import { toast } from "sonner";
import api from "../../utils/api";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "New in", to: "/collections/new-arrivals" },
      { label: "Men", to: "/collections/all?gender=Men" },
      { label: "Women", to: "/collections/all?gender=Women" },
      { label: "Workwear", to: "/collections/workwear" },
      { label: "Sale", to: "/collections/sale" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track your order", to: "/track-order" },
      { label: "FAQs", to: "/faqs" },
      { label: "Contact us", to: "/contact" },
      { label: "Why shop with us", to: "/features" },
    ],
  },
  {
    title: "Nowhere",
    links: [
      { label: "About us", to: "/about" },
      { label: "My account", to: "/profile" },
      { label: "Wishlist", to: "/wishlist" },
    ],
  },
];

const Footer = () => {
  const { supportPhone, supportEmail, supportHours } = useSelector((state) => state.store.config);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post("/subscribe", { email: email.trim().toLowerCase() });
      setCouponCode(data.couponCode);
      toast.success("You're on the list!");
      setEmail("");
    } catch (error) {
      if (error.response?.status === 409) {
        setCouponCode(error.response.data.couponCode);
        toast.info("You're already subscribed");
      } else {
        toast.error(error.response?.data?.message || "Subscription failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-24 bg-cream">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Link to="/" className="font-display text-3xl font-semibold">
            Nowhere
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
            Modern essentials for men and women, made in Pakistan. Join the list for new drops and{" "}
            <span className="font-semibold text-ink">10% off your first order</span>.
          </p>

          {couponCode ? (
            <div className="mt-6 max-w-sm rounded-2xl border border-stone-300 bg-white p-4 text-sm">
              Your code: <span className="ml-1 rounded-md bg-ink px-2 py-1 font-mono text-xs font-semibold tracking-widest text-white">{couponCode}</span>
              <p className="mt-2 text-xs text-ink-muted">Use it at checkout on your first order.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-6 flex max-w-sm overflow-hidden rounded-full border border-stone-300 bg-white focus-within:border-ink">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent px-5 py-3 text-sm focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                required
              />
              <button type="submit" disabled={loading} className="m-1 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:opacity-60">
                {loading ? "..." : "Join"}
              </button>
            </form>
          )}

          <div className="mt-8 flex items-center gap-3">
            {[
              { href: "https://www.facebook.com", icon: TbBrandMeta, label: "Facebook" },
              { href: "https://www.instagram.com", icon: IoLogoInstagram, label: "Instagram" },
              { href: "https://www.x.com", icon: RiTwitterXLine, label: "X (Twitter)" },
            ].map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-ink-soft transition hover:border-ink hover:text-ink">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-7">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="eyebrow mb-4 text-ink">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-ink-soft transition hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="eyebrow mb-4 text-ink">Contact</h3>
            <ul className="space-y-3 text-sm text-ink-soft">
              <li>
                <a href={`tel:${supportPhone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-ink">
                  <FiPhoneCall className="h-4 w-4" /> {supportPhone}
                </a>
              </li>
              <li>
                <a href={`mailto:${supportEmail}`} className="flex items-center gap-2 break-all hover:text-ink">
                  <FiMail className="h-4 w-4 flex-shrink-0" /> {supportEmail}
                </a>
              </li>
              {supportHours && <li className="text-xs text-ink-muted">{supportHours}</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-300/70">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Nowhere, SIA PVT LTD. All rights reserved.</p>
          <p>Cash on delivery · Free delivery over Rs. 5,000 · 30-day returns</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
