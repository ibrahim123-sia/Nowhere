import React from "react";
import Modal from "../Common/Modal";

// Small confirmation modal used for destructive admin actions.
const ConfirmDialog = ({ open, title, message, confirmLabel = "Delete", onConfirm, onClose, busy }) => (
  <Modal open={open} onClose={onClose} title={title}>
    <p className="text-sm text-ink-soft">{message}</p>
    <div className="mt-6 flex gap-3">
      <button onClick={onConfirm} disabled={busy} className="btn-danger flex-1">
        {busy ? "Working..." : confirmLabel}
      </button>
      <button onClick={onClose} className="btn-outline">Cancel</button>
    </div>
  </Modal>
);

export default ConfirmDialog;
