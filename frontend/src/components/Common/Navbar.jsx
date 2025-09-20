import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [drawerOpen, setdrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const cartItemCount = cart?.products?.reduce(
    (total, product) => total + product.quantity,
    0 || 0
  );

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };
  const toggleCartDrawer = () => {
    setdrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div>
            <Link to="/" className="text-2xl font-bold text-indigo-800">
              Nowhere
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link
              to="/collections/all?gender=Men"
              className="text-gray-600 hover:text-indigo-700 text-sm font-medium uppercase transition-colors duration-200"
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-600 hover:text-indigo-700 text-sm font-medium uppercase transition-colors duration-200"
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              className="text-gray-600 hover:text-indigo-700 text-sm font-medium uppercase transition-colors duration-200"
            >
              Top wear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              className="text-gray-600 hover:text-indigo-700 text-sm font-medium uppercase transition-colors duration-200"
            >
              Bottom wear
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="hidden md:block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3 py-1 rounded-md text-sm font-medium shadow-sm transition-all duration-200"
              >
                Admin
              </Link>
            )}
            
            <div className="hidden md:block w-64">
              <SearchBar />
            </div>
            
            <Link 
              to="/profile" 
              className="text-gray-600 hover:text-indigo-700 transition-colors duration-200"
            >
              <HiOutlineUser className="w-6 h-6" />
            </Link>
            
            <button
              onClick={toggleCartDrawer}
              className="relative text-gray-600 hover:text-indigo-700 transition-colors duration-200"
            >
              <HiOutlineShoppingBag className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={toggleNavDrawer} 
              className="md:hidden text-gray-600 hover:text-indigo-700"
            >
              <HiBars3BottomRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
      
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
      
      {/* Mobile navigation drawer */}
      <div
        className={`fixed top-0 left-0 w-4/5 sm:w-2/3 md:w-1/3 h-full bg-white shadow-xl
        transform transition-all duration-300 ease-in-out z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-indigo-800">Menu</h3>
          <button 
            onClick={toggleNavDrawer}
            className="text-gray-500 hover:text-indigo-700"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <SearchBar />
          </div>
          
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              onClick={toggleNavDrawer}
              className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium mb-6 text-center shadow-sm"
            >
              Admin Dashboard
            </Link>
          )}
          
          <nav className="space-y-4">
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block px-4 py-2 text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200"
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block px-4 py-2 text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200"
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="block px-4 py-2 text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200"
            >
              Top Wear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="block px-4 py-2 text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200"
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Overlay when mobile nav is open */}
      {navDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleNavDrawer}
        />
      )}
    </>
  );
};

export default Navbar;