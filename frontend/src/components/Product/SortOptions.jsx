import React from "react";
import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  const [searchParams, setsearchParams] = useSearchParams();
  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setsearchParams(searchParams);
  };
  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        value={searchParams.get("SortBy") || ""}
        onChange={handleSortChange}
        id="sort"
        className="border p-1 rounded-md focus:outline-none text-xs"
      >
        <option value="">Default</option>
        <option value="priceAsc">Price: Low To High</option>
        <option value="priceDesc">Price: High To Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;
