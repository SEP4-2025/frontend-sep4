import logo from '../assets/GrowMate_Logo_Transparent.png';
import React from "react";
import { useDarkMode } from '../context/DarkModeContext';

//dummy data
const allPlants = [
    { id: 1, name: "Basil" },
    { id: 2, name: "Mint" },
    { id: 3, name: "Rosemary" },
];

function PlantViewPopup ({ plant, onClose }) {
    const { darkMode } = useDarkMode();
    if (!plant) return null;
  
    return (
      <div className={`fixed inset-0 z-50 flex justify-center items-center p-4 ${darkMode ? 'bg-gray-900/50' : 'bg-black/50'}`}>
        <div className={`p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
            <img src={logo} alt="logo" className={`w-24 sm:w-40 max-w-xs h-auto mx-auto mb-2 sm:mb-4 ${darkMode ? 'filter brightness-90' : ''}`} /> {/*replace with the actual image */}
            <div className='flex flex-row flex-wrap md:flex-row sm:flex-col text-sm sm:text-base mb-2 sm:mb-4'>
                <div className={`text-left w-1/3 ${darkMode ? 'text-gray-300' : ''}`}>Date</div> {/*add functionality here */}
                <h2 className={`text-lg sm:text-xl font-bold text-center w-1/3 ${darkMode ? 'text-gray-100' : ''}`}>{plant.name}</h2>
                <div className={`text-right w-1/3 ${darkMode ? 'text-gray-300' : ''}`}>Condition</div> {/*add functionality here */}
            </div>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm sm:text-base'>
            <div className='flex flex-col w-full sm:w-1/2 mb-2 sm:mb-0'>
                <p className={`${darkMode ? 'text-gray-200' : ''} mb-1`}>Suggestion</p>
                <div className={`border rounded-xl p-2 text-xs sm:text-sm min-h-[40px] ${darkMode ? 'border-gray-700 bg-slate-600 text-gray-200' : 'border-gray-300'}`}>Actual suggestion</div>
            </div>
            <div className='flex flex-col w-full sm:w-1/2'>
                <p className={`${darkMode ? 'text-gray-200' : ''} mb-1`}>Note</p>
                <input
                    type="text"
                    id="note"
                    className={`border rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-xs sm:text-sm ${darkMode ? 'bg-slate-600 text-white border-gray-600 placeholder-gray-400' : 'border-gray-300'}`}
                    placeholder="Add note"
                />
            </div>
          </div>
          <div className='text-center'>
          <button
            className={`mt-3 sm:mt-4 text-sm sm:text-base ${darkMode ? 'text-red-400' : 'text-red-500'} hover:underline`}
            onClick={onClose}
          >
            Close
          </button>
          </div>
        </div>
      </div>
    );
  }

export default PlantViewPopup;