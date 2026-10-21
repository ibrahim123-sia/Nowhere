import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls to the top on page changes (not on filter/query changes).
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
