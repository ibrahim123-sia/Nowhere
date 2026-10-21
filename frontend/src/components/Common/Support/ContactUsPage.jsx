import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { FiClock, FiMail, FiPhone } from "react-icons/fi";
import api from "../../../utils/api";
import usePageTitle from "../../../hooks/usePageTitle";

const EMPTY = { name: "", email: "", subject: "", message: "" };

const ContactUsPage = () => {
  usePageTitle("Contact us");
  const { supportEmail, supportPhone, supportHours } = useSelector((state) => state.store.config);
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post("/contact", form);
      toast.success(data.message);
      setForm(EMPTY);
    } catch (err) {
      toast.error(err.response?.data?.message || "We couldn't send your message.");
    } finally {
      setSending(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="container-page py-14">
      <p className="eyebrow">Contact</p>
      <h1 className="heading-display mt-2 text-4xl md:text-5xl">We're here to help</h1>
      <p className="mt-3 max-w-xl text-ink-soft">Questions about an order, sizing or a return? Send us a message and we'll reply within one working day.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="card space-y-5 p-6 md:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className="label">Full name</label>
              <input id="c-name" className="input" required value={form.name} onChange={set("name")} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="c-email" className="label">Email</label>
              <input id="c-email" type="email" className="input" required value={form.email} onChange={set("email")} autoComplete="email" />
            </div>
          </div>
          <div>
            <label htmlFor="c-subject" className="label">Subject</label>
            <select id="c-subject" className="input" value={form.subject} onChange={set("subject")}>
              <option value="">Choose a topic</option>
              <option>Order or delivery</option>
              <option>Returns and exchanges</option>
              <option>Sizing and products</option>
              <option>Feedback</option>
              <option>Something else</option>
            </select>
          </div>
          <div>
            <label htmlFor="c-message" className="label">Message</label>
            <textarea id="c-message" className="input min-h-[160px]" required minLength={10} maxLength={3000} value={form.message} onChange={set("message")} placeholder="Include your order number if it's about an order." />
          </div>
          <button type="submit" disabled={sending} className="btn-primary">{sending ? "Sending..." : "Send message"}</button>
        </form>

        <div className="space-y-4">
          {[
            { icon: FiMail, label: "Email", value: supportEmail, href: `mailto:${supportEmail}` },
            { icon: FiPhone, label: "Phone", value: supportPhone, href: `tel:${supportPhone.replace(/\s/g, "")}` },
            { icon: FiClock, label: "Hours", value: supportHours },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="card flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-cream"><Icon className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{label}</p>
                {href ? <a href={href} className="text-sm font-medium hover:underline">{value}</a> : <p className="text-sm font-medium">{value}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
