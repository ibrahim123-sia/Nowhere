import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import api from "../../utils/api";
import { formatPrice } from "../../utils/formatPrice";
import { imageUrl } from "../../utils/product";

const POPULAR = ["Linen", "Denim", "White shirt", "Joggers", "Workwear", "Summer"];

// Search overlay with live suggestions as you type.
const SearchBar = ({ className = "" }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    const term = searchTerm.trim();
    if (term.length < 2) {
      setSuggestions([]);
      return undefined;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get("/products/suggest", { params: { q: term }, signal: controller.signal });
        setSuggestions(data);
      } catch {
        // Ignore aborted / failed suggestion requests.
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm]);

  const close = () => {
    setIsOpen(false);
    setSearchTerm("");
    setSuggestions([]);
  };

  const goToSearch = (term) => {
    if (!term.trim()) return;
    navigate(`/collections/all?search=${encodeURIComponent(term.trim())}`);
    close();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 rounded-full p-2 text-ink-soft transition hover:bg-stone-100 hover:text-ink ${className}`}
        aria-label="Search products"
      >
        <HiMagnifyingGlass className="h-5 w-5" />
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex justify-center bg-ink/40 p-4 pt-[10vh] backdrop-blur-[2px]" onMouseDown={(e) => e.target === e.currentTarget && close()}>
            <div className="h-fit w-full max-w-2xl animate-fade-up overflow-hidden rounded-3xl bg-white shadow-lift">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  goToSearch(searchTerm);
                }}
                className="flex items-center gap-3 border-b border-stone-200 px-5 py-4"
              >
                <HiMagnifyingGlass className="h-5 w-5 flex-shrink-0 text-ink-muted" />
                <input
                  ref={inputRef}
                  type="search"
                  placeholder="Search shirts, denim, linen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-base text-ink placeholder:text-stone-400 focus:outline-none"
                  aria-label="Search"
                />
                <button type="button" onClick={close} className="rounded-full p-1 text-ink-muted hover:bg-stone-100" aria-label="Close search">
                  <HiMiniXMark className="h-5 w-5" />
                </button>
              </form>

              <div className="max-h-[60vh] overflow-y-auto p-3">
                {searchTerm.trim().length < 2 ? (
                  <div className="p-3">
                    <p className="eyebrow mb-3">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((term) => (
                        <button key={term} onClick={() => goToSearch(term)} className="chip">
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map((item) => (
                      <li key={item._id}>
                        <Link to={`/product/${item._id}`} onClick={close} className="flex items-center gap-4 rounded-2xl p-2 transition hover:bg-stone-50">
                          <img src={imageUrl(item.image, 120)} alt="" className="h-14 w-12 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-ink-muted">
                              {item.gender} · {item.category}
                            </p>
                          </div>
                          <span className="text-sm font-semibold">{formatPrice(item.discountPrice || item.price)}</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button onClick={() => goToSearch(searchTerm)} className="mt-1 w-full rounded-2xl p-3 text-left text-sm font-semibold hover:bg-stone-50">
                        See all results for "{searchTerm.trim()}"
                      </button>
                    </li>
                  </ul>
                ) : (
                  <p className="p-4 text-sm text-ink-muted">{loading ? "Searching..." : `No products match "${searchTerm.trim()}".`}</p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default SearchBar;
