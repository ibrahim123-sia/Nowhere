import React from "react";
import { Link } from "react-router-dom";
import useSeo from "../hooks/useSeo";

const NotFoundPage = () => {
  useSeo({ title: "Page not found", noindex: true });
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-display text-8xl font-medium text-stone-300">404</p>
      <h1 className="heading-display mt-4 text-3xl">This page went nowhere.</h1>
      <p className="mt-3 max-w-md text-ink-muted">The link may be broken or the page may have moved. Let's get you back to something good.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">Back to home</Link>
        <Link to="/collections/new-arrivals" className="btn-outline">See new arrivals</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
