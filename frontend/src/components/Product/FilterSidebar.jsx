import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiX, FiChevronDown } from "react-icons/fi";
import { fetchFacets } from "../../redux/slices/productSlice";
import { FILTER_KEYS, isLightColor, swatchStyle } from "../../utils/product";

const PRICE_PRESETS = [
  { label: "Under Rs. 2,500", max: 2500 },
  { label: "Rs. 2,500 - 4,000", min: 2500, max: 4000 },
  { label: "Rs. 4,000 - 6,000", min: 4000, max: 6000 },
  { label: "Over Rs. 6,000", min: 6000 },
];

const Section = ({ title, children, defaultOpen = true }) => (
  <details className="group border-b border-stone-200 py-5" open={defaultOpen}>
    <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-wider">
      {title}
      <FiChevronDown className="h-4 w-4 text-ink-muted transition group-open:rotate-180" />
    </summary>
    <div className="pt-4">{children}</div>
  </details>
);

const FilterSidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const facets = useSelector((state) => state.products.facets);
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceDraft, setPriceDraft] = useState({ min: "", max: "" });

  useEffect(() => {
    dispatch(fetchFacets());
  }, [dispatch]);

  useEffect(() => {
    setPriceDraft({ min: searchParams.get("minPrice") || "", max: searchParams.get("maxPrice") || "" });
  }, [searchParams]);

  const getList = (key) => (searchParams.get(key) || "").split(",").filter(Boolean);

  const update = (changes) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      const v = Array.isArray(value) ? value.join(",") : value;
      if (v === undefined || v === null || v === "" || v === false) params.delete(key);
      else params.set(key, v);
    });
    setSearchParams(params);
  };

  const toggleSingle = (key, value) => update({ [key]: searchParams.get(key) === value ? "" : value });

  const toggleMulti = (key, value) => {
    const list = getList(key);
    update({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  const applyPrice = (min, max) => update({ minPrice: min || "", maxPrice: max || "" });

  const activeCount = FILTER_KEYS.filter((k) => searchParams.get(k)).length;

  const clearAll = () => {
    const params = new URLSearchParams(searchParams);
    FILTER_KEYS.forEach((k) => params.delete(k));
    setSearchParams(params);
  };

  const pill = (active) =>
    `rounded-full border px-4 py-2 text-sm transition ${active ? "border-ink bg-ink text-white" : "border-stone-300 hover:border-ink"}`;

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 lg:px-0 lg:pt-0">
        <h3 className="text-sm font-semibold">
          Filters {activeCount > 0 && <span className="ml-1 rounded-full bg-ink px-2 py-0.5 text-[10px] text-white">{activeCount}</span>}
        </h3>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-xs font-semibold link-underline">
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} aria-label="Close filters" className="rounded-full p-1 hover:bg-stone-100 lg:hidden">
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 lg:overflow-visible lg:px-0">
        <Section title="Gender">
          <div className="flex flex-wrap gap-2">
            {(facets?.genders || ["Men", "Women"]).map((g) => (
              <button key={g} onClick={() => toggleSingle("gender", g)} className={pill(searchParams.get("gender") === g)}>
                {g}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Category">
          <div className="flex flex-wrap gap-2">
            {(facets?.categories || ["Top Wear", "Bottom Wear"]).map((c) => (
              <button key={c} onClick={() => toggleSingle("category", c)} className={pill(searchParams.get("category") === c)}>
                {c}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Size">
          <div className="grid grid-cols-4 gap-2">
            {(facets?.sizes || []).map((size) => {
              const active = getList("size").includes(size);
              return (
                <button key={size} onClick={() => toggleMulti("size", size)} aria-pressed={active} className={`rounded-xl border py-2 text-sm transition ${active ? "border-ink bg-ink text-white" : "border-stone-300 hover:border-ink"}`}>
                  {size}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Colour">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {(facets?.colors || []).map((color) => {
              const active = getList("color").includes(color);
              return (
                <button key={color} onClick={() => toggleMulti("color", color)} aria-pressed={active} className="flex items-center gap-2.5 text-left text-sm">
                  <span className={`relative h-5 w-5 flex-shrink-0 rounded-full ring-1 ring-inset ring-black/10 ${active ? "ring-2 ring-ink ring-offset-1" : ""}`} style={swatchStyle(color)}>
                    {active && <span className={`absolute inset-0 m-auto h-1.5 w-1.5 rounded-full ${isLightColor(color) ? "bg-ink" : "bg-white"}`} />}
                  </span>
                  <span className={active ? "font-semibold" : "text-ink-soft"}>{color}</span>
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Price">
          <div className="space-y-2">
            {PRICE_PRESETS.map((preset) => {
              const active =
                String(preset.min || "") === (searchParams.get("minPrice") || "") &&
                String(preset.max || "") === (searchParams.get("maxPrice") || "");
              return (
                <label key={preset.label} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input type="radio" name="price" checked={active} onChange={() => applyPrice(preset.min, preset.max)} className="h-4 w-4 accent-ink" />
                  <span className={active ? "font-semibold" : "text-ink-soft"}>{preset.label}</span>
                </label>
              );
            })}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyPrice(priceDraft.min, priceDraft.max);
            }}
            className="mt-4 flex items-center gap-2"
          >
            <input type="number" min="0" placeholder="Min" value={priceDraft.min} onChange={(e) => setPriceDraft({ ...priceDraft, min: e.target.value })} className="input px-3 py-2" aria-label="Minimum price" />
            <span className="text-ink-muted">-</span>
            <input type="number" min="0" placeholder="Max" value={priceDraft.max} onChange={(e) => setPriceDraft({ ...priceDraft, max: e.target.value })} className="input px-3 py-2" aria-label="Maximum price" />
            <button type="submit" className="btn-outline px-4 py-2">Go</button>
          </form>
        </Section>

        <Section title="Material" defaultOpen={false}>
          <div className="space-y-2.5">
            {(facets?.materials || []).map((material) => (
              <label key={material} className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" checked={getList("material").includes(material)} onChange={() => toggleMulti("material", material)} className="h-4 w-4 rounded accent-ink" />
                <span className="text-ink-soft">{material}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Brand" defaultOpen={false}>
          <div className="space-y-2.5">
            {(facets?.brands || []).map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" checked={getList("brand").includes(brand)} onChange={() => toggleMulti("brand", brand)} className="h-4 w-4 rounded accent-ink" />
                <span className="text-ink-soft">{brand}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Availability">
          <div className="space-y-2.5">
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" checked={searchParams.get("inStock") === "true"} onChange={(e) => update({ inStock: e.target.checked ? "true" : "" })} className="h-4 w-4 rounded accent-ink" />
              <span className="text-ink-soft">In stock only</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" checked={searchParams.get("onSale") === "true"} onChange={(e) => update({ onSale: e.target.checked ? "true" : "" })} className="h-4 w-4 rounded accent-ink" />
              <span className="text-ink-soft">On sale</span>
            </label>
          </div>
        </Section>
      </div>

      {onClose && (
        <div className="border-t border-stone-200 p-4 lg:hidden">
          <button onClick={onClose} className="btn-primary w-full">Show results</button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
