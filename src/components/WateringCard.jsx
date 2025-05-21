import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { triggerManualWatering, updateCurrentWaterLevel, updateWaterPumpThreshold, confirmPassword } from '../api';
import PasswordConfirmPopup from './PasswordConfirmPopup';

function WateringCard({ 
  title, 
  tankLevel = false, 
  value = 0, 
  pumpId, 
  thresholdValue,
  waterLevel,
  waterTankCapacity,
  onUpdate,
  isLoading 
}) {
  const [inputValue, setInputValue] = useState('');
  const [currentValue, setCurrentValue] = useState(Number(value));
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const { darkMode } = useDarkMode();
  
  // Update local state when props change
  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(Number(value));
    }
  }, [value]);
  
  const handleInputChange = (e) => {
    // Only allow numbers and decimal points
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setInputValue(value);
  };
  
  // Close the password modal
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPendingAction(null);
  };

  // Handle form submission - opens the password confirmation dialog
  const handleSubmit = () => {
    const number = parseFloat(inputValue);
    if (isNaN(number) || number <= 0) {
      setError('Please enter a valid number greater than 0');
      return;
    }
    
    setError(null);
    
    // Store the pending action for after password confirmation
    setPendingAction(number);
    setIsPasswordModalOpen(true);
  };
  
  // The actual update function that runs after password confirmation
  const handlePasswordConfirm = async (password) => {
    if (!pendingAction) return false;
    
    const number = pendingAction;
    setIsUpdating(true);
    
    try {
      // First verify password
      await confirmPassword(password);
      
      // Then perform the actual action
      if (tankLevel) {
        // Refill water tank
        await updateCurrentWaterLevel(pumpId, number);
      } else {
        // Update watering threshold or trigger manual watering
        if (title.toLowerCase().includes('threshold')) {
          await updateWaterPumpThreshold(pumpId, number);
        } else {
          // For manual watering, first update the threshold/amount if provided
          if (number > 0) {
            // Update watering amount/threshold before triggering watering
            await updateWaterPumpThreshold(pumpId, number);
          }
          // Then trigger manual watering
          await triggerManualWatering(pumpId);
        }
      }
      
      // Notify parent to refresh data
      if (onUpdate) onUpdate();
      setInputValue('');
      setPendingAction(null);
      return true;
    } catch (err) {
      console.error('Error in password confirmation or water action:', err);
      setError(err.message || 'Failed to update. Please try again.');
      throw err; // Re-throw to show in the password popup
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
      <div className="p-6">
        <h2 className="font-bold text-xl mb-4 text-center">{title}</h2>
        <div className={`rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-50'} p-4`}>
          <div className="space-y-4">
            {error && (
              <div className={`p-3 rounded-lg text-sm ${darkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-700'}`}>
                {error}
              </div>
            )}
            
            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {tankLevel ? 'Add water to tank (ml)' : 'Amount of water (ml)'}
              </label>
              <input
                className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-700 text-white border-slate-500' : 'bg-white border-gray-300'}`}
                placeholder="Enter value"
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading || isUpdating}
              />
            </div>
            

            
            <button
              className={`w-full rounded-lg py-2.5 px-4 text-white font-medium transition-colors ${
                isLoading || isUpdating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : tankLevel && currentValue >= 100
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={handleSubmit}
              disabled={isLoading || isUpdating || (tankLevel && currentValue >= 100)}
            >
              {isUpdating ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Updating...
                </span>
              ) : (
                tankLevel ? 'Add Water' : 'Water Now'
              )}
            </button>
            
            {tankLevel && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current level:</span>
                  <span className="font-medium">{currentValue}%</span>
                </div>
                <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} h-2 rounded-full`}>
                  <div
                    className={`h-full rounded-full ${
                      currentValue >= 90 ? 'bg-green-500' : 
                      currentValue >= 75 ? 'bg-green-400' : 
                      currentValue >= 50 ? 'bg-orange-500' : 
                      currentValue >= 25 ? 'bg-orange-600' : 
                      'bg-red-500'}`}
                    style={{ width: `${currentValue}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-center">
                  {currentValue >= 90 ? (
                    <span className="text-green-500 font-medium">Tank is full</span>
                  ) : currentValue >= 75 ? (
                    <span className="text-green-400 font-medium">Tank level is high</span>
                  ) : currentValue >= 50 ? (
                    <span className="text-orange-500 font-medium">Tank level is medium</span>
                  ) : currentValue >= 25 ? (
                    <span className="text-orange-600 font-medium">Tank level is low</span>
                  ) : (
                    <span className="text-red-500 font-medium">Tank level is critical</span>
                  )}
                </div>
                
                {waterLevel !== undefined && waterTankCapacity !== undefined && (
                  <div className="mt-2 text-sm text-center">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {waterLevel}ml / {waterTankCapacity}ml
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Password Confirmation Popup */}
      <PasswordConfirmPopup 
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        onConfirm={handlePasswordConfirm}
        actionName={tankLevel ? "refill water tank" : "water the greenhouse"}
      />
    </div>
  );
}

export default WateringCard;
