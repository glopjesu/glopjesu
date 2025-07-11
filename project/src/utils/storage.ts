import { CreditCardData } from '../types';

export const saveCardData = (cardNumber: string, cvv: string, expirationDate: string): void => {
  const data: CreditCardData = {
    id: Date.now().toString(),
    cardNumber,
    cvv,
    expirationDate,
    timestamp: new Date(),
    maskedCardNumber: maskCardNumber(cardNumber)
  };

  const existingData = getStoredCardData();
  const updatedData = [...existingData, data];
  
  localStorage.setItem('cardData', JSON.stringify(updatedData));
};

export const getStoredCardData = (): CreditCardData[] => {
  const data = localStorage.getItem('cardData');
  return data ? JSON.parse(data) : [];
};

export const clearStoredData = (): void => {
  localStorage.removeItem('cardData');
};

export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return cleaned.replace(/(\d{4})\d{8}(\d{4})/, '$1-****-****-$2');
};

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, '');
  const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
  return formatted.substring(0, 19);
};