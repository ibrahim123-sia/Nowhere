import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import ProductForm from "./ProductForm";
import { fetchAdminProduct, updateProduct } from "../../redux/slices/adminProductSlice";
import { ErrorState, PageLoader } from "../Common/Feedback";
import usePageTitle from "../../hooks/usePageTitle";

const EditProductPage = () => {
  usePageTitle("Edit product");
  const dispatch = useDispatch();
  const { id } = useParams();
  const { current, loading, saving, error } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAdminProduct(id));
  }, [dispatch, id]);

  const handleSubmit = async (productData) => {
    try {
      await dispatch(updateProduct({ id, productData })).unwrap();
      toast.success("Product updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading || (!current && !error)) return <PageLoader label="Loading product" />;
  if (error || !current) return <ErrorState message={error} />;

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
        <FiArrowLeft /> Products
      </Link>
      <div className="mb-6 mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="heading-display text-3xl">Edit product</h1>
        <Link to={`/product/${id}`} target="_blank" className="btn-outline px-4 py-2 text-xs">
          View in store <FiExternalLink />
        </Link>
      </div>
      {/* key resets the form when a different product loads */}
      <ProductForm key={current._id} initialProduct={current} onSubmit={handleSubmit} saving={saving} submitLabel="Save changes" />
    </div>
  );
};

export default EditProductPage;
