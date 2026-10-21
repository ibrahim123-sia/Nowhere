import { useEffect } from "react";

// Sets the browser tab title, e.g. "Checkout | Nowhere".
const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | Nowhere` : "Nowhere - Clothing for everyday life";
  }, [title]);
};

export default usePageTitle;
