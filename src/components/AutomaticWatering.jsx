import React, { useState } from 'react';
import waterLevelIcon from '../assets/hugeicons--humidity.svg';
import { useDarkMode } from '../context/DarkModeContext';

function AutomaticWatering () {

    //dummy data
        const [automaticWatering, setAutomaticWatering] = useState(true);
    
        const { darkMode } = useDarkMode();

    return (
        <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
            <div className="p-6">
                <div className={`rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-50'} p-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="rounded-full p-2 mr-3 flex items-center justify-center w-10 h-10 bg-blue-100">
                                <img 
                                    src={waterLevelIcon} 
                                    className={`${darkMode ? 'filter invert' : ''}`} 
                                    alt="water level icon" 
                                    width="20" 
                                    height="20" 
                                />
                            </div>
                            <div>
                                <p className='font-medium text-lg'>Automatic Watering</p>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {automaticWatering ? 'Currently active' : 'Currently inactive'}
                                </p>
                            </div>
                        </div>
                        <label htmlFor="wateringToggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    id="wateringToggle" 
                                    className="sr-only peer" 
                                    checked={automaticWatering} 
                                    onChange={() => setAutomaticWatering(prev => !prev)} 
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500"></div>
                                <div className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition-transform ${automaticWatering ? 'translate-x-5' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AutomaticWatering;