import React, { useState } from 'react';
import { Database } from 'lucide-react';
import { CheckoutForm } from './components/CheckoutForm';
import { Statistics } from './components/Statistics';
import { Navigation } from './components/Navigation';
import { AdminLogin } from './components/AdminLogin';
import { DatabaseStatus } from './components/DatabaseStatus';

function App() {
  const [currentView, setCurrentView] = useState<'checkout' | 'statistics'>('checkout');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showDatabaseStatus, setShowDatabaseStatus] = useState(false);

  const handleCheckoutSuccess = () => {
    // For regular users, do nothing after checkout success
    // Only admins can access statistics
  };

  const handleAdminLogin = (password: string) => {
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setCurrentView('statistics');
    } else {
      alert('Invalid password');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setCurrentView('checkout');
  };

  // Admin login modal
  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} onCancel={() => setShowAdminLogin(false)} />;
  }

  // Database status modal
  if (showDatabaseStatus) {
    return <DatabaseStatus onClose={() => setShowDatabaseStatus(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {currentView === 'checkout' ? (
        <CheckoutForm onSuccess={handleCheckoutSuccess} />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Order Payment Checkout
            </h1>
            <p className="text-gray-600">
              Capture and store credit card information securely
            </p>
          </div>

          <Navigation 
            currentView={currentView} 
            onViewChange={setCurrentView}
            isAdmin={isAdmin}
            onLogout={handleAdminLogout}
          />

          <div className="flex justify-center">
            <Statistics />
          </div>
        </div>
      )}
      
      {currentView === 'checkout' && !isAdmin && (
        <div className="fixed bottom-4 left-4">
          {/* Secret admin access - triple click to show */}
          <div 
            onClick={(e) => {
              if (e.detail === 3) {
                setShowAdminLogin(true);
              }
            }}
            className="w-4 h-4 opacity-0 cursor-default"
          />
        </div>
      )}
      
      {/* Admin access button - only visible when admin */}
      {isAdmin && currentView === 'checkout' && (
        <div className="fixed bottom-4 left-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('statistics')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
            >
              View Statistics
            </button>
            <button
              onClick={() => setShowDatabaseStatus(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
            >
              DB Status
            </button>
          </div>
        </div>
      )}
      
      {/* Database status button - only visible for admin */}
      {isAdmin && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setShowDatabaseStatus(true)}
            className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-full shadow-lg transition-colors"
            title="Verificar estado de base de datos"
          >
            <Database className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;