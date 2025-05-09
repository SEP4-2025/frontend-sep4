import logo from '../assets/GrowMate_Logo_Transparent.png';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';

function Plant_upload_popup ({isOpen, onClose}) {
    const { darkMode } = useDarkMode();

    if (!isOpen) return null;

    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 max-h-screen overflow-y-auto ${darkMode ? 'bg-gray-900 bg-opacity-50' : 'bg-black bg-opacity-30'}`}>
      <div className={`w-full max-w-md p-6 rounded-xl shadow-lg flex flex-col items-center gap-4 ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
        <img src={logo} alt="logo" className={`w-full max-w-xs h-auto block mx-auto ${darkMode ? 'filter brightness-90' : ''}`} />
        <p className={`${darkMode ? 'text-gray-200' : ''}`}>Drag and upload</p>
        <div className="flex flex-col w-full gap-2">
          <p className={`${darkMode ? 'text-gray-200' : ''}`}>Write a note!</p>
          <input
            type="text"
            id="note"
            className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-600 text-white border-gray-600 placeholder-gray-400' : 'border-gray-300'}`}
            placeholder="Add a note..."
          />
          <button className={`text-white py-2 px-4 rounded-xl ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D5A632] hover:bg-black'}`}>
            Upload plant photo
          </button>
          <button onClick={onClose} className={`${darkMode ? 'text-red-400' : 'text-red-500'} hover:underline`}>Close</button>
        </div>
      </div>
    </div>
    )
}
export default Plant_upload_popup;