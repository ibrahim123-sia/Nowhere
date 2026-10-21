import React from "react";
import { useSelector } from "react-redux";
import Modal from "../Common/Modal";

const SizeGuideModal = ({ open, onClose, category }) => {
  const { sizeGuide } = useSelector((state) => state.store.config);
  const guide = sizeGuide?.[category] || sizeGuide?.["Top Wear"];

  return (
    <Modal open={open} onClose={onClose} title="Size guide" maxWidth="max-w-xl">
      {guide ? (
        <>
          <p className="mb-4 text-sm text-ink-muted">
            Body measurements in {guide.unit}. If you're between sizes, size up for a relaxed fit.
          </p>
          <div className="overflow-hidden rounded-2xl border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-cream">
                <tr>
                  {guide.columns.map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {guide.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i} className={`px-4 py-2.5 ${i === 0 ? "font-semibold" : "text-ink-soft"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 grid gap-3 text-xs text-ink-soft sm:grid-cols-2">
            <p><span className="font-semibold text-ink">Chest:</span> measure around the fullest part, under the arms.</p>
            <p><span className="font-semibold text-ink">Waist:</span> measure around your natural waistline.</p>
            <p><span className="font-semibold text-ink">Hip:</span> measure around the fullest part of your hips.</p>
            <p><span className="font-semibold text-ink">Inseam:</span> from the crotch to the bottom of the ankle.</p>
          </div>
        </>
      ) : (
        <p className="text-sm text-ink-muted">Size guide is loading...</p>
      )}
    </Modal>
  );
};

export default SizeGuideModal;
