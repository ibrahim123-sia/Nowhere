import React from "react";
import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  const [searchParams, setsearchParams] = useSearchParams();
  
  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setsearchParams(searchParams);
  };

  // Design tokens matching your previous components
  const selectClass = "border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm text-sm text-gray-700";

  return (
    <div className="mb-6 flex items-center justify-end">
      <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-600">
        Sort by:
      </label>
      <select
        value={searchParams.get("sortBy") || ""}
        onChange={handleSortChange}
        id="sort"
        className={selectClass}
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