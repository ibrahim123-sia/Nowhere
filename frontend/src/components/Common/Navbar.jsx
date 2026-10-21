import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomLeft, HiOutlineHeart } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { openCartDrawer } from "../../redux/slices/cartSlice";

const NAV_LINKS = [
  { label: "New In", to: "/collections/new-arrivals" },
  { label: "Men", to: "/collections/all?gender=Men" },
  { label: "Women", to: "/collections/all?gender=Women" },
  { label: "Tops", to: "/collections/all?category=Top Wear" },
  { label: "Bottoms", to: "/collections/all?category=Bottom Wear" },
  { label: "Sale", to: "/collections/sale", accent: true },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  useEffect(() => {
    setNavDrawerOpen(false);
  }, [location]);

  const isActive = (to) => decodeURIComponent(`${location.pathname}${location.search}`) === to;

  const iconButton = "relative flex items-center justify-center rounded-full p-2 text-ink-soft transition hover:bg-stone-100 hover:text-ink";

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2 lg:w-48">
            <button onClick={() => setNavDrawerOpen(true)} className={`${iconButton} lg:hidden`} aria-label="Open menu">
              <HiBars3BottomLeft className="h-6 w-6" />
            </button>
            <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
              Nowhere
            </Link>
          </div>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={() =>
                  `relative text-[13px] font-medium tracking-wide transition hover:text-ink ${
                    link.accent ? "text-sale" : isActive(link.to) ? "text-ink" : "text-ink-soft"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center justify-end gap-0.5 sm:gap-1 lg:w-48">
            {user?.role === "admin" && (
              <Link to="/admin" className="mr-1 hidden rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold hover:border-ink sm:inline-flex">
                Admin
              </Link>
            )}
            <SearchBar />
            <Link to="/wishlist" className={`${iconButton} hidden sm:flex`} aria-label="Wishlist">
              <HiOutlineHeart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to={user ? "/profile" : "/login"} className={iconButton} aria-label={user ? "My account" : "Sign in"}>
              <HiOutlineUser className="h-5 w-5" />
            </Link>
            <button onClick={() => dispatch(openCartDrawer())} className={iconButton} aria-label={`Open cart, ${cartItemCount} items`}>
              <HiOutlineShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer />

      {/* Mobile navigation drawer */}
      <div
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity duration-300 lg:hidden ${navDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setNavDrawerOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-lift transition-transform duration-300 lg:hidden ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!navDrawerOpen}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <span className="font-display text-2xl font-semibold">Nowhere</span>
          <button onClick={() => setNavDrawerOpen(false)} className={iconButton} aria-label="Close menu">
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`block rounded-xl px-4 py-3 text-lg font-medium hover:bg-stone-100 ${link.accent ? "text-sale" : "text-ink"}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="my-4 border-t border-stone-200" />
          <Link to="/wishlist" className="block rounded-xl px-4 py-3 text-sm text-ink-soft hover:bg-stone-100">
            Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
          </Link>
          <Link to="/track-order" className="block rounded-xl px-4 py-3 text-sm text-ink-soft hover:bg-stone-100">
            Track an order
          </Link>
          <Link to={user ? "/profile" : "/login"} className="block rounded-xl px-4 py-3 text-sm text-ink-soft hover:bg-stone-100">
            {user ? "My account" : "Sign in / Create account"}
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="block rounded-xl px-4 py-3 text-sm font-semibold text-ink hover:bg-stone-100">
              Admin dashboard
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
