import React from 'react'
import {TbBrandMeta} from 'react-icons/tb'
import {IoLogoInstagram} from 'react-icons/io'
import {RiTwitterXLine } from 'react-icons/ri'
const Topbar = () => {
  return (
    <div className='bg-rabbit-red text-white'>
      <div className='container mx-auto flex justify-between items-center px-4 py-2'>
        <div className='hidden md:flex items-center space-x-4'>
            <a href="#" className='hover:text-gray-300'>
                <TbBrandMeta className='h-5 w-5'/>
            </a>
            <a href="#" className='hover:text-gray-300'>
                <IoLogoInstagram className='h-5 w-5'/>
            </a>
            <a href="#" className='hover:text-gray-300'>
                <RiTwitterXLine className='h-4 w-4'/>
            </a> 
        </div>
        <div className='text-sm text-center flex-grow'>
            <span>we ship Worldwide - fast and reliable shipping!</span>
        </div>
        <div className='text-sm hidden md:block'>
            <a href="tel:+92-3122287869" className='hover:text-gray-300'>03122287869</a>
        </div>
      </div>
    </div>
  )
}

export default Topbar
