export interface CreditCardData {
  id: string;
  cardNumber: string;
  cvv: string;
  expirationDate: string;
  timestamp: Date;
  maskedCardNumber: string;
}

export interface FormData {
  cardNumber: string;
  cvv: string;
  expirationDate: string;
}