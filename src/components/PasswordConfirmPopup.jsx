import React, { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';

function PasswordConfirmPopup({ isOpen, onClose, onConfirm, actionName }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { darkMode } = useDarkMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(password);
      setPassword('');
      setError('');
      onClose();
    } catch (err) {
      setError(err.message || 'Incorrect password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className={`relative w-full max-w-md px-4 py-6 mx-auto rounded-lg shadow-lg ${darkMode ? 'bg-slate-700 text-white' : 'bg-white text-gray-800'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Confirm Action</h3>
          <button
            onClick={onClose}
            className={`p-1 ml-auto text-2xl leading-none focus:outline-none ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            &times;
          </button>
        </div>
        
        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          For security reasons, please confirm your password to {actionName}.
        </p>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${darkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-700'}`}>
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label
              htmlFor="passwordInput"
              className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Password
            </label>
            <input
              id="passwordInput"
              type="password"
              className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'bg-white border-gray-300'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your current password"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`mr-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordConfirmPopup;
