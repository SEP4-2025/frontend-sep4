import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { triggerManualWatering, updateCurrentWaterLevel, updateWaterPumpThreshold, confirmPassword } from '../api';
import PasswordConfirmPopup from './PasswordConfirmPopup';

function WateringCard({ 
  title, 
  tankLevel = false, 
  value = 0, 
  pumpId, 
  thresholdValue, // This prop should hold the current persistent threshold for the pump
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
  const [pendingAction, setPendingAction] = useState(null); // Stores the number from inputValue
  const { darkMode } = useDarkMode();
  
  const getTankColorClass = (percentage) => {
    if (percentage >= 90) {
      return 'bg-green-500'; // Full
    } else if (percentage >= 75) {
      return 'bg-green-400'; // High
    } else if (percentage >= 50) {
      return 'bg-orange-500'; // Medium
    } else if (percentage >= 25) {
      return 'bg-orange-600'; // Low
    } else {
      return 'bg-red-500'; // Critical
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(Number(value));
    }
  }, [value]);
  
  const handleInputChange = (e) => {
    // Only allow numbers and decimal points
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setInputValue(val);
  };
  
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    // Do not clear pendingAction here, it might be needed if modal is re-opened or for retry logic
    // Consider clearing pendingAction if the modal is closed without confirming,
    // depending on desired UX (e.g., setPendingAction(null);)
  };

  const handleSubmit = () => {
    const number = parseFloat(inputValue);
    if (isNaN(number) || number <= 0) {
      setError('Please enter a valid number greater than 0');
      return;
    }
    
    setError(null);
    setPendingAction(number); // Store the validated number for action after password confirm
    setIsPasswordModalOpen(true);
  };
  
  const handlePasswordConfirm = async (password) => {
    if (pendingAction === null) return false; 

    const numberToProcess = pendingAction; 
    setIsUpdating(true);

    try {
      await confirmPassword(password); 

      if (tankLevel) {
        await updateCurrentWaterLevel(pumpId, numberToProcess);
      } else if (title.toLowerCase().includes('threshold')) {
        await updateWaterPumpThreshold(pumpId, numberToProcess);
      } else {
        const originalPersistentThreshold = thresholdValue; 

        try {
          await updateWaterPumpThreshold(pumpId, numberToProcess);
          await triggerManualWatering(pumpId);
        } finally {
          if (originalPersistentThreshold !== undefined) {
            await updateWaterPumpThreshold(pumpId, originalPersistentThreshold);
          }
        }
      }

      setInputValue(''); 
      setPendingAction(null); 
      if (onUpdate) onUpdate(); 
      
      setIsPasswordModalOpen(false); 
      return true; 

    } catch (err) {
      console.error('Error in password confirmation or water action:', err);
      setError(err.message || 'Failed to update. Please try again.');
      throw err; 
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
                {tankLevel ? 'Add water to tank (ml)' : title.toLowerCase().includes('threshold') ? 'Set threshold (ml)' : 'Amount of water (ml)'}
              </label>
              <input
                type="text" // Changed back to text to remove number input spinners
                inputMode="decimal" // Provides a numeric-friendly keyboard on mobile
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
                tankLevel ? 'Add Water' : title.toLowerCase().includes('threshold') ? 'Set Threshold' : 'Water Now'
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
                    className={`h-full rounded-full ${getTankColorClass(currentValue)}`}
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
      
      <PasswordConfirmPopup 
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        onConfirm={handlePasswordConfirm}
        actionName={
            tankLevel 
            ? "refill water tank" 
            : title.toLowerCase().includes('threshold') 
            ? "update watering threshold" 
            : "water the greenhouse"
        }
      />
    </div>
  );
}

export default WateringCard;