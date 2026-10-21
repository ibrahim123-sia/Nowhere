export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Order number for display; older orders fall back to a short id.
export const orderRef = (order) => order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`;

export const estimatedDelivery = (order, days = { min: 3, max: 5 }) => {
  const from = new Date(order.createdAt);
  const to = new Date(order.createdAt);
  from.setDate(from.getDate() + days.min);
  to.setDate(to.getDate() + days.max);
  return `${formatDate(from)} - ${formatDate(to)}`;
};
