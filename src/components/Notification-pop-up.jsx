import React, { useState } from 'react';
import Notification_card from './Notification-card.jsx';
import filterArrow from '../assets/filterArrow.png';
import windowCloseIcon from '../assets/window-close-icon.png'

function Notification_pop_up({ isOpen, onClose, notifications }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false); 
    const [filter, setFilter] = useState(null);

    if (!isOpen) return null;

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const filteredNotifications = filter
    ? notifications.filter(notification => notification.icon === filter)
    : notifications;

    
    return (
        <div className='fixed inset-0 bg-white border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 mx-auto w-2/3 p-2 m-15 z-50'>
            <div className='flex flex-col p-2 gap-4'>
                <div className='flex text-left'>
                    <div>
                        <h1 className='Manrope text-xl text-black font-bold'>Notification Centre</h1>
                        <p className='text-gray-400'>Here you can see old and new notifications from your plant</p>
                    </div>
                    <div className='ml-auto'>
                        <img src={windowCloseIcon} className='w-5 h-5' onClick={onClose} alt="temperature icon"/>
                    </div>
                    
                </div>

                {/* filter button */}
                <div className="relative inline-block text-right">
                    <button
                        className="bg-green-50 text-black px-4 py-2 rounded-md focus:outline-none border border-black p-8"
                        onClick={toggleFilterMenu} 
                    >
                        <div className='flex gap-4 flex items-center justify-center'>
                            <p>Filter</p>
                            <img src={filterArrow} className='w-3 h-3 flex' alt="temperature icon" width="23" height="2" />
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
                                    onClick={() => setFilter(null)}
                                >
                                        All
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setFilter(temperatureIcon)}
                                    >
                                        Temperature
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setFilter(waterIcon)}
                                    >
                                        Water
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setFilter(humidityIcon)}
                                    >
                                        Humidity
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setFilter(lightIntensityIcon)}
                                    >
                                        Light 
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                    )}
                </div>

                {/* Notifications */}
                <div className='text-black'>
                {filteredNotifications.length === 0 ? (
                    <p className="text-gray-500 text-center">No notifications of this type.</p>
                ) : (
                filteredNotifications.map((n, index) => (
                <Notification_card
                    key={index}
                    icon={n.icon}
                    title={n.title}
                    description={n.description}
                    time={n.time}
                    importance={n.importance}
                />
                )))}
                </div>
            </div>
        </div>
    );
}

export default Notification_pop_up;
