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
    <div className={`rounded-lg p-4 shadow-md w-1/3 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
      <div className={`flex flex-row items-center h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
        {isEditing ? ( // Conditional rendering, It check if the editing is true or false and shows either the input field or the name
          <input 
            ref={inputReference} 
            type="text" 
            value={name} 
            onChange={handleNameChange} 
            onKeyDown={handleEnterKey} 
            className={`Jacques-Francois font-bold text-2xl border-b-1 focus:outline-none w-full ${darkMode ? 'bg-slate-700 text-gray-100 border-gray-500' : 'border-gray-600'}`} 
            autoFocus 
          />
        ) : (
          <h2 className={`Jacques-Francois font-bold text-2xl border-b-1 border-transparent ${darkMode ? 'text-gray-100' : ''}`}>{name}</h2>
        )}
        <img src={isEditing ? SaveLogo : PenLogo} className={`ml-auto cursor-pointer ${darkMode ? 'filter invert' : ''}`} alt={isEditing ? "save" : "edit"} width="20" height="20" onClick={handleEditToggle} />
      </div>
    </div>
  ); // For the image the same thing, conditional rendering using ternary operator it shows the pen icon or the save icon depending on the state of isEditing, it is also clickable and starts the editing process or close it.
}
export default NameCard;