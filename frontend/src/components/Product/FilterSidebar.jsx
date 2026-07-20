import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSliders, FiCheck } from "react-icons/fi";
import { formatPrice } from "../../utils/formatPrice";

const DEFAULT_MAX_PRICE = 50000;

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: DEFAULT_MAX_PRICE,
  });
  const [priceRange, setPriceRange] = useState([0, DEFAULT_MAX_PRICE]);

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    { name: "Red", value: "bg-red-500" },
    { name: "Blue", value: "bg-blue-500" },
    { name: "Black", value: "bg-gray-900" },
    { name: "Green", value: "bg-green-500" },
    { name: "Yellow", value: "bg-yellow-400" },
    { name: "Gray", value: "bg-gray-500" },
    { name: "White", value: "bg-white border border-gray-300" },
    { name: "Pink", value: "bg-pink-400" },
    { name: "Beige", value: "bg-amber-100" },
    { name: "Navy", value: "bg-blue-800" },
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Wool", "Denim", "Polyester", "Silk", "Linen"];
  const brands = ["Urban Threads", "Sodern Fit", "Street Style"];
  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilter({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || DEFAULT_MAX_PRICE,
    });
    setPriceRange([0, params.maxPrice || DEFAULT_MAX_PRICE]);
  }, [searchParams]);

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const newFilters = { ...filter };

    if (checked) {
      newFilters[name] = [...(newFilters[name] || []), value];
    } else {
      newFilters[name] = newFilters[name].filter((item) => item !== value);
    }

    setFilter(newFilters);
    updateURLParams(newFilters);
  };

  const handleSingleSelect = (name, value) => {
    const newValue = filter[name] === value ? "" : value;
    const newFilters = { ...filter, [name]: newValue };
    setFilter(newFilters);
    updateURLParams(newFilters);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filter, minPrice: 0, maxPrice: newPrice };
    setFilter(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const clearAll = () => {
    setFilter({
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: DEFAULT_MAX_PRICE,
    });
    setPriceRange([0, DEFAULT_MAX_PRICE]);
    navigate(window.location.pathname);
  };

  const activeFilterCount =
    (filter.category ? 1 : 0) +
    (filter.gender ? 1 : 0) +
    (filter.color ? 1 : 0) +
    filter.size.length +
    filter.material.length +
    filter.brand.length +
    (Number(priceRange[1]) < DEFAULT_MAX_PRICE ? 1 : 0);

  const FilterSection = ({ title, children }) => (
    <div className="mb-7 pb-6 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
        {title}
      </h4>
      {children}
    </div>
  );

  const PillOption = ({ label, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
        active
          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200"
          : "bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center gap-2 text-white">
          <FiSliders className="h-5 w-5" />
          <h3 className="text-lg font-bold">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-white/25 text-xs font-semibold">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-white/90 hover:text-white underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Category Filter */}
        <FilterSection title="Category">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <PillOption
                key={category}
                label={category}
                active={filter.category === category}
                onClick={() => handleSingleSelect("category", category)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Gender Filter */}
        <FilterSection title="Gender">
          <div className="flex flex-wrap gap-2">
            {genders.map((gender) => (
              <PillOption
                key={gender}
                label={gender}
                active={filter.gender === gender}
                onClick={() => handleSingleSelect("gender", gender)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Color Filter */}
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => handleSingleSelect("color", color.name)}
                className={`relative w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 ${color.value} ${
                  filter.color === color.name
                    ? "ring-2 ring-offset-2 ring-indigo-500"
                    : "ring-1 ring-gray-200"
                }`}
                aria-label={color.name}
                title={color.name}
              >
                {filter.color === color.name && (
                  <FiCheck
                    className={`absolute inset-0 m-auto h-4 w-4 ${
                      ["White", "Yellow", "Beige"].includes(color.name)
                        ? "text-gray-900"
                        : "text-white"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Size Filter */}
        <FilterSection title="Size">
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <label
                key={size}
                className="flex items-center justify-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="size"
                  value={size}
                  checked={filter.size.includes(size)}
                  onChange={handleCheckboxChange}
                  className="hidden"
                />
                <div
                  className={`w-full py-2 text-center text-sm rounded-lg border transition-colors ${
                    filter.size.includes(size)
                      ? "border-indigo-600 bg-indigo-600 text-white font-medium"
                      : "border-gray-200 hover:border-indigo-300 text-gray-700"
                  }`}
                >
                  {size}
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Material Filter */}
        <FilterSection title="Material">
          <div className="space-y-2.5">
            {materials.map((material) => (
              <label
                key={material}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  name="material"
                  value={material}
                  checked={filter.material.includes(material)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {material}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Brand Filter */}
        <FilterSection title="Brand">
          <div className="space-y-2.5">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  name="brand"
                  value={brand}
                  checked={filter.brand.includes(brand)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Filter */}
        <FilterSection title="Price Range">
          <div className="px-1">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-sm text-gray-500">Up to</span>
              <span className="text-base font-bold text-indigo-700">
                {formatPrice(priceRange[1])}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={DEFAULT_MAX_PRICE}
              step="500"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-indigo-600
                [&::-webkit-slider-thumb]:shadow-md"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{formatPrice(0)}</span>
              <span>{formatPrice(DEFAULT_MAX_PRICE)}</span>
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default FilterSidebar;
