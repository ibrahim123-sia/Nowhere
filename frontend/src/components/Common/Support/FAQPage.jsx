
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and cash on delivery. All online transactions are securely processed through our PCI-compliant payment gateway."
        },
        {
          question: "How long does shipping take?",
          answer: "Standard shipping typically takes 3-5 business days within Pakistan. Express shipping options are available at checkout for next-day delivery (order by 2PM local time). International shipping times vary by destination but generally take 7-14 business days."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we ship to over 50 countries worldwide including USA, UK, Canada, UAE, and Australia. Shipping costs are calculated at checkout based on destination and package weight. Customers are responsible for any customs duties, taxes, or import fees that may apply."
        },
        {
          question: "How do I track my order?",
          answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account on our website. For real-time updates, use the tracking number with the carrier's website. SMS tracking updates are also available for Pakistani orders."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for unworn, unwashed items with original tags attached. Sale items are final sale unless defective. Returns are processed within 3-5 business days of receipt at our warehouse. Refunds are issued to the original payment method."
        },
        {
          question: "How do I exchange an item?",
          answer: "Exchanges are easy! Contact our customer service team within 30 days of receiving your order. We'll help you exchange for a different size or color, subject to availability. If the exchange item costs more, you'll pay the difference; if it costs less, we'll refund the difference."
        },
        {
          question: "What if my item is damaged or defective?",
          answer: "We're sorry to hear that! Contact us immediately at support@nowhere.com with photos of the damaged item and your order number. We'll arrange a free return and send you a replacement or full refund, including return shipping costs."
        }
      ]
    },
    {
      category: "Products & Sizing",
      questions: [
        {
          question: "What sizes do you offer?",
          answer: "We offer sizes XS-XXL for most items, with some styles available in extended sizing up to 4XL. Each product page includes detailed size charts with measurements in both inches and centimeters to help you find the perfect fit. We also provide fit recommendations in product descriptions."
        },
        {
          question: "How do I know what size to order?",
          answer: "We recommend checking our detailed size chart on each product page and comparing your measurements. If you're between sizes, we suggest sizing up for a more comfortable fit. You can also contact our styling team for personalized size recommendations."
        },
        {
          question: "Are your products ethically sourced?",
          answer: "Absolutely. We're committed to ethical manufacturing practices. All our partners meet strict standards for fair wages, safe working conditions, and environmental responsibility. Many of our fabrics are sustainably sourced, including organic cotton, recycled polyester, and Tencel™ lyocell."
        },
        {
          question: "Do you offer plus sizes?",
          answer: "Yes! We're proud to offer an extended size range in many of our collections. Look for the 'Extended Sizing' filter on our collections page. Our plus size range typically includes sizes 1X-4X with specific measurements provided in our size charts."
        }
      ]
    },
    {
      category: "Account & Support",
      questions: [
        {
          question: "How do I contact customer service?",
          answer: "Our customer service team is available via email at support@nowhere.com, by phone at +92 312 2287869 (9AM-6PM GMT+5, Monday-Friday), or through our live chat feature during business hours. Average response time is under 2 hours during open hours. For urgent matters, we recommend calling."
        },
        {
          question: "How do I create an account?",
          answer: "Click the 'Account' icon in the top navigation and select 'Create Account'. You'll need to provide your email address and create a password. Having an account allows you to track orders, save your shopping cart, and receive exclusive offers."
        },
        {
          question: "I forgot my password. How can I reset it?",
          answer: "Click 'Login' and then 'Forgot Password'. Enter the email address associated with your account, and we'll send you a password reset link. The link will expire in 24 hours for security purposes."
        },
        {
          question: "Do you offer student or military discounts?",
          answer: "Yes! We offer 15% off for students and military personnel with valid ID. Contact our customer service team with proof of status to receive your discount code. This discount can be combined with sale items but not with other promotional codes."
        }
      ]
    }
  ];

  // Flatten all questions for search
  const allQuestions = faqs.flatMap(category => 
    category.questions.map(q => ({ ...q, category: category.category }))
  );

  const filteredQuestions = searchTerm 
    ? allQuestions.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allQuestions;

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Find quick answers to common questions about orders, shipping, returns, and more.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />
          <svg 
            className="absolute right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Search Results or Categories */}
      {searchTerm ? (
        // Search Results
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Search Results ({filteredQuestions.length})
          </h2>
          <div className="space-y-4">
            {filteredQuestions.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <div>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full mb-2 inline-block">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-gray-800 text-lg">{item.question}</h3>
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      activeIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500">Try searching with different keywords or browse the categories below.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Categories
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">{category.category}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 10 + faqIndex;
                  return (
                    <div key={faqIndex} className="transition-colors hover:bg-gray-50">
                      <button
                        className="w-full px-6 py-5 text-left flex justify-between items-center"
                        onClick={() => toggleFAQ(globalIndex)}
                      >
                        <h3 className="font-semibold text-gray-800 text-lg pr-4">{faq.question}</h3>
                        <svg
                          className={`h-5 w-5 text-gray-500 flex-shrink-0 transform transition-transform ${
                            activeIndex === globalIndex ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {activeIndex === globalIndex && (
                        <div className="px-6 pb-5">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Still Need Help Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-center text-white mt-16">
        <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
          Can't find what you're looking for? Our customer support team is here to help you with any questions or concerns.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/contact" 
            className="inline-block bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            Contact Support
          </Link>
          <a 
            href="tel:+923122287869" 
            className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-700 transition-all duration-200"
          >
            Call Us Now
          </a>
        </div>
      </div>

    
    </div>
  );
};

export default FAQPage;
