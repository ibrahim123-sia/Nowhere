import React from "react";
import { FiBox, FiClipboard, FiGrid, FiLogOut, FiShoppingBag, FiUsers } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/orders", label: "Orders", icon: FiClipboard },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/users", label: "Customers", icon: FiUsers },
];

const AdminSidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
      isActive ? "bg-white text-ink" : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex h-full flex-col p-5">
      <Link to="/admin" className="px-2 font-display text-2xl font-semibold text-white">
        Nowhere <span className="ml-1 align-middle font-sans text-[10px] font-semibold uppercase tracking-widest text-white/50">Admin</span>
      </Link>

      <nav className="mt-10 flex flex-col gap-1" onClick={onNavigate}>
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClass}>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
        <NavLink to="/" className={linkClass}>
          <FiShoppingBag className="h-4 w-4" />
          View store
        </NavLink>
      </nav>

      <div className="mt-auto border-t border-white/10 pt-5">
        <p className="px-2 text-sm font-medium text-white">{user?.name}</p>
        <p className="truncate px-2 text-xs text-white/50">{user?.email}</p>
        <button onClick={handleLogout} className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white">
          <FiLogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
