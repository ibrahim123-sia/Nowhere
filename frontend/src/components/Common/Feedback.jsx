import React from "react";
import { Link } from "react-router-dom";

export const Spinner = ({ className = "h-6 w-6" }) => (
  <span
    className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export const PageLoader = ({ label = "Loading" }) => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-ink-muted">
    <Spinner className="h-8 w-8 text-ink" />
    <p className="text-sm">{label}...</p>
  </div>
);

export const EmptyState = ({ icon, title, description, actionLabel, actionTo, onAction }) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-cream/60 px-6 py-16 text-center">
    {icon && <div className="mb-4 text-4xl text-ink-muted">{icon}</div>}
    <h3 className="heading-display text-2xl">{title}</h3>
    {description && <p className="mt-2 max-w-md text-sm text-ink-muted">{description}</p>}
    {actionLabel && actionTo && (
      <Link to={actionTo} className="btn-primary mt-6">
        {actionLabel}
      </Link>
    )}
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-primary mt-6">
        {actionLabel}
      </button>
    )}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
    <p>{message || "Something went wrong."}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-2 font-semibold underline underline-offset-4">
        Try again
      </button>
    )}
  </div>
);
