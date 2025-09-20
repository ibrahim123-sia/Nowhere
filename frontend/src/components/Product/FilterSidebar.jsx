import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
    maxPrice: 100,
  });
  const [priceRange, setPriceRange] = useState([0, 100]);

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
      maxPrice: params.maxPrice || 100,
    });
    setPriceRange([0, params.maxPrice || 100]);
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
    const newFilters = { ...filter, [name]: value };
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

  const FilterSection = ({ title, children }) => (
    <div className="mb-8 pb-6 border-b border-gray-100 last:border-0">
      <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
        {title}
      </h4>
      {children}
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Filters</h3>
        <button
          onClick={() => {
            setFilter({
              category: "",
              gender: "",
              color: "",
              size: [],
              material: [],
              brand: [],
              minPrice: 0,
              maxPrice: 100,
            });
            setPriceRange([0, 100]);
            navigate(window.location.pathname);
          }}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Clear all
        </button>
      </div>

      {/* Category Filter */}
      <FilterSection title="Category">
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleSingleSelect("category", category)}
            >
              <div
                className={`flex items-center justify-center h-4 w-4 rounded-full border ${
                  filter.category === category
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-300 group-hover:border-indigo-400"
                }`}
              >
                {filter.category === category && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {category}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Gender Filter */}
      <FilterSection title="Gender">
        <div className="space-y-3">
          {genders.map((gender) => (
            <label
              key={gender}
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleSingleSelect("gender", gender)}
            >
              <div
                className={`flex items-center justify-center h-4 w-4 rounded-full border ${
                  filter.gender === gender
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-300 group-hover:border-indigo-400"
                }`}
              >
                {filter.gender === gender && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {gender}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Color Filter */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => handleSingleSelect("color", color.name)}
              className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 ${color.value} ${
                filter.color === color.name
                  ? "ring-2 ring-offset-2 ring-indigo-500"
                  : "ring-1 ring-gray-200"
              }`}
              aria-label={color.name}
            />
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
                className={`w-full py-2 text-center text-sm rounded-md border ${
                  filter.size.includes(size)
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
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
        <div className="space-y-3">
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
        <div className="space-y-3">
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
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-indigo-600"
          />
          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <span>$0</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;
