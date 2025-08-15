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
    <footer className='border-t py-12'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>
        {/* Newsletter Column - Maintains original design */}
        <div>
          <h3 className='text-lg text-gray-800 mb-4'>Newsletter</h3>
          <p className='text-gray-500 mb-4 text-sm'>
            Be the first to hear about new products, exclusive events, and online offer.
          </p>
          <p className='font-medium text-sm text-gray-600 mb-6'>
            sign up and get 10% off on your first order.
          </p>
          
          {alreadySubscribed ? (
            <p className="text-sm text-gray-600">
              You're already subscribed. Thank you!
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className='flex'>
              <input
                type="email"
                placeholder='enter your email'
                className='p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type='submit'
                className='bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all disabled:opacity-70'
                disabled={loading}
              >
                {loading ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>

        {/* Shop Column - Original content */}
        <div>
          <h3 className='text-lg text-gray-800 mb-4'>Shop</h3>
          <ul className='space-y-2 text-gray-600'>
            <li>
              <Link to="/collections/all?gender=Men&&category=Top Wear" className="hover:text-gray-500 text-sm">
                Men's top Wear
              </Link>
            </li>
            <li>
              <Link to="/collections/all?gender=Women&&category=Top Wear" className="hover:text-gray-500 text-sm">
                Women's top Wear
              </Link>
            </li>
            <li>
              <Link to="/collections/all?gender=Men&&category=Bottom Wear" className="hover:text-gray-500 text-sm">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link to="/collections/all?gender=Women&&category=Bottom Wear" className="hover:text-gray-500 text-sm">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Column - Original content */}
        <div>
          <h3 className='text-lg text-gray-800 mb-4'>Support</h3>
          <ul className='space-y-2 text-gray-600'>
            <li>
              <Link to="/contact" className="hover:text-gray-500 text-sm">Contact us</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-500 text-sm">About us</Link>
            </li>
            <li>
              <Link to="/faqs" className="hover:text-gray-500 text-sm">FAQs</Link>
            </li>
            <li>
              <Link to="features" className="hover:text-gray-500 text-sm">Features</Link>
            </li>
          </ul>
        </div>

        {/* Follow Us Column - Original design */}
        <div>
          <h3 className='text-lg text-gray-800 mb-4'>Follow us</h3>
          <div className='flex items-center space-x-4 mb-6'>
            <a href="https://www.facebook.com" target='_blank' rel='noopener noreferrer'
              className='hover:text-gray-600'>
              <TbBrandMeta className='h-5 w-5'/>
            </a>
            <a href="https://www.Instagram.com" target='_blank' rel='noopener noreferrer'
              className='hover:text-gray-600'>
              <IoLogoInstagram className='h-5 w-5'/>
            </a>
            <a href="https://www.Twitter.com" target='_blank' rel='noopener noreferrer'
              className='hover:text-gray-600'>
              <RiTwitterXLine className='h-4 w-4'/>
            </a>
          </div>
          <p className='text-gray-500 text-sm'>Call us</p>
          <p className='text-sm'>
            <FiPhoneCall className='inline-block mr-2'/>
            +92 3122287869
          </p>
        </div>
      </div>

      {/* Copyright - Original design */}
      <div className='container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-600 pt-6'>
        <p className='text-gray-500 text-sm tracking-tighter text-center'>
          2025, SIA PVT LTD. All Right Reserve.
        </p>
      </div>
    </footer>
  )
}

export default Footer