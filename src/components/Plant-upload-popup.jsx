import logo from '../assets/GrowMate_Logo_Transparent.png';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';

function Plant_upload_popup ({isOpen, onClose}) {


    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-30 max-h-screen overflow-y-auto">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
        <img src={logo} alt="logo" className="w-full max-w-xs h-auto block mx-auto" />
        <p>Drag and upload</p>
        <div className="flex flex-col w-full gap-2">
          <p>Write a note!</p>
          <input
            type="text"
            id="note"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Add a note..."
          />
          <button className="bg-[#D5A632] hover:bg-black text-white py-2 px-4 rounded-xl">
            Upload plant photo
          </button>
          <button onClick={onClose} className="text-red-500">Close</button>
        </div>
      </div>
    </div>
    )
}
export default Plant_upload_popup;