import { useDarkMode } from '../context/DarkModeContext';
import WaterManagementGraph from '../components/WaterManagementGraph';
import WaterManagementStatus from '../components/WaterManagementStatus';
import AutomaticWatering from '../components/AutomaticWatering';
import WateringCard from '../components/WateringCard';
import React, { useState } from 'react';



function WaterManagement () {

    const { darkMode } = useDarkMode();

    return (
        <div className={`p-8 min-h-screen ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
            {/* Title */}
            <div className='flex flex-col'>
                <h1 className={darkMode ? 'Jacques-Francois text-5xl px-3 text-gray-100' : 'Jacques-Francois text-5xl px-3 text-gray-800'}>Water Management</h1>
                <p className={darkMode ? 'Manrope p-3 text-gray-400' : 'Manrope p-3 ml-3 text-gray-400'}>Water your greenhouse</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className='w-full lg:w-2/3'>
                    <WaterManagementGraph/>
                    <div className="mt-6">
                        <AutomaticWatering/>
                    </div>
                </div>

                {/* Right side panel */}
                <div className="flex flex-col w-full lg:w-1/3 gap-6 mt-6 lg:mt-0">
                    <WaterManagementStatus/>
                    <WateringCard title="Water the greenhouse"/>
                    <WateringCard title="Refill the water tank" tankLevel={true} value='50'/>
                </div>
            </div>
        </div>
    )
}

export default WaterManagement;