import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { FiPhoneCall } from 'react-icons/fi'
import { toast } from 'react-toastify'
import axios from 'axios'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [alreadySubscribed, setAlreadySubscribed] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Email is required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`, 
        { email: email.trim().toLowerCase() }
      )

      if (response.data.alreadySubscribed) {
        setAlreadySubscribed(true)
        toast.info('This email is already subscribed')
      } else {
        toast.success('Thank you for subscribing!')
        setEmail('')
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setAlreadySubscribed(true)
        toast.info('You are already subscribed')
      } else {
        toast.error(error.response?.data?.message || 'Subscription failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className='bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 py-12'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>
        {/* Newsletter Column */}
        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Join Our Newsletter</h3>
          <p className='text-gray-600 mb-4 text-sm'>
            Be the first to hear about new products, exclusive events, and special offers.
          </p>
          <p className='font-medium text-sm text-indigo-600 mb-6'>
            Sign up and get 10% off your first order
          </p>
          
          {alreadySubscribed ? (
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-md text-sm">
              You're subscribed! Thank you for joining us.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className='flex'>
              <input
                type="email"
                placeholder='Your email address'
                className='p-3 w-full text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type='submit'
                className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 text-sm font-medium rounded-r-md hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-70 flex-shrink-0'
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white mx-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Subscribe'}
              </button>
            </form>
          )}
        </div>

        {/* Shop Column */}
        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Shop</h3>
          <ul className='space-y-3 text-gray-600'>
            <li>
              <Link 
                to="/collections/all?gender=Men&&category=Top Wear" 
                className="hover:text-indigo-600 text-sm transition-colors duration-200 block"
              >
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link 
                to="/collections/all?gender=Women&&category=Top Wear" 
                className="hover:text-indigo-600 text-sm transition-colors duration-200 block"
              >
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link 
                to="/collections/all?gender=Men&&category=Bottom Wear" 
                className="hover:text-indigo-600 text-sm transition-colors duration-200 block"
              >
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link 
                to="/collections/all?gender=Women&&category=Bottom Wear" 
                className="hover:text-indigo-600 text-sm transition-colors duration-200 block"
              >
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Support</h3>
          <ul className='space-y-3 text-gray-600'>
            <li>
              <Link 
                to="/contact" 
                className="hover:text-indigo-600 text-sm transition-colors duration-200 block"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className="hover:text-indigo-600 text-sm transition-colors duration-200 block"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                to="/faqs" 
                className="hover:text-indigo-600 text-sm transition-colors duration-200 block"
              >
                FAQs
              </Link>
            </li>
            <li>
              <Link 
                to="/features" 
                className="hover:text-indigo-600 text-sm transition-colors duration-200 block"
              >
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us Column */}
        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Connect With Us</h3>
          <div className='flex items-center space-x-4 mb-6'>
            <a 
              href="https://www.facebook.com" 
              target='_blank' 
              rel='noopener noreferrer'
              className='hover:text-indigo-600 text-gray-600 transition-colors duration-200'
              aria-label="Facebook"
            >
              <TbBrandMeta className='h-5 w-5'/>
            </a>
            <a 
              href="https://www.Instagram.com" 
              target='_blank' 
              rel='noopener noreferrer'
              className='hover:text-pink-500 text-gray-600 transition-colors duration-200'
              aria-label="Instagram"
            >
              <IoLogoInstagram className='h-5 w-5'/>
            </a>
            <a 
              href="https://www.Twitter.com" 
              target='_blank' 
              rel='noopener noreferrer'
              className='hover:text-blue-400 text-gray-600 transition-colors duration-200'
              aria-label="Twitter"
            >
              <RiTwitterXLine className='h-4 w-4'/>
            </a>
          </div>
          <div className='flex items-center text-gray-600'>
            <FiPhoneCall className='mr-2 text-indigo-600'/>
            <a 
              href="tel:+92-3122287869" 
              className='text-sm hover:text-indigo-600 transition-colors duration-200'
            >
              +92 312 2287869
            </a>
          </div>
          <p className='text-gray-500 text-sm mt-2'>Mon-Fri: 9AM - 5PM</p>
        </div>
      </div>

      {/* Copyright */}
      <div className='container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6'>
        <p className='text-gray-500 text-sm text-center'>
          © {new Date().getFullYear()} Nowhere, SIA PVT LTD. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer