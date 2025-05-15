import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { triggerManualWatering, updateCurrentWaterLevel, updateWaterPumpThreshold } from '../api';

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

  const handleUpdate = async () => {
    const number = parseFloat(inputValue);
    if (isNaN(number) || number <= 0) {
      setError('Please enter a valid number greater than 0');
      return;
    }
    
    setError(null);
    setIsUpdating(true);
    
    try {
      if (tankLevel) {
        // Refill water tank
        await updateCurrentWaterLevel(pumpId, number);
      } else {
        // Update watering threshold or trigger manual watering
        if (title.toLowerCase().includes('threshold')) {
          await updateWaterPumpThreshold(pumpId, number);
        } else {
          // Trigger manual watering
          await triggerManualWatering(pumpId);
        }
      }
      
      // Notify parent to refresh data
      if (onUpdate) onUpdate();
      setInputValue('');
    } catch (err) {
      console.error('Error updating water:', err);
      setError(err.message || 'Failed to update. Please try again.');
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
              onClick={handleUpdate}
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
                    className={`h-full rounded-full ${currentValue >= 95 ? 'bg-green-500' : currentValue >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                    style={{ width: `${currentValue}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-center">
                  {currentValue >= 95 ? (
                    <span className="text-green-500 font-medium">Tank is full</span>
                  ) : currentValue >= 50 ? (
                    <span className="text-orange-500 font-medium">Tank level is medium</span>
                  ) : (
                    <span className="text-red-500 font-medium">Water level is low</span>
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
    </div>
  );
}

export default WateringCard;
