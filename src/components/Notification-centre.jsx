import React, { useState } from 'react';
import Notification_card from './Notification-card.jsx';
import Notification_pop_up from './Notification-pop-up.jsx';

function Notification_centre() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
    <div className='border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 w-1/3 p-2 '>
        <div className='flex flex-col p-2 gap-4'> {/*for an unknown reason, the gap is not being applied properly. to be solved */}
            <p className='Manrope text-xl text-black'>Notification Centre</p>
            <div className = 'text-black'>{/*Notification section */ }
                <Notification_card />
                <Notification_card />
                <Notification_card />
                <div className="text-center"> 
                <button className="text-black p-2 mt-4 rounded-md mx-auto underline" onClick={openModal}>{/*Notification Button */ }
                    View All Alerts
                </button>
                <Notification_pop_up isOpen={isModalOpen} onClose={closeModal} />
                </div>
            </div>
        </div>
    </div>
    );
}

export default Notification_centre;
