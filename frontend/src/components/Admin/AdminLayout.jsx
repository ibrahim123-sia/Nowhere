import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [isSliderOpen,setisSliderOpen]=useState(false);

    const toggleSidebar=()=>{
        setisSliderOpen(!isSliderOpen)
    }
  return (
    <div className='min-h-screen flex flex-col md:flex-row relative'> 
  {/* Mobile toggle button */}
  <div className='flex md:hidden p-4 bg-gray-900 text-white z-20 items-center'>
    <button onClick={toggleSidebar}>
      <FaBars size={24}/>
    </button>
    <h1 className='ml-4 text-xl font-medium'>Admin Dashboard</h1>
  </div>

  {/* Overlay when sidebar is open */}
  {isSliderOpen && (
    <div
      className='fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden'
      onClick={toggleSidebar}
    ></div>
  )}

  {/* Sidebar */}
  <div className={`bg-gray-900 w-64 text-white absolute md:relative transform 
    ${isSliderOpen ? "translate-x-0" : "-translate-x-full"} 
    transition-transform duration-300 md:translate-x-0 md:static md:block z-20 
    min-h-screen overflow-y-auto`}>
    <AdminSidebar />
  </div>

  {/* Main Content */}
  <div className='flex-grow p-6 overflow-auto '>
  <Outlet/>
</div>
  
</div>

  )
}

export default AdminLayout
