export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{16}$/.test(cleaned);
};

export const validateCVV = (cvv: string): boolean => {
  return /^\d{3}$/.test(cvv);
};

export const getCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (cleaned.startsWith('4')) return 'Visa';
  if (cleaned.startsWith('5')) return 'Mastercard';
  if (cleaned.startsWith('3')) return 'American Express';
  if (cleaned.startsWith('6')) return 'Discover';
  
  return 'Unknown';
};

export const validateExpirationDate = (expirationDate: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
    return false;
  }
  
  const [month, year] = expirationDate.split('/').map(num => parseInt(num, 10));
  
  // Check if month is valid (01-12)
  if (month < 1 || month > 12) {
    return false;
  }
  
  // Check if the date is not in the past
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};