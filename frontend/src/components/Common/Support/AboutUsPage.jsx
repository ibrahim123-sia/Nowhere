import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h1>
        <div className="w-24 h-1 bg-gray-800 mx-auto"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who We Are</h2>
          <p className="text-gray-600 mb-6">
            Founded in 2025, SIA is a premium fashion destination committed to delivering 
            exceptional quality and timeless style. We believe fashion should be sustainable, 
            accessible, and make you feel confident.
          </p>
          <p className="text-gray-600">
            Our collections are carefully curated by industry experts to bring you the latest 
            trends while maintaining classic elegance. Each piece is designed with attention 
            to detail and crafted from premium materials.
          </p>
        </div>
        <div className="bg-gray-100 h-80 rounded-lg overflow-hidden">
          {/* Replace with your actual about image */}
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">About Us Image</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-4xl text-gray-800 mb-4">✓</div>
          <h3 className="text-xl font-medium text-gray-800 mb-3">Our Mission</h3>
          <p className="text-gray-600">
            To redefine fashion retail by offering high-quality, sustainable clothing that 
            doesn't compromise on style or ethics.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-4xl text-gray-800 mb-4">♻</div>
          <h3 className="text-xl font-medium text-gray-800 mb-3">Sustainability</h3>
          <p className="text-gray-600">
            We're committed to eco-friendly practices, from sourcing materials to packaging, 
            reducing our environmental footprint.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-4xl text-gray-800 mb-4">❤</div>
          <h3 className="text-xl font-medium text-gray-800 mb-3">Customer First</h3>
          <p className="text-gray-600">
            Your satisfaction is our priority. We offer personalized service and stand behind 
            every product we sell.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Meet The Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="text-center">
              <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full mb-4 overflow-hidden">
                {/* Team member image */}
              </div>
              <h4 className="font-medium text-gray-800">Team Member {item}</h4>
              <p className="text-sm text-gray-500">Position/Role</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;