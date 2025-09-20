import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All transactions are securely processed through our PCI-compliant payment gateway."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for next-day delivery (order by 2PM local time). International shipping times vary by destination but generally take 7-14 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unworn, unwashed items with original tags attached. Sale items are final sale unless defective. Returns are processed within 3-5 business days of receipt at our warehouse."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account on our website. For real-time updates, use the tracking number with the carrier's website."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 100 countries worldwide. Shipping costs are calculated at checkout based on destination and package weight. Customers are responsible for any customs duties, taxes, or import fees that may apply."
    },
    {
      question: "How do I contact customer service?",
      answer: "Our customer service team is available via email at support@nowhere.com, by phone at +92 312 2287869 (9AM-6PM GMT+5, Monday-Friday), or through our live chat feature during business hours. Average response time is under 2 hours during open hours."
    },
    {
      question: "What sizes do you offer?",
      answer: "We offer sizes XS-XXL for most items, with some styles available in extended sizing. Each product page includes detailed size charts with measurements in both inches and centimeters to help you find the perfect fit."
    },
    {
      question: "Are your products ethically sourced?",
      answer: "Absolutely. We're committed to ethical manufacturing practices. All our partners meet strict standards for fair wages, safe working conditions, and environmental responsibility. Many of our fabrics are sustainably sourced, including organic cotton and recycled materials."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Quick answers to common questions. Can't find what you need? <Link to="/contact" className="text-indigo-600 hover:underline font-medium">Contact our team</Link> for personalized assistance.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4 mb-16">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 ${activeIndex === index ? 'shadow-md' : 'hover:shadow-sm'}`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full text-left p-6 focus:outline-none"
              aria-expanded={activeIndex === index}
              aria-controls={`faq-${index}`}
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 pr-4">{faq.question}</h3>
              <svg
                className={`w-6 h-6 text-indigo-600 transform transition-transform duration-200 flex-shrink-0 ${activeIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              id={`faq-${index}`}
              className={`px-6 pb-6 pt-0 text-gray-600 transition-all duration-300 ${activeIndex === index ? 'block' : 'hidden'}`}
            >
              <p className="leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 md:p-10 rounded-2xl text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Still have questions?</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Our customer support team is ready to help with any additional questions you may have about our products, policies, or services.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/contact"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Contact Support
          </Link>
          <a
            href="tel:+923122287869"
            className="bg-white text-gray-800 px-8 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Call Us Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;