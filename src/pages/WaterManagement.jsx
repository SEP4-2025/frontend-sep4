import waterLevelIcon from '../assets/hugeicons--humidity.svg';
import { useDarkMode } from '../context/DarkModeContext';
import WaterManagementGraph from '../components/WaterManagementGraph';
import WaterManagementStatus from '../components/WaterManagementStatus';
import AutomaticWatering from '../components/AutomaticWatering';
import WateringCard from '../components/WateringCard';
import React, { useState } from 'react';



function WaterManagement () {

    const { darkMode } = useDarkMode();

    return (
        <div className={`${darkMode ? 'darkMode' : ''}`}>
            {/* Title */}
            <div className='flex flex-row p-6'>
                <img src={waterLevelIcon} className={`${darkMode ? 'filter invert' : ''}`} alt="water level icon" width="40" height="2" />
                <h1 className="Jacques-Francois text-5xl">Water Management</h1>
            </div>

            <div className="flex flex-row p-5 gap-5">
                <div className='w-2/3'>
                    <WaterManagementGraph/>
                    <AutomaticWatering/>
                </div>

                {/* Right side pannel */}
                <div className="flex flex-col ml-auto w-1/3 gap-3">
                    <WaterManagementStatus/>
                    <WateringCard title="Water the greenhouse"/>
                    <WateringCard title="Refill the water tank" tankLevel={true} value='50'/>
                </div>
            </div>
        </div>
    )
}

export default WaterManagement;