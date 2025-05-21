import React, { useState } from 'react';
import waterLevelIcon from '../assets/hugeicons--humidity.svg';
import { useDarkMode } from '../context/DarkModeContext';
import { toggleAutomationStatus, confirmPassword } from '../api';
import PasswordConfirmPopup from './PasswordConfirmPopup';

function AutomaticWatering ({ pumpId, isAutomatic, isLoading, onUpdate }) {
    const [automaticWatering, setAutomaticWatering] = useState(isAutomatic || false);
    const [isToggling, setIsToggling] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const { darkMode } = useDarkMode();
    
    // Update state when props change
    React.useEffect(() => {
        setAutomaticWatering(isAutomatic || false);
    }, [isAutomatic]);
    
    const handleToggleClick = () => {
        // Open password confirmation modal
        setIsPasswordModalOpen(true);
    };
    
    const handlePasswordConfirm = async (password) => {
        try {
            // First verify the password
            await confirmPassword(password);
            
            // Then proceed with the actual operation
            setIsToggling(true);
            // Toggle automatic watering via API
            await toggleAutomationStatus(pumpId, !automaticWatering);
            // Update local state
            setAutomaticWatering(prev => !prev);
            // Notify parent component to refresh data
            if (onUpdate) onUpdate();
            return true;
        } catch (error) {
            console.error('Error in password confirmation or toggling automatic watering:', error);
            // Revert local state if API call fails
            setAutomaticWatering(isAutomatic || false);
            throw error; // Re-throw to show in the password popup
        } finally {
            setIsToggling(false);
        }
    };
    
    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
    };

    return (
        <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
            <div className="p-6">
                {/* Adjusted padding: px-6 py-4 on mobile, p-4 on sm and up */}
                <div className={`rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-50'} px-6 py-4 sm:p-4`}>
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
                        
                        {isLoading || isToggling ? (
                            <div className="flex items-center justify-center w-11">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <label htmlFor="wateringToggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        id="wateringToggle" 
                                        className="sr-only peer" 
                                        checked={automaticWatering} 
                                        onChange={handleToggleClick} 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500"></div>
                                    <div className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition-transform ${automaticWatering ? 'translate-x-5' : ''}`}></div>
                                </div>
                            </label>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Password Confirmation Popup */}
            <PasswordConfirmPopup 
                isOpen={isPasswordModalOpen}
                onClose={closePasswordModal}
                onConfirm={handlePasswordConfirm}
                actionName="toggle automatic watering"
            />
        </div>
    );
}
export default AutomaticWatering;