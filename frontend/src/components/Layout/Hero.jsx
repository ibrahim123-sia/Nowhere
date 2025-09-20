import React from 'react'
import HeroImg from '../../assets/rabbit-hero.jpg'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Image with Gradient Overlay */}
      <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px]">
        <img 
          src={HeroImg} 
          alt="Vacation Ready Fashion" 
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">Vacation</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
              Ready
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Discover our premium vacation collection designed for comfort and style. 
            Fast worldwide shipping and easy returns.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/collections/vacation" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
            >
              Shop Collection
            </Link>
            <Link 
              to="/collections/new-arrivals" 
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 border border-white/20 hover:border-white/30 text-lg backdrop-blur-sm"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator (Optional) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default Hero