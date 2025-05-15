import React, { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';

function WateringCard({ title, tankLevel, value }) {
  const [inputValue, setInputValue] = useState('');
  const [currentValue, setCurrentValue] = useState(Number(value));
  const { darkMode } = useDarkMode();

  const handleUpdate = () => {
    const number = parseFloat(inputValue);
    if (!isNaN(number) && currentValue < 100) {
      const newValue = Number(currentValue) + number;
      setCurrentValue(newValue > 100 ? 100 : newValue);
    }
    setInputValue('');
  };

  return (
    <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
      <div className="p-6">
        <h2 className="font-bold text-xl mb-4 text-center">{title}</h2>
        <div className={`rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-50'} p-4`}>
          <div className="space-y-4">
            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount of water (ml)</label>
              <input
                className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-700 text-white border-slate-500' : 'bg-white border-gray-300'}`}
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <button
              className={`w-full rounded-lg py-2.5 px-4 text-white font-medium transition-colors ${currentValue >= 100 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={handleUpdate}
              disabled={currentValue >= 100}
            >
              Update
            </button>
            
            {tankLevel && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current level:</span>
                  <span className="font-medium">{currentValue}%</span>
                </div>
                <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} h-2 rounded-full`}>
                  <div
                    className={`h-full rounded-full ${currentValue >= 95 ? 'bg-green-500' : currentValue >= 65 ? 'bg-orange-500' : 'bg-red-500'}`}
                    style={{ width: `${currentValue}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-center">
                  {currentValue >= 95 && currentValue <= 100 ? (
                    <span className="text-green-500 font-medium">Tank is full</span>
                  ) : currentValue >= 65 && currentValue <= 90 ? (
                    <span className="text-orange-500 font-medium">Tank is medium</span>
                  ) : (
                    <span className="text-red-500 font-medium">Tank is not full</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WateringCard;
