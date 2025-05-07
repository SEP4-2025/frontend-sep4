import React, { useState, useEffect} from 'react';

function ClockCard(){

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // It creates a timer that updates the current time every second

        return () => clearInterval(timer); // It prevents it still runing in the background when the component is no longer in use
    });

    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = currentTime.toLocaleDateString();


    return (
        <div className="border-1 border-black rounded-4xl pl-2 pb-3 pt-3 pr-2 w-1/6 mb-6 mb-1 text-center flex flex-col">
            <p className='Manrope text-2xl'>{formattedTime}</p>
            <p className='Manrope text-l'>{formattedDate}</p>
        </div>
    );

}

export default ClockCard;