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
    <div className={`rounded-lg p-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
      <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
        <p className="Manrope font-bold text-2xl text-center">{title}</p>
        <div className="flex flex-col p-3">
          <p>Amount of water</p>
          <input
            className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-700 text-white border-gray-600' : 'border-gray-300'}`}
            placeholder="Value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className={`rounded-lg p-2 mt-2 ${currentValue >= 100 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
            onClick={handleUpdate}
            disabled={currentValue >= 100}
          >
            Update
          </button>
          <div className="mt-2">
            {tankLevel && (
              <div>
                {currentValue >= 95 && currentValue <= 100 ? (
                  <p className="text-green-500">{currentValue}%: Tank is full</p>
                ) : currentValue >= 65 && currentValue <= 90 ? (
                  <p className="text-orange-500">{currentValue}%: Tank is medium</p>
                ) : (
                  <p className="text-red-500">{currentValue}%: Tank is not full</p>
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
