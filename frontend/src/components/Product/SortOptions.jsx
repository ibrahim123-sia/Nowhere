import React from "react";
import { useSearchParams } from "react-router-dom";

const OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "popularity", label: "Top rated" },
  { value: "priceAsc", label: "Price: low to high" },
  { value: "priceDesc", label: "Price: high to low" },
];

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) params.set("sortBy", e.target.value);
    else params.delete("sortBy");
    setSearchParams(params);
  };

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-ink-muted sm:inline">Sort by</span>
      <select
        value={searchParams.get("sortBy") || ""}
        onChange={handleSortChange}
        className="rounded-full border border-stone-300 bg-white py-2 pl-4 pr-9 text-sm font-medium focus:border-ink focus:outline-none"
        aria-label="Sort products"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default SortOptions;
