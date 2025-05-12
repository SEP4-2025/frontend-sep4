import React, { useState } from 'react';
import waterLevelIcon from '../assets/hugeicons--humidity.svg';
import { useDarkMode } from '../context/DarkModeContext';

function AutomaticWatering () {

    //dummy data
        const [automaticWatering, setAutomaticWatering] = useState(true);
    
        const { darkMode } = useDarkMode();

    return (
        <div className={`${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-lg p-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`Manrope flex flex-row h-full p-3 gap-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <img src={waterLevelIcon} className={`${darkMode ? 'filter invert' : ''}`} alt="water level icon" width="23" height="2" />
                    <div>
                        <p className='font-bold'>Automatic watering: {automaticWatering ? 'On' : 'Off'}</p>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Automatically water the greenhouse</p>
                    </div>
                    <label htmlFor="wateringToggle" className="flex items-center cursor-pointer ml-auto">
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                id="wateringToggle" 
                                className="sr-only" 
                                checked={automaticWatering} 
                                onChange={() => setAutomaticWatering(prev => !prev)} 
                            />
                            <div className={`block w-14 h-8 rounded-full ${automaticWatering ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${automaticWatering ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}
export default AutomaticWatering;