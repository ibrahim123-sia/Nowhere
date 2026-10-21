import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiArrowLeft } from "react-icons/fi";
import ProductForm from "./ProductForm";
import { createProduct } from "../../redux/slices/adminProductSlice";
import useSeo from "../../hooks/useSeo";

const AddProductPage = () => {
  useSeo({ title: "Add product", noindex: true });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.adminProducts);

  const handleSubmit = async (productData) => {
    try {
      await dispatch(createProduct(productData)).unwrap();
      toast.success("Product created");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
        <FiArrowLeft /> Products
      </Link>
      <h1 className="heading-display mb-6 mt-3 text-3xl">Add product</h1>
      <ProductForm onSubmit={handleSubmit} saving={saving} submitLabel="Create product" />
    </div>
  );
};

export default AddProductPage;
