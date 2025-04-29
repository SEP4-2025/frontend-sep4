import PenLogo from '../assets/pen-icon.svg';
import SaveLogo from '../assets/saveIcon.svg';
import React, { _use, useState, useRef, useEffect } from 'react';
function NameCard() {
  const [name, setName] = useState("My Greenhouse"); 
  // later we will fetch the name from the database and we will need to add a fuctionality so save changes
  // for now it just goes back to the default name when the page is refreshed or switched. When we will switch to the database fetching there will be no such issue.
  // Temporary fix would be to use local storage to save the name.
  const [isEditing, setIsEditing] = useState(false);
  const inputRefference = useRef(null);

  useEffect(() => {
    if (isEditing && inputRefference.current) {
      inputRefference.current.focus();
    }
  }, [isEditing]); // Focus the input when editing starts

  const handleEditToggle = () => {
    if(isEditing){
      setIsEditing(false);
    }
    else{
      setIsEditing(true);
    }
  }; // Handles the edit button click

  const handleNameChange = (name) => {
    setName(name.target.value);
  }; // Handles the actual name change from the input field

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  }; // Handles the enter key press to save the name

  return ( 
    <div className="border-1 border-black rounded-3xl pl-2 pb-3 pt-3 pr-2 w-1/7 mb-6 text-center flex flex-row items-center">  
      {isEditing ? ( // Conditional rendering, It check if the editing is true or false and shows either the input field or the name
        <input ref={inputRefference} type="text" value={name} onChange={handleNameChange} onKeyDown={handleEnterKey} className="Jacques-Francois font-bold text-2xl  border-b-1 border-gray-600 focus:outline-none w-full" autoFocus/>
      ) : (
        <h2 className="Jacques-Francois font-bold text-2xl border-b-1 border-transparent">{name}</h2>
      )}
      <img src={isEditing ? SaveLogo : PenLogo} className="ml-auto cursor-pointer" alt={isEditing ? "save" : "edit"} width="20" height="20"onClick={handleEditToggle}/> 
    </div>
  ); // For the image the same thing, conditional rendering using ternary operator it shows the pen icon or the save icon depending on the state of isEditing, it is also clickable and starts the editing process or close it.
}
export default NameCard;