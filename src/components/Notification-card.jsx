import React from 'react';

/*
 * metrics: array of {
 *   title: string,
 *   description: string,
 *   icon: number,
 *   time: number,
 *   importance: number,
 * }
 */

export function Notification_card({icon, title, description, time, importance}) {

    const borderColor = {
        1: 'border-green-500',
        2: 'border-yellow-400',
        3: 'border-red-500'
      };
    return (
    <div className={`border rounded-xl p-2 bg-white w-full flex flex-col z-51 mb-2 ${borderColor[importance]}`}>
        <div className="flex justify_start">
            <img src={icon} alt="notification icon" width="23" height="2" />
                <div className='text-left pl-2'>
                    <p className="text-lg font-semibold text-black">{title}</p>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
        </div>
        <div className="text-xs text-gray-400 mt-2">{time}</div>
    </div>
    
    )}

export default Notification_card;

