import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

   useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn === 'true') {
        setIsAuthenticated(true);
    }
    setIsAuthChecked(true);
}, [location]);


    const toggleSidebar = () => {
        setIsSliderOpen(!isSliderOpen);
    };

    if (!isAuthChecked) return null; // Don't render layout until check is complete

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row relative">
            <div className="flex md:hidden p-4 bg-gray-900 text-white z-20 items-center">
                <button onClick={toggleSidebar}>
                    <FaBars size={24} />
                </button>
                <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
            </div>

            {isSliderOpen && (
                <div
                    className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            <div
                className={`bg-gray-900 w-64 min-h-screen text-white absolute md:relative transform 
                    ${isSliderOpen ? 'translate-x-0' : '-translate-x-full'} 
                    transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}
            >
                <AdminSidebar />
            </div>

            {/* main content */}
            <div className="flex-grow p-6 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
