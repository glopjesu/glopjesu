import React from 'react';
import { CreditCard, BarChart3, LogOut } from 'lucide-react';

interface NavigationProps {
  currentView: 'checkout' | 'statistics';
  onViewChange: (view: 'checkout' | 'statistics') => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onViewChange, 
  isAdmin = false, 
  onLogout 
}) => {
  return (
    <nav className="bg-white shadow-lg rounded-lg p-4 mb-8">
      <div className="flex justify-center items-center space-x-4">
        {isAdmin && (
          <div className="flex items-center text-sm text-orange-600 font-medium mr-4">
            <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
            Admin Mode
          </div>
        )}
        
        <button
          onClick={() => onViewChange('checkout')}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            currentView === 'checkout'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Checkout
        </button>
        <button
          onClick={() => onViewChange('statistics')}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            currentView === 'statistics'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BarChart3 className="w-5 h-5 mr-2" />
          Statistics
        </button>
        
        {isAdmin && onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};