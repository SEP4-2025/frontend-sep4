import React, { useState } from 'react';
import Notification_card from './Notification-card.jsx';
import Notification_pop_up from './Notification-pop-up.jsx';
import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';

function Notification_centre({notifications}) {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    /*Dummy data */
    /*const notifications = [
        {
          icon: temperatureIcon,
          title: 'High Temperature',
          description: 'The temperature is above the safe range.',
          time: 'Today, 09:12 AM',
          importance: 3
        },
        {
          icon: humidityIcon,
          title: 'Low Humidity',
          description: 'Humidity is below the optimal level.',
          time: 'Today, 07:45 AM',
          importance: 2
        },
        {
          icon: lightIntensityIcon,
          title: 'Water Level Normal',
          description: 'Water level is within the desired range.',
          time: 'Yesterday, 08:00 PM',
          importance: 1
        }
      ];*/

    return (
    <div className='border-1 border-black rounded-xl pl-2 bg-green-50 pb-2 pt-1 pr-1 w-1/3 p-2 mt-[2%]'>
        <div className='flex flex-col p-2 gap-4'>
            <p className='Manrope text-xl font-bold'>Notification Centre</p>
            <div className = 'text-black'>{/*Notification section */ }
            {notifications.slice(0,2).map((n, index) => (
                <Notification_card
                    key={index}
                    icon={n.icon}
                    title={n.title}
                    description={n.description}
                    time={n.time}
                    importance={n.importance}
                />
            ))}
                <div className="text-center"> 
                <button className="text-black p-2 mt-4 rounded-md mx-auto underline" onClick={openModal}>{/*Notification Button */ }
                    View All Alerts
                </button>
                <Notification_pop_up isOpen={isModalOpen} onClose={closeModal} notifications={notifications} />
                </div>
            </div>
        </div>
    </div>
    );
}

export default Notification_centre;
