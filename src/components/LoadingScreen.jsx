import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';

function LoadingScreen() {
    const { darkMode } = useDarkMode();
    
    return (
        <div className={`flex flex-col flex-1 justify-center items-center h-full ${darkMode ? 'bg-slate-800 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
            <div className={`loader border-t-4 border-b-4 rounded-full w-32 h-32 mb-4 animate-spin spin-slow ${darkMode ? 'border-slate-300' : 'border-green-500'}`}></div>
            <div className={`font-medium flex ${darkMode ? 'text-slate-300' : 'text-green-500'}`}>
                <p>Loading your greenhouse data </p>
                <span className="dots-1">.</span>
                <span className="dots-2">.</span>
                <span className="dots-3">.</span>
            </div>
        </div>
    );
}

export default LoadingScreen;