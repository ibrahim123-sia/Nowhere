import React from "react";
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice"
import { clearCart } from "../../redux/slices/cartSlice"

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  // Theme variables based on reference files
  const sidebarWrapper = "p-6 bg-gradient-to-br from-white to-gray-50 h-full border-r border-gray-100";
  const navLinkActive = "bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg flex items-center space-x-2 shadow-sm";
  const navLinkInactive = "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 py-3 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200";
  const logoutButton = "w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200";

  return (
    <div className={sidebarWrapper}>
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-bold text-indigo-800">
          Nowhere
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

      <nav className="flex flex-col space-y-3">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? navLinkActive : navLinkInactive
          }
        >
          <FaUser className="w-4 h-4" />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive ? navLinkActive : navLinkInactive
          }
        >
          <FaBoxOpen className="w-4 h-4" />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? navLinkActive : navLinkInactive
          }
        >
          <FaClipboardList className="w-4 h-4" />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? navLinkActive : navLinkInactive
          }
        >
          <FaStore className="w-4 h-4" />
          <span>Shop</span>
        </NavLink>
      </nav>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          className={logoutButton}
        >
          <FaSignOutAlt className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;