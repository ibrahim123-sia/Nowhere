import React, { useEffect } from "react";
import MyOrdersPage from "./MyOrdersPage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  // CSS classes based on your reference files
  const pageWrapper = "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8";
  const sidebarWrapper = "w-full bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100 h-fit";
  const buttonDanger = "w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg";

  return (
    <div className={pageWrapper}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - User Info */}
          <div className="w-full lg:w-1/4">
            <div className={sidebarWrapper}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-indigo-800 mb-2">{user?.name}</h1>
                <p className="text-gray-600">{user?.email}</p>
                {user?.role === "admin" && (
                  <span className="inline-block mt-2 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-6">
                <button
                  onClick={() => navigate("/collections/all")}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg"
                >
                  Continue Shopping
                </button>
                
                <button
                  onClick={handleLogout}
                  className={buttonDanger}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Right section - Orders */}
          <div className="w-full lg:w-3/4">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;