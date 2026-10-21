import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";
import ConfirmDialog from "./ConfirmDialog";
import Price from "../Common/Price";
import { ErrorState } from "../Common/Feedback";
import { imageUrl } from "../../utils/product";
import usePageTitle from "../../hooks/usePageTitle";

const stockBadge = (count) =>
  count === 0 ? "bg-red-100 text-red-800" : count <= 5 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800";

const ProductManagement = () => {
  usePageTitle("Products");
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.adminProducts);
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => [p.name, p.sku, p.brand, p.category].some((v) => v?.toLowerCase().includes(q)));
  }, [products, query]);

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await dispatch(deleteProduct(toDelete._id)).unwrap();
      toast.success(`${toDelete.name} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-display text-3xl">Products</h1>
          <p className="mt-1 text-sm text-ink-muted">{products.length} products</p>
        </div>
        <Link to="/admin/product/new" className="btn-primary">
          <FiPlus /> Add product
        </Link>
      </div>

      <div className="relative mb-4 max-w-sm">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, SKU, brand..." className="input pl-10" aria-label="Search products" />
      </div>

      {error && <ErrorState message={error} onRetry={() => dispatch(fetchAdminProducts())} />}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {loading && products.length === 0 &&
                [0, 1, 2, 3].map((i) => (
                  <tr key={i}><td colSpan={5} className="px-5 py-3"><div className="skeleton h-12" /></td></tr>
                ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-ink-muted">No products found.</td></tr>
              )}
              {filtered.map((product) => (
                <tr key={product._id} className="hover:bg-stone-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0]?.url ? (
                        <img className="h-14 w-11 rounded-lg object-cover" src={imageUrl(product.images[0].url, 100)} alt="" />
                      ) : (
                        <div className="h-14 w-11 rounded-lg bg-stone-200" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium">{product.name}</p>
                        <p className="text-xs text-ink-muted">{product.sku} · {product.gender} · {product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><Price product={product} size="sm" /></td>
                  <td className="px-5 py-3"><span className={`badge ${stockBadge(product.countInStock)}`}>{product.countInStock}</span></td>
                  <td className="px-5 py-3">
                    <span className={`badge ${product.isPublished ? "bg-stone-100 text-ink" : "bg-stone-200 text-ink-muted"}`}>
                      {product.isPublished ? "Published" : "Draft"}
                    </span>
                    {product.isFeatured && <span className="badge ml-1 bg-ink text-white">Featured</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/product/${product._id}/edit`} className="btn-ghost px-3 py-2" aria-label={`Edit ${product.name}`}>
                        <FiEdit2 />
                      </Link>
                      <button onClick={() => setToDelete(product)} className="btn-ghost px-3 py-2 hover:text-sale" aria-label={`Delete ${product.name}`}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete product?"
        message={`"${toDelete?.name}" and its reviews will be removed permanently. Past orders keep their copy of the item.`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
        busy={busy}
      />
    </div>
  );
};

export default ProductManagement;
