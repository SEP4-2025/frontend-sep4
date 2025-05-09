import React, { useState } from 'react';
import Notification_card from './Notification-card.jsx';
import filterArrow from '../assets/filterArrow.png';
import { useDarkMode } from '../context/DarkModeContext';

function Notification_pop_up({ isOpen, onClose }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { darkMode } = useDarkMode(); 

    if (!isOpen) return null;

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <div className={`fixed inset-0 border-1 rounded-xl pl-2 pb-2 pt-1 pr-1 mx-auto w-2/3 p-2 m-15 z-50 ${darkMode ? 'darkMode border-gray-600 bg-black' : 'bg-white border-gray-500 bg-navbar-color'}`}>
            <div className='flex flex-col p-2 gap-4'>
                <div className='text-left'>
                    <h1 className={`Manrope text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-black'}`}>Notification Centre</h1>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>Here you can see old and new notifications from your plant</p>
                </div>

                {/* filter button */}
                <div className="relative inline-block text-right">
                    <button
                        className={`px-4 py-2 rounded-md focus:outline-none border p-8 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-400 text-white border-black'}`}
                        onClick={toggleFilterMenu} 
                    >
                        <div className='flex gap-4'>
                            <p>Filter</p>
                            <img src={filterArrow} className={`w-5 h-5 ${darkMode ? 'filter invert' : ''}`} alt="temperature icon" width="23" height="2" />
                        </div>
                    </button>
                    
                    {/* Filter menu */}
                    {isFilterOpen && (
                        <div className={`absolute right-0 border rounded-md mt-2 w-48 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                            <ul className="py-1 text-left">
                                <li>
                                    <a
                                        href="#"
                                        className={`block px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Temperature
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={`block px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Water
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={`block px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Humidity
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className={`${darkMode ? 'text-gray-100' : 'text-black'}`}>
                    <Notification_card />
                    <Notification_card />
                    <Notification_card />
                    <div className="text-center">
                        <button
                            className={`p-2 mt-4 rounded-md mx-auto underline ${darkMode ? 'text-gray-100 hover:text-gray-300' : 'text-black hover:text-gray-700'}`}
                            onClick={onClose} 
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notification_pop_up;
