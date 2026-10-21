import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiTrash2 } from "react-icons/fi";
import { addUser, deleteUser, fetchUsers, updateUser } from "../../redux/slices/adminSlice";
import ConfirmDialog from "./ConfirmDialog";
import { ErrorState } from "../Common/Feedback";
import { formatDate } from "../../utils/order";
import usePageTitle from "../../hooks/usePageTitle";

const EMPTY_FORM = { name: "", email: "", password: "", role: "customer" };

const UserManagement = () => {
  usePageTitle("Customers");
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(addUser(formData)).unwrap();
      toast.success(`${formData.name} added`);
      setFormData(EMPTY_FORM);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = (userId, role) => {
    dispatch(updateUser({ id: userId, role }))
      .unwrap()
      .then(() => toast.success("Role updated"))
      .catch((err) => toast.error(err.message));
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(toDelete._id)).unwrap();
      toast.success("User deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="heading-display text-3xl">Customers</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card overflow-hidden">
          {error && <div className="p-4"><ErrorState message={error} onRetry={() => dispatch(fetchUsers())} /></div>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {loading && users.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-3"><div className="skeleton h-10" /></td></tr>
                )}
                {users.map((user) => {
                  const isSelf = user._id === currentUser?._id;
                  return (
                    <tr key={user._id} className="hover:bg-stone-50">
                      <td className="px-5 py-3">
                        <p className="font-medium">{user.name} {isSelf && <span className="text-xs text-ink-muted">(you)</span>}</p>
                        <p className="text-xs text-ink-muted">{user.email}{!user.isVerified && " · unverified"}</p>
                      </td>
                      <td className="px-5 py-3 text-ink-soft">{user.createdAt ? formatDate(user.createdAt) : "-"}</td>
                      <td className="px-5 py-3">
                        <select
                          value={user.role}
                          disabled={isSelf}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium disabled:opacity-60"
                          aria-label={`Role for ${user.name}`}
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {!isSelf && (
                          <button onClick={() => setToDelete(user)} className="btn-ghost px-2 py-1.5 hover:text-sale" aria-label={`Delete ${user.name}`}>
                            <FiTrash2 />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card h-fit space-y-4 p-6">
          <h2 className="font-semibold">Add a user</h2>
          <p className="text-xs text-ink-muted">Accounts created here are verified and can sign in straight away.</p>
          {[
            ["name", "Name", "text"],
            ["email", "Email", "email"],
            ["password", "Password", "password"],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label className="label" htmlFor={`new-${name}`}>{label}</label>
              <input id={`new-${name}`} type={type} name={name} value={formData[name]} onChange={handleChange} className="input" required minLength={name === "password" ? 6 : undefined} />
            </div>
          ))}
          <div>
            <label className="label" htmlFor="new-role">Role</label>
            <select id="new-role" name="role" value={formData.role} onChange={handleChange} className="input">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? "Adding..." : "Add user"}</button>
        </form>
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete user?"
        message={`${toDelete?.name} (${toDelete?.email}) will lose access. Their past orders are kept.`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
};

export default UserManagement;
