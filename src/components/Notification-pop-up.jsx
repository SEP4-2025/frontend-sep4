import React, { useState } from 'react';
import Notification_card from './Notification-card.jsx';
import filterArrow from '../assets/filterArrow.png';

function Notification_pop_up({ isOpen, onClose }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false); 

    if (!isOpen) return null;

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <div className='fixed inset-0 bg-white border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 mx-auto w-2/3 p-2 m-15'>
            <div className='flex flex-col p-2 gap-4'>
                <div className='text-left'>
                    <h1 className='Manrope text-xl text-black font-bold'>Notification Centre</h1>
                    <p className='text-gray-400'>Here you can see old and new notifications from your plant</p>
                </div>

                {/* filter button */}
                <div className="relative inline-block text-right">
                    <button
                        className="bg-gray-400 text-white px-4 py-2 rounded-md focus:outline-none border border-black p-8"
                        onClick={toggleFilterMenu} 
                    >
                        <div className='flex gap-4'>
                            <p>Filter</p>
                            <img src={filterArrow} className='w-5 h-5' alt="temperature icon" width="23" height="2" />
                        </div>
                    </button>
                    
                    {/* Filter menu */}
                    {isFilterOpen && (
                        <div className="absolute right-0 bg-white border border-gray-300 rounded-md mt-2 w-48">
                            <ul className="py-1 text-left">
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Temperature
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Water
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
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
                <div className='text-black'>
                    <Notification_card />
                    <Notification_card />
                    <Notification_card />
                    <div className="text-center">
                        <button
                            className="text-black p-2 mt-4 rounded-md mx-auto underline"
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
