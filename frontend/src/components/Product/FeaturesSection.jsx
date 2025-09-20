import React from 'react'
import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiTruck } from 'react-icons/hi2'

const FeaturesSection = () => {
  const features = [
    {
      icon: <HiArrowPathRoundedSquare className="h-8 w-8" />,
      title: "45 DAYS RETURN",
      description: "Hassle-free money back guarantee",
      color: "text-indigo-600"
    },
    {
      icon: <HiOutlineCreditCard className="h-8 w-8" />,
      title: "SECURE CHECKOUT",
      description: "100% protected payment process",
      color: "text-purple-600"
    },
    {
      icon: <HiTruck className="h-8 w-8" />,
      title: "FREE SHIPPING",
      description: "On all international orders over $100",
      color: "text-pink-600"
    }
  ]

  return (
    <section className='py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12'>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className='bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center'
            >
              <div className={`p-4 rounded-full mb-5 ${feature.color} bg-opacity-10`}>
                {feature.icon}
              </div>
              <h4 className='text-lg font-semibold text-gray-800 mb-3 tracking-normal'>
                {feature.title}
              </h4>
              <p className='text-gray-600 text-base'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection