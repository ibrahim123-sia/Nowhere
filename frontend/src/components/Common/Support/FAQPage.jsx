import React, { useState } from 'react';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All transactions are securely processed."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for faster delivery (1-2 business days). International shipping times vary by destination."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unworn, unwashed items with original tags attached. Sale items are final sale unless defective. Please see our Returns page for complete details."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide. Shipping costs and delivery times vary by country. Duties and taxes may apply depending on your location."
    },
    {
      question: "How do I contact customer service?",
      answer: "Our customer service team is available via email at support@example.com or by phone at +92 3122287869 during business hours (9AM-5PM, Monday-Friday)."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Can't find what you're looking for? <a href="/contact" className="text-gray-800 underline">Contact us</a> directly.
        </p>
        <div className="w-24 h-1 bg-gray-800 mx-auto mt-4"></div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full text-left py-4 focus:outline-none"
            >
              <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeIndex === index && (
              <div className="mt-2 text-gray-600">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-medium text-gray-800 mb-4">Still have questions?</h3>
        <p className="text-gray-600 mb-4">
          We're here to help! Contact our customer support team for assistance.
        </p>
        <a
          href="/contact"
          className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default FAQPage;