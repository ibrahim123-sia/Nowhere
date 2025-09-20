import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h1>
        <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-8 rounded-full"></div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Crafting exceptional fashion experiences since 2025. Our journey began with a simple vision - 
          to redefine modern style with sustainability at its core.
        </p>
      </div>

      {/* Who We Are Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Who We Are</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Founded in 2025, SIA is a premium fashion destination committed to delivering 
            exceptional quality and timeless style. We believe fashion should be sustainable, 
            accessible, and make you feel confident every day.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Our collections are carefully curated by industry experts to bring you the latest 
            trends while maintaining classic elegance. Each piece is designed with meticulous 
            attention to detail and crafted from premium, responsibly-sourced materials.
          </p>
          <Link 
            to="/collections/all" 
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-md font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md"
          >
            Explore Our Collections
          </Link>
        </div>
        <div className="order-1 md:order-2 bg-gray-100 h-96 rounded-xl overflow-hidden shadow-lg">
          {/* Replace with your actual about image */}
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <span className="text-gray-500 text-lg">About Us Image</span>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="text-indigo-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
          <p className="text-gray-600 leading-relaxed">
            To revolutionize fashion retail by offering high-quality, sustainable clothing that 
            blends contemporary style with ethical production practices.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Sustainability</h3>
          <p className="text-gray-600 leading-relaxed">
            Committed to eco-friendly practices throughout our supply chain, from organic materials 
            to biodegradable packaging, minimizing our environmental impact.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="text-pink-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer First</h3>
          <p className="text-gray-600 leading-relaxed">
            Your satisfaction drives us. We offer personalized styling advice, easy returns, 
            and quality guarantees on all our products.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-12 rounded-2xl mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Meet The Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Alex Johnson", role: "Founder & CEO" },
            { name: "Sarah Williams", role: "Creative Director" },
            { name: "Michael Chen", role: "Head of Sustainability" },
            { name: "Emma Davis", role: "Customer Experience" }
          ].map((member, index) => (
            <div key={index} className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-40 h-40 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6 overflow-hidden flex items-center justify-center">
                {/* Team member image */}
                <span className="text-gray-400 text-xl">{member.name.charAt(0)}</span>
              </div>
              <h4 className="font-semibold text-gray-800 text-lg mb-1">{member.name}</h4>
              <p className="text-indigo-600 text-sm font-medium">{member.role}</p>
              <div className="flex justify-center space-x-3 mt-4">
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience Our Collection?</h2>
        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who have discovered the perfect blend of style, comfort, and sustainability.
        </p>
        <Link 
          to="/collections/all" 
          className="inline-block bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default AboutUsPage;