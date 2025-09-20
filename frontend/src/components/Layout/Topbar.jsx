import React from 'react'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'

const Topbar = () => {
  return (
    <div className='bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 text-white shadow-sm'>
      <div className='container mx-auto flex justify-between items-center px-4 py-2'>
        {/* Social Icons */}
        <div className='hidden md:flex items-center space-x-4'>
          <a 
            href="https://www.facebook.com" 
            target="_blank"
            rel="noopener noreferrer"
            className='hover:text-indigo-300 transition-colors duration-200'
            aria-label="Facebook"
          >
            <TbBrandMeta className='h-5 w-5'/>
          </a>
          <a 
            href="https://www.Instagram.com" 
            target="_blank"
            rel="noopener noreferrer"
            className='hover:text-pink-300 transition-colors duration-200'
            aria-label="Instagram"
          >
            <IoLogoInstagram className='h-5 w-5'/>
          </a>
          <a 
            href="https://www.Twitter.com"  
            target="_blank"
            rel="noopener noreferrer"
            className='hover:text-blue-300 transition-colors duration-200'
            aria-label="Twitter"
          >
            <RiTwitterXLine className='h-4 w-4'/>
          </a> 
        </div>

        {/* Announcement Text */}
        <div className='text-xs md:text-sm text-center flex-grow font-medium tracking-wider'>
          <span className='inline-block px-2 py-1 bg-white/10 rounded-md backdrop-blur-sm'>
            ✈️ Worldwide Shipping • 🚚 Fast & Reliable Delivery • 🔄 Easy Returns
          </span>
        </div>

        {/* Contact Number */}
        <div className='text-xs md:text-sm hidden md:block'>
          <a 
            href="tel:+92-3122287869" 
            className='flex items-center hover:text-indigo-300 transition-colors duration-200'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +92 312 2287869
          </a>
        </div>
      </div>
    </div>
  )
}

export default Topbar