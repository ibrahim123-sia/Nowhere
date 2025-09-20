import React from 'react'
import { Link } from 'react-router-dom'
import feature from '../../assets/featured.webp'

const FeaturedCollection = () => {
  return (
    <section className='py-16 md:py-24 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl overflow-hidden shadow-lg'>
        {/* Text Content */}
        <div className='lg:w-1/2 p-8 md:p-12 lg:p-16 text-center lg:text-left'>
          <span className='inline-block text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3'>
            Comfort & Style
          </span>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
            Apparel Designed for <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'>Everyday Life</span>
          </h2>
          <p className='text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0'>
            Discover our premium collection crafted for effortless style and all-day comfort. 
            Perfect for work, weekends, and everything in between.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
            <Link 
              to="/collections/all" 
              className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-lg'
            >
              Shop Collection
            </Link>
            <Link 
              to="/collections/new-arrivals" 
              className='border-2 border-gray-300 hover:border-indigo-400 text-gray-800 hover:text-indigo-700 px-8 py-3 rounded-lg font-medium transition-all duration-300 text-lg'
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Image Content */}
        <div className='lg:w-1/2 h-full'>
          <img 
            src={feature} 
            alt="Featured Collection - Everyday Apparel" 
            className='w-full h-full max-h-[500px] object-cover object-center lg:rounded-r-3xl'
            loading='lazy'
          />
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection