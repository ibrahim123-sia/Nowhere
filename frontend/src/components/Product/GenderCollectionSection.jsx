import React from 'react'
import { Link } from 'react-router-dom'
import MenCollectionImage from '../../assets/mens-collection.webp'
import WomenCollectionImage from '../../assets/womens-collection.webp'

const GenderCollectionSection = () => {
  return (
    <section className='py-16 md:py-24 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
          {/* Women's Collection */}
          <div className='relative group overflow-hidden rounded-xl'>
            <img 
              src={WomenCollectionImage} 
              alt="Women's Collection" 
              className='w-full h-[500px] md:h-[600px] object-cover transition-transform duration-500 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent' />
            <div className='absolute bottom-8 left-8 right-8'>
              <div className='bg-white/90 backdrop-blur-sm p-6 rounded-lg max-w-xs transition-all duration-300 group-hover:bg-white'>
                <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>Women's Collection</h2>
                <Link 
                  to='/collections/all?gender=Women' 
                  className='inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200'
                >
                  Shop Now
                  <svg 
                    className='ml-2 h-4 w-4' 
                    fill='none' 
                    viewBox='0 0 24 24' 
                    stroke='currentColor'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Men's Collection */}
          <div className='relative group overflow-hidden rounded-xl'>
            <img 
              src={MenCollectionImage} 
              alt="Men's Collection" 
              className='w-full h-[500px] md:h-[600px] object-cover transition-transform duration-500 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent' />
            <div className='absolute bottom-8 left-8 right-8'>
              <div className='bg-white/90 backdrop-blur-sm p-6 rounded-lg max-w-xs transition-all duration-300 group-hover:bg-white'>
                <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>Men's Collection</h2>
                <Link 
                  to='/collections/all?gender=men' 
                  className='inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200'
                >
                  Shop Now
                  <svg 
                    className='ml-2 h-4 w-4' 
                    fill='none' 
                    viewBox='0 0 24 24' 
                    stroke='currentColor'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GenderCollectionSection