import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import usePageTitle from "../../../hooks/usePageTitle";

const faqs = [
  {
    category: "Orders & delivery",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We currently accept Cash on Delivery (COD) across Pakistan. You pay the courier in cash when your order arrives.",
      },
      {
        question: "How long does delivery take and what does it cost?",
        answer: "Standard delivery takes 3-5 working days to all major cities in Pakistan. Shipping is Rs. 250, and free on orders of Rs. 5,000 or more.",
      },
      {
        question: "Do you ship outside Pakistan?",
        answer: "Not yet. We deliver within Pakistan only for now.",
      },
      {
        question: "How do I track my order?",
        answer: "Signed-in customers can see live status under My account. Anyone (including guests) can use the Track order page with the order number from the confirmation email and the email used at checkout.",
      },
      {
        question: "Do I need an account to order?",
        answer: "No. You can check out as a guest with your email address. An account lets you save your address, see all your orders and check out faster.",
      },
      {
        question: "Can I cancel my order?",
        answer: "Yes, while it is still Processing. Open the order in My account and choose Cancel order. Once an order has shipped it can be returned instead.",
      },
    ],
  },
  {
    category: "Returns & exchanges",
    questions: [
      {
        question: "What is your return policy?",
        answer: "Unworn items with their original tags can be returned or exchanged within 30 days of delivery. Sale items can be exchanged but not refunded.",
      },
      {
        question: "How do I exchange an item?",
        answer: "Contact us within 30 days of delivery with your order number and the size or colour you'd like. We'll arrange the exchange, subject to availability.",
      },
      {
        question: "What if my item is damaged or defective?",
        answer: "We're sorry! Email support@nowhere.pk with photos and your order number and we'll send a replacement or refund at no cost to you.",
      },
    ],
  },
  {
    category: "Products & sizing",
    questions: [
      {
        question: "What sizes do you offer?",
        answer: "Most styles come in XS to XXL. Each product page shows the sizes available for that item and a size guide with body measurements.",
      },
      {
        question: "How do I choose my size?",
        answer: "Open the Size guide on the product page and compare your measurements. Reviews also show whether customers found an item small, true to size or large. If you're between sizes, size up for a relaxed fit.",
      },
      {
        question: "How should I care for my clothes?",
        answer: "Care instructions are listed on every product page. As a rule: wash cold, inside out, and avoid tumble drying knits and denim.",
      },
    ],
  },
  {
    category: "Account & offers",
    questions: [
      {
        question: "Do you have any promo codes?",
        answer: "Join our newsletter (in the footer) for WELCOME10, 10% off your first order. NOWHERE500 takes Rs. 500 off orders above Rs. 6,000. Codes are applied at checkout.",
      },
      {
        question: "I forgot my password. How can I reset it?",
        answer: "On the sign-in page choose Forgot password. We'll email you a 6-digit code that is valid for 5 minutes.",
      },
      {
        question: "How do I contact customer service?",
        answer: "Email support@nowhere.pk or call +92 300 0000000, Monday to Saturday, 10AM to 7PM PKT.",
      },
    ],
  },
];

const FAQPage = () => {
  usePageTitle("FAQs");
  const [searchTerm, setSearchTerm] = useState("");
  const term = searchTerm.trim().toLowerCase();

  const sections = faqs
    .map((section) => ({
      ...section,
      questions: section.questions.filter(
        (q) => !term || q.question.toLowerCase().includes(term) || q.answer.toLowerCase().includes(term)
      ),
    }))
    .filter((section) => section.questions.length > 0);

  return (
    <div className="container-page max-w-3xl py-14">
      <p className="eyebrow">Help centre</p>
      <h1 className="heading-display mt-2 text-4xl md:text-5xl">Frequently asked questions</h1>
      <p className="mt-3 text-ink-soft">Quick answers about delivery, returns, sizing and your account.</p>

      <div className="relative mt-8">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          placeholder="Search questions..."
          className="input rounded-full pl-11"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search FAQs"
        />
      </div>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.category}>
            <h2 className="mb-3 text-lg font-semibold">{section.category}</h2>
            <div className="divide-y divide-stone-200 border-y border-stone-200">
              {section.questions.map((item) => (
                <details key={item.question} className="group py-4" open={Boolean(term)}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {item.question}
                    <FiChevronDown className="h-4 w-4 flex-shrink-0 transition group-open:rotate-180" />
                  </summary>
                  <p className="pt-3 text-sm leading-relaxed text-ink-soft">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
        {sections.length === 0 && <p className="text-sm text-ink-muted">No questions match "{searchTerm}".</p>}
      </div>

      <div className="mt-14 rounded-3xl bg-cream p-8 text-center">
        <h2 className="heading-display text-2xl">Still have a question?</h2>
        <p className="mt-2 text-sm text-ink-soft">Our team is happy to help.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="btn-primary">Contact us</Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
