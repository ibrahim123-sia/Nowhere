import React from 'react'
import { Link } from 'react-router-dom'
import feature from '../../assets/featured.webp'
const FeaturedCollection = () => {
  return (
    <section className='py-16 px-4 lg:px-0'>
        <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-50 rounded-3xl'>

            <div className='lg:w-1/2 p-9 text-center lg:text-left'>
                <h2 className='text-lg font-semibold text-gray-700 mb-2'>Conform and style</h2>
                <h2 className='text-4xl lg:text-5xl font-bold mb-6'>Apparel made for everyday life </h2>
                <p className='text-lg text-gray-600 mb-6'>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos praesentium
                     iste ab veritatis aut, doloribus cumque, sequi numquam quae possimus esse    
                </p>
                <Link to="/collection/all" className='bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800'>Shop Now</Link>
            </div>
            <div className='lg:w-1/2'>
            <img src={feature} alt="Featured Collection"
             className='w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl'   
            />
            </div>
        </div>
    </section>
  )
}

export default FeaturedCollection
