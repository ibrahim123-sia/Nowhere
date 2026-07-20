export const formatPrice = (amount) => {
  const value = Number(amount) || 0;
  return `Rs. ${Math.round(value).toLocaleString("en-US")}`;
};
