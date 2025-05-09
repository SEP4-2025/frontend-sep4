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
      <div className={`fixed inset-0 z-50 flex justify-center items-center ${darkMode ? 'bg-gray-900 bg-opacity-50' : 'bg-black bg-opacity-50'}`}>
        <div className={`p-6 rounded-lg shadow-lg max-w-sm ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
            <img src={logo} alt="logo" className={`w-40 max-w-xs h-auto mx-auto ${darkMode ? 'filter brightness-90' : ''}`} /> {/*replace with the actual image */}
            <div className='flex flex-row flex-wrap md:flex-row sm:flex-col'>
                <div className={`text-left w-1/3 ${darkMode ? 'text-gray-300' : ''}`}>Date</div> {/*add functionality here */}
                <h2 className={`text-xl font-bold mb-4 text-center w-1/3 ${darkMode ? 'text-gray-100' : ''}`}>{plant.name}</h2>
                <div className={`text-right w-1/3 ${darkMode ? 'text-gray-300' : ''}`}>Condition</div> {/*add functionality here */}
            </div>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col w-1/2'>
                <p className={`${darkMode ? 'text-gray-200' : ''}`}>Suggestion</p>
                <div className={`border rounded-xl p-2 ${darkMode ? 'border-gray-700 bg-slate-600 text-gray-200' : 'border-gray-300'}`}>Actual suggestion</div>
            </div>
            <div className='flex flex-col w-1/2'>
                <p className={`${darkMode ? 'text-gray-200' : ''}`}>Note</p>
                <input
                    type="text"
                    id="note"
                    className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-600 text-white border-gray-600 placeholder-gray-400' : 'border-gray-300'}`}
                    placeholder="Add note"
                />
            </div>
          </div>
          <div className='text-center'>
          <button
            className={`mt-4 ${darkMode ? 'text-red-400' : 'text-red-500'} hover:underline`}
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