import PenLogo from '../assets/pen-icon.svg';
import SaveLogo from '../assets/saveIcon.svg';
import React, { useState, useRef, useEffect } from 'react';
import { updateGreenhouseName } from '../api';
import { useDarkMode } from '../context/DarkModeContext.jsx'; 
function NameCard({ greenhouseData }) {
  const [name, setName] = useState(greenhouseData?.name);
  const [isEditing, setIsEditing] = useState(false);
  const { darkMode } = useDarkMode();
  
  const inputReference = useRef(null);

  useEffect(() => {
    if (greenhouseData?.name) {
      setName(greenhouseData.name);
    }
  }, [greenhouseData]); // rerenders when data arrives from the database
// TODO: make the loading screen to allow data to arrive before rendering the page  

  useEffect(() => {
    if (isEditing && inputReference.current) {
      inputReference.current.focus();
    }
  }, [isEditing]); // Focus the input when editing starts

  const handleSave = async () => {
    if(!greenhouseData?.id || name === greenhouseData.name) { // no changes
      setIsEditing(false);
      return;
    }
    else{
      try{
        await updateGreenhouseName(greenhouseData.id, name);
        setIsEditing(false);
      }
      catch (error){
        console.error("Error updating greenhouse data in the name-card:", error);
      }
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      handleSave(); 
    }
    else {
      setIsEditing(true);
    }
  }; // Handles the edit button click

  const handleNameChange = (event) => {
    setName(event.target.value);
  }; // Handles the actual name change from the input field

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      handleSave();
      setIsEditing(false);
    }
  }; // Handles the enter key press to save the name

  return (
    <div className={`rounded-lg p-5 w-full max-w-2xl shadow-sm mb-8 ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {isEditing ? (
              <input 
                ref={inputReference} 
                type="text" 
                value={name} 
                onChange={handleNameChange} 
                onKeyDown={handleEnterKey} 
                className={`focus:outline-none border-b ${darkMode ? 
                  'bg-slate-700 text-white border-gray-500' : 
                  'bg-white text-gray-800 border-gray-300'}`} 
                autoFocus 
              />
            ) : name}
          </h2>
        </div>
        <button 
          onClick={handleEditToggle}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
        >
          {isEditing ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          )}
        </button>
      </div>
      {greenhouseData && greenhouseData.description && (
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          {greenhouseData.description}
        </p>
      )}
    </div>
  ); // For the image the same thing, conditional rendering using ternary operator it shows the pen icon or the save icon depending on the state of isEditing, it is also clickable and starts the editing process or close it.
}
export default NameCard;