import React, { useMemo, useState } from "react";
import { formatPrice } from "../../utils/formatPrice";

const DAYS = 30;

// Daily revenue for the last 30 days as a single-series bar chart, with a
// hover tooltip and an equivalent table for screen readers.
const SalesChart = ({ data = [] }) => {
  const [hovered, setHovered] = useState(null);

  const days = useMemo(() => {
    const byDay = new Map(data.map((d) => [d._id, d]));
    return Array.from({ length: DAYS }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (DAYS - 1 - i));
      const key = date.toISOString().slice(0, 10);
      return { key, date, revenue: byDay.get(key)?.revenue || 0, orders: byDay.get(key)?.orders || 0 };
    });
  }, [data]);

  const max = Math.max(...days.map((d) => d.revenue), 1);
  const total = days.reduce((t, d) => t + d.revenue, 0);
  const label = (d) => d.date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold">Revenue, last 30 days</h2>
        <p className="text-sm text-ink-muted">{formatPrice(total)}</p>
      </div>

      <div className="relative mt-6 h-48" onMouseLeave={() => setHovered(null)}>
        <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-stone-200" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-stone-200" />
        <div className="absolute inset-0 flex items-end gap-[2px]">
          {days.map((d, i) => (
            <div
              key={d.key}
              className="flex h-full flex-1 items-end"
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              tabIndex={0}
              aria-label={`${label(d)}: ${formatPrice(d.revenue)}, ${d.orders} orders`}
            >
              <div
                className={`w-full rounded-t-[4px] transition-colors ${d.revenue ? (hovered === i ? "bg-ink" : "bg-ink/80") : "bg-stone-200"}`}
                style={{ height: d.revenue ? `${Math.max((d.revenue / max) * 100, 3)}%` : "2px" }}
              />
            </div>
          ))}
        </div>
        {hovered !== null && (
          <div
            className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-xl bg-white px-3 py-2 text-xs shadow-lift ring-1 ring-stone-200"
            style={{ left: `${((hovered + 0.5) / DAYS) * 100}%` }}
          >
            <p className="font-semibold text-ink">{label(days[hovered])}</p>
            <p className="text-ink-soft">{formatPrice(days[hovered].revenue)} · {days[hovered].orders} orders</p>
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-ink-muted">
        <span>{label(days[0])}</span>
        <span>{label(days[DAYS - 1])}</span>
      </div>

      <table className="sr-only">
        <caption>Daily revenue, last 30 days</caption>
        <thead><tr><th>Date</th><th>Revenue</th><th>Orders</th></tr></thead>
        <tbody>
          {days.map((d) => (
            <tr key={d.key}><td>{label(d)}</td><td>{formatPrice(d.revenue)}</td><td>{d.orders}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesChart;
