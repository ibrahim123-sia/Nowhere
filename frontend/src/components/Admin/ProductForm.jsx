import React, { useState } from "react";
import { toast } from "sonner";
import { FiStar, FiTrash2, FiUploadCloud } from "react-icons/fi";
import api from "../../utils/api";
import { imageUrl } from "../../utils/product";
import { Spinner } from "../Common/Feedback";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLLECTIONS = ["Essentials", "Smart Casual", "Workwear", "Denim", "Summer", "Activewear", "Lounge", "Streetwear", "Evening", "Autumn Winter"];

const EMPTY = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  countInStock: "",
  sku: "",
  category: "Top Wear",
  gender: "Men",
  collections: "Essentials",
  brand: "",
  material: "",
  fit: "",
  season: "All Season",
  sizes: ["S", "M", "L", "XL"],
  colors: "",
  occasion: "",
  highlights: "",
  careInstructions: "",
  tags: "",
  images: [],
  isPublished: true,
  isFeatured: false,
};

// Converts a product document into form state (lists become editable text).
const toForm = (product) =>
  product
    ? {
        ...EMPTY,
        ...product,
        discountPrice: product.discountPrice ?? "",
        colors: (product.colors || []).join(", "),
        occasion: (product.occasion || []).join(", "),
        tags: (product.tags || []).join(", "),
        highlights: (product.highlights || []).join("\n"),
        careInstructions: (product.careInstructions || []).join("\n"),
      }
    : EMPTY;

const lines = (text) => text.split("\n").map((l) => l.trim()).filter(Boolean);
const commas = (text) => text.split(",").map((l) => l.trim()).filter(Boolean);

const Field = ({ label, hint, children, className = "" }) => (
  <div className={className}>
    <label className="label">{label}</label>
    {children}
    {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
  </div>
);

const ProductForm = ({ initialProduct, onSubmit, saving, submitLabel }) => {
  const [form, setForm] = useState(() => toForm(initialProduct));
  const [uploading, setUploading] = useState(false);
  const [imageLink, setImageLink] = useState("");

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const toggleSize = (size) =>
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : SIZES.filter((s) => [...prev.sizes, size].includes(s)),
    }));

  const addImages = (images) => setForm((prev) => ({ ...prev, images: [...prev.images, ...images] }));

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        const { data } = await api.post("/upload", formData);
        uploaded.push({ url: data.imageUrl, altText: form.name });
      }
      addImages(uploaded);
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const addImageLink = () => {
    if (!/^https?:\/\//.test(imageLink)) return toast.error("Enter a full image URL starting with https://");
    addImages([{ url: imageLink, altText: form.name }]);
    setImageLink("");
  };

  const makePrimary = (index) =>
    setForm((prev) => ({ ...prev, images: [prev.images[index], ...prev.images.filter((_, i) => i !== index)] }));

  const removeImage = (index) => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.sizes.length === 0) return toast.error("Choose at least one size");
    if (commas(form.colors).length === 0) return toast.error("Add at least one colour");
    if (form.images.length === 0) return toast.error("Add at least one image");

    onSubmit({
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice === "" ? "" : Number(form.discountPrice),
      countInStock: Number(form.countInStock),
      colors: commas(form.colors),
      occasion: commas(form.occasion),
      tags: commas(form.tags),
      highlights: lines(form.highlights),
      careInstructions: lines(form.careInstructions),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="card space-y-4 p-6">
          <h2 className="font-semibold">Basics</h2>
          <Field label="Product name">
            <input className="input" required value={form.name} onChange={set("name")} />
          </Field>
          <Field label="Description">
            <textarea className="input min-h-[120px]" required value={form.description} onChange={set("description")} />
          </Field>
          <Field label="Highlights" hint="One per line, shown as bullet points.">
            <textarea className="input min-h-[90px]" value={form.highlights} onChange={set("highlights")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Category">
              <select className="input" value={form.category} onChange={set("category")}>
                <option>Top Wear</option>
                <option>Bottom Wear</option>
              </select>
            </Field>
            <Field label="Gender">
              <select className="input" value={form.gender} onChange={set("gender")}>
                <option>Men</option>
                <option>Women</option>
                <option>Unisex</option>
              </select>
            </Field>
            <Field label="Collection">
              <input className="input" list="collections" required value={form.collections} onChange={set("collections")} />
              <datalist id="collections">{COLLECTIONS.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-semibold">Variants</h2>
          <Field label="Sizes">
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  aria-pressed={form.sizes.includes(size)}
                  className={`w-14 rounded-xl border py-2 text-sm font-medium transition ${form.sizes.includes(size) ? "border-ink bg-ink text-white" : "border-stone-300 hover:border-ink"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Colours" hint="Comma separated, e.g. Black, Navy, Off White">
            <input className="input" required value={form.colors} onChange={set("colors")} />
          </Field>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-semibold">Fit, fabric &amp; care</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Brand"><input className="input" value={form.brand} onChange={set("brand")} /></Field>
            <Field label="Material"><input className="input" value={form.material} onChange={set("material")} /></Field>
            <Field label="Fit"><input className="input" placeholder="e.g. Slim Fit" value={form.fit} onChange={set("fit")} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Season">
              <select className="input" value={form.season} onChange={set("season")}>
                {["All Season", "Summer", "Winter", "Autumn Winter"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Occasions" hint="Comma separated">
              <input className="input" placeholder="Office, Weekend" value={form.occasion} onChange={set("occasion")} />
            </Field>
          </div>
          <Field label="Care instructions" hint="One per line">
            <textarea className="input min-h-[90px]" value={form.careInstructions} onChange={set("careInstructions")} />
          </Field>
          <Field label="Search tags" hint="Comma separated, helps search and the assistant">
            <input className="input" value={form.tags} onChange={set("tags")} />
          </Field>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-semibold">Images</h2>
          <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 p-8 text-center transition hover:border-ink ${uploading ? "pointer-events-none opacity-60" : ""}`}>
            {uploading ? <Spinner className="h-6 w-6" /> : <FiUploadCloud className="h-8 w-8 text-ink-muted" />}
            <span className="text-sm font-medium">{uploading ? "Uploading..." : "Click to upload images"}</span>
            <span className="text-xs text-ink-muted">JPG, PNG or WEBP up to 5MB each</span>
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
          <div className="flex gap-2">
            <input className="input" placeholder="...or paste an image URL" value={imageLink} onChange={(e) => setImageLink(e.target.value)} />
            <button type="button" onClick={addImageLink} className="btn-outline px-5">Add</button>
          </div>
          {form.images.length > 0 && (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {form.images.map((img, index) => (
                <li key={`${img.url}-${index}`} className="group relative">
                  <img src={imageUrl(img.url, 240)} alt="" className="aspect-[4/5] w-full rounded-xl object-cover" />
                  {index === 0 && <span className="badge absolute left-1.5 top-1.5 bg-ink text-white">Main</span>}
                  <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between opacity-0 transition group-hover:opacity-100">
                    {index !== 0 ? (
                      <button type="button" onClick={() => makePrimary(index)} className="rounded-full bg-white p-1.5 shadow" aria-label="Make main image" title="Make main image">
                        <FiStar className="h-3.5 w-3.5" />
                      </button>
                    ) : <span />}
                    <button type="button" onClick={() => removeImage(index)} className="rounded-full bg-white p-1.5 text-sale shadow" aria-label="Remove image">
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
        <section className="card space-y-4 p-6">
          <h2 className="font-semibold">Pricing &amp; stock</h2>
          <Field label="Price (Rs.)">
            <input type="number" min="0" className="input" required value={form.price} onChange={set("price")} />
          </Field>
          <Field label="Sale price (Rs.)" hint="Leave empty for no discount. Must be lower than the price.">
            <input type="number" min="0" className="input" value={form.discountPrice} onChange={set("discountPrice")} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stock">
              <input type="number" min="0" step="1" className="input" required value={form.countInStock} onChange={set("countInStock")} />
            </Field>
            <Field label="SKU">
              <input className="input uppercase" required value={form.sku} onChange={set("sku")} />
            </Field>
          </div>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="font-semibold">Visibility</h2>
          <label className="flex items-center justify-between gap-3 text-sm">
            <span>Published in the store</span>
            <input type="checkbox" checked={form.isPublished} onChange={set("isPublished")} className="h-5 w-5 accent-ink" />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm">
            <span>Featured</span>
            <input type="checkbox" checked={form.isFeatured} onChange={set("isFeatured")} className="h-5 w-5 accent-ink" />
          </label>
        </section>

        <button type="submit" disabled={saving || uploading} className="btn-primary w-full py-3.5">
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
