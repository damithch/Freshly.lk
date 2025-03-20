// Convert the number to a formatted string in Sri Lankan Rupees
export const addCurrency = num => {
  return `Rs. ${num?.toLocaleString('en-LK')}`;
};
