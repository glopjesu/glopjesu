import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-3">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Admin Access</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Enter admin password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Password"
              autoFocus
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          For demo purposes: password is "admin123"
        </div>
      </div>
    </div>
  );
};