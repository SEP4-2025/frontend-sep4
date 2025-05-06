import PenLogo from '../assets/pen-icon.svg';
import SaveLogo from '../assets/saveIcon.svg';
import React, { useState, useRef, useEffect } from 'react';
import { updateGreenhouseData } from '../api';
function NameCard({ greenhouseData }) {
  const [name, setName] = useState(greenhouseData?.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      setIsSaving(true);
      try{
        await updateGreenhouseData(greenhouseData.id, name);
        setIsEditing(false);
      }
      catch (error){
        console.error("Error updating greenhouse data in the name-card:", error);
      }
    }
    setIsSaving(false);
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
    <div className="border-1 border-black rounded-3xl pl-2 pb-3 pt-3 pr-2 w-1/3 mb-6 mb-1 text-center flex flex-row items-center">
      {isEditing ? ( // Conditional rendering, It check if the editing is true or false and shows either the input field or the name
        <input ref={inputReference} type="text" value={name} onChange={handleNameChange} onKeyDown={handleEnterKey} className="Jacques-Francois font-bold text-2xl  border-b-1 border-gray-600 focus:outline-none w-full" autoFocus />
      ) : (
        <h2 className="Jacques-Francois font-bold text-2xl border-b-1 border-transparent">{name}</h2>
      )}
      <img src={isEditing ? SaveLogo : PenLogo} className="ml-auto cursor-pointer" alt={isEditing ? "save" : "edit"} width="20" height="20" onClick={handleEditToggle} />
    </div>
  ); // For the image the same thing, conditional rendering using ternary operator it shows the pen icon or the save icon depending on the state of isEditing, it is also clickable and starts the editing process or close it.
}
export default NameCard;