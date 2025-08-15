import React from 'react';

const FeaturesPage = () => {
  const features = [
    {
      title: "Premium Quality",
      description: "All our products are crafted from the finest materials to ensure durability and comfort.",
      icon: "✓"
    },
    {
      title: "Sustainable Fashion",
      description: "We're committed to eco-friendly practices and sustainable production methods.",
      icon: "♻"
    },
    {
      title: "Fast Shipping",
      description: "Enjoy quick delivery with our reliable shipping partners across Pakistan.",
      icon: "🚚"
    },
    {
      title: "Easy Returns",
      description: "30-day hassle-free return policy on all regular-priced items.",
      icon: "🔄"
    },
    {
      title: "Secure Payments",
      description: "Your transactions are protected with industry-standard security measures.",
      icon: "🔒"
    },
    {
      title: "24/7 Support",
      description: "Our customer service team is always ready to assist you.",
      icon: "📞"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover what makes our brand stand out in the fashion industry
        </p>
        <div className="w-24 h-1 bg-gray-800 mx-auto mt-4"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl text-gray-800 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-medium text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-8 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Commitment to Excellence</h2>
          <p className="text-gray-600 mb-6">
            At SIA, we don't just sell clothes - we deliver experiences. Each collection is thoughtfully designed 
            to blend contemporary trends with timeless elegance. Our team of fashion experts works tirelessly to 
            ensure every piece meets our high standards of quality and style.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/collections/all"
              className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </a>
            <a
              href="/about"
              className="inline-block border border-black text-black px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;