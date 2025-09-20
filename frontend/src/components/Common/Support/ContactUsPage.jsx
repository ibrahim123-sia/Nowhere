import React from 'react';

const ContactUsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions or feedback? We're here to help! Reach out to our team and we'll get back to you promptly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Send Us a Message</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Select a subject</option>
                <option value="order">Order Inquiry</option>
                <option value="return">Returns & Exchanges</option>
                <option value="product">Product Question</option>
                <option value="feedback">Feedback</option>
                <option value="wholesale">Wholesale Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Our Location</h4>
                  <p className="text-gray-600 mt-1">123 Fashion Avenue<br />Style District, Karachi<br />Pakistan</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Phone</h4>
                  <p className="text-gray-600 mt-1">
                    <a href="tel:+923122287869" className="hover:text-indigo-600 transition-colors">+92 312 2287869</a><br />
                    Customer Support: Mon-Fri, 9AM-6PM
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600 mt-1">
                    <a href="mailto:support@nowhere.com" className="hover:text-indigo-600 transition-colors">support@nowhere.com</a><br />
                    <a href="mailto:info@nowhere.com" className="hover:text-indigo-600 transition-colors">info@nowhere.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Business Hours</h3>
            <ul className="space-y-4">
              {[
                { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                { day: 'Sunday', hours: 'Closed' }
              ].map((item, index) => (
                <li key={index} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <span className="font-medium text-gray-700">{item.day}</span>
                  <span className="text-gray-600">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Location</h3>
        <div className="bg-gray-100 h-80 rounded-lg overflow-hidden flex items-center justify-center">
          {/* Replace with your actual map embed */}
          <div className="text-center p-6">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-500">Map of our location would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;