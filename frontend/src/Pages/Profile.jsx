import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { logout, updateProfile } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { OrdersList } from "./MyOrdersPage";
import usePageTitle from "../hooks/usePageTitle";

const TABS = [
  { id: "orders", label: "Orders" },
  { id: "details", label: "Account details" },
  { id: "address", label: "Address" },
  { id: "password", label: "Password" },
];

const Field = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="label">{label}</label>
    <input id={id} className="input" {...props} />
  </div>
);

const Profile = () => {
  usePageTitle("My account");
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("orders");
  const [details, setDetails] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [address, setAddress] = useState({
    fullName: user?.shippingAddress?.fullName || user?.name || "",
    phone: user?.shippingAddress?.phone || user?.phone || "",
    address: user?.shippingAddress?.address || "",
    city: user?.shippingAddress?.city || "",
    postalCode: user?.shippingAddress?.postalCode || "",
    country: "Pakistan",
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  const save = async (updates, message) => {
    try {
      await dispatch(updateProfile(updates)).unwrap();
      toast.success(message);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) return toast.error("New passwords don't match");
    const ok = await save({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }, "Password updated");
    if (ok) setPasswords({ currentPassword: "", newPassword: "", confirm: "" });
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  const setAddr = (f) => (e) => setAddress({ ...address, [f]: e.target.value });

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-display text-2xl text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="heading-display text-3xl">Hi, {user?.name?.split(" ")[0]}</h1>
            <p className="text-sm text-ink-muted">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-outline">Log out</button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto scrollbar-hide lg:flex-col" aria-label="Account sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-left text-sm font-medium transition lg:rounded-xl ${tab === t.id ? "bg-ink text-white" : "text-ink-soft hover:bg-stone-100"}`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          {tab === "orders" && <OrdersList />}

          {tab === "details" && (
            <form onSubmit={(e) => { e.preventDefault(); save(details, "Details saved"); }} className="card max-w-xl space-y-4 p-6">
              <Field label="Full name" id="p-name" required value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
              <Field label="Phone" id="p-phone" type="tel" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} />
              <Field label="Email" id="p-email" value={user?.email || ""} disabled />
              <button type="submit" disabled={loading} className="btn-primary">Save changes</button>
            </form>
          )}

          {tab === "address" && (
            <form onSubmit={(e) => { e.preventDefault(); save({ shippingAddress: address }, "Address saved"); }} className="card max-w-xl space-y-4 p-6">
              <p className="text-sm text-ink-muted">Used to pre-fill checkout, and by Iris when you order in chat.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" id="a-name" required value={address.fullName} onChange={setAddr("fullName")} />
                <Field label="Phone" id="a-phone" type="tel" required value={address.phone} onChange={setAddr("phone")} />
              </div>
              <Field label="Address" id="a-address" required value={address.address} onChange={setAddr("address")} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" id="a-city" required value={address.city} onChange={setAddr("city")} />
                <Field label="Postal code" id="a-postal" required value={address.postalCode} onChange={setAddr("postalCode")} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">Save address</button>
            </form>
          )}

          {tab === "password" && (
            <form onSubmit={savePassword} className="card max-w-xl space-y-4 p-6">
              <Field label="Current password" id="pw-current" type="password" autoComplete="current-password" required value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
              <Field label="New password" id="pw-new" type="password" autoComplete="new-password" minLength={6} required value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
              <Field label="Confirm new password" id="pw-confirm" type="password" autoComplete="new-password" minLength={6} required value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
              <button type="submit" disabled={loading} className="btn-primary">Update password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
