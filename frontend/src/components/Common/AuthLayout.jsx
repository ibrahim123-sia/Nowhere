import React from "react";

// Two-column layout for sign in / sign up: form on the left, photo on the right.
const AuthLayout = ({ image, title, subtitle, children }) => (
  <div className="container-page grid min-h-[calc(100vh-9rem)] gap-10 py-10 lg:grid-cols-2 lg:items-center">
    <div className="mx-auto w-full max-w-md">
      <h1 className="heading-display text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-ink-muted">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </div>
    <div className="relative hidden h-[640px] overflow-hidden rounded-[2rem] lg:block">
      <img src={image} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <p className="absolute bottom-10 left-10 max-w-sm font-display text-3xl text-white">
        Free delivery over Rs. 5,000, cash on delivery and 30-day returns.
      </p>
    </div>
  </div>
);

export const PasswordInput = ({ id, value, onChange, ...props }) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <input id={id} type={visible ? "text" : "password"} value={value} onChange={onChange} className="input pr-16" {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink-muted hover:text-ink"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export default AuthLayout;
