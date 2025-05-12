import React, { useState, useRef } from "react";
import { useDarkMode } from '../context/DarkModeContext';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import { updatePictureNote, updatePictureDate, addPicture } from '../api';

function PlantViewPopup({ plant, pictures = [], onClose, onUpdateSuccess }) {
    const { darkMode } = useDarkMode();
    const [activeIndex, setActiveIndex] = useState(0);
    const [note, setNote] = useState("");
    const [customDate, setCustomDate] = useState("");
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    
    if (!plant) return null;
    
    const currentPicture = pictures.length > 0 ? pictures[activeIndex] : null;
    
    // Format date if available
    const formattedDate = currentPicture?.date 
        ? format(new Date(currentPicture.date), 'MMM d, yyyy h:mm a')
        : 'No date available';
        
    // Initialize custom date input format (for the date-time input element)
    const dateInputValue = currentPicture?.date
        ? new Date(currentPicture.date).toISOString().slice(0, 16) // Format as YYYY-MM-DDThh:mm
        : new Date().toISOString().slice(0, 16);
    
    const handlePictureChange = (index) => {
        setActiveIndex(index);
        // Reset editor states when changing pictures
        setIsEditingNote(false);
        setIsEditingDate(false);
        
        // Set note if available in current picture
        if (pictures[index]?.note) {
            setNote(pictures[index].note);
        } else {
            setNote("");
        }
        
        // Set date if available
        if (pictures[index]?.date) {
            const date = new Date(pictures[index].date).toISOString().slice(0, 16);
            setCustomDate(date);
        } else {
            setCustomDate(new Date().toISOString().slice(0, 16));
        }
    };
    
    const handleEditNote = () => {
        // Allow editing the note even if there's no picture yet
        // If there is a picture, use its note, otherwise use empty string
        setNote(currentPicture?.note || "");
        setIsEditingNote(true);
    };
    
    const handleEditDate = () => {
        if (currentPicture?.date) {
            setCustomDate(new Date(currentPicture.date).toISOString().slice(0, 16));
        } else {
            setCustomDate(new Date().toISOString().slice(0, 16));
        }
        setIsEditingDate(true);
    };
    
    const handleChangePicture = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    const handleSaveNote = async () => {
        setIsLoading(true);
        try {
            // If there's a picture, update its note in the backend
            if (currentPicture) {
                await updatePictureNote(currentPicture.id, note);
                // Update local state
                pictures[activeIndex].note = note;
            } else {
                // Just save the note locally if no picture exists yet
                console.log('No picture to save note to, just updating UI state');
                // In a real app, you might want to show a message to the user
            }
            setIsEditingNote(false);
        } catch (error) {
            console.error("Error updating note:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveDate = async () => {
        if (!currentPicture) return;
        
        setIsLoading(true);
        try {
            // Parse the custom date input
            const newDate = new Date(customDate);
            await updatePictureDate(currentPicture.id, newDate.toISOString());
            
            // Update local state
            pictures[activeIndex].date = newDate.toISOString();
            setIsEditingDate(false);
            
            if (onUpdateSuccess) {
                onUpdateSuccess();
            }
        } catch (error) {
            console.error("Error updating date:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePictureUpload = async (e) => {
        if (!e.target.files || !e.target.files[0]) return;
        
        const file = e.target.files[0];
        setIsLoading(true);
        
        try {
            // Use the existing addPicture function from the API
            // We'll replace the current picture by deleting it and adding a new one
            // In a real app, you'd probably have a specific endpoint for updating pictures
            if (currentPicture) {
                // Add the new picture - we use the same plantId as the current picture
                const uploadResult = await addPicture(plant.id, file, currentPicture.note || note);
                
                // If successful, update the local pictures array with the new picture
                if (uploadResult && uploadResult.id) {
                    // Replace the current picture with the new one
                    pictures[activeIndex] = {
                        ...uploadResult,
                        imageUrl: URL.createObjectURL(file) // Use local URL for immediate display
                    };
                    
                    alert('Picture successfully updated!');
                    
                    if (onUpdateSuccess) {
                        onUpdateSuccess();
                    }
                }
            }
        } catch (error) {
            console.error('Error uploading new picture:', error);
            alert('Failed to update picture. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCancelEdit = () => {
        setNote(currentPicture?.note || "");
        setIsEditingNote(false);
    };
    
    const handleCancelDateEdit = () => {
        if (currentPicture?.date) {
            setCustomDate(new Date(currentPicture.date).toISOString().slice(0, 16));
        }
        setIsEditingDate(false);
    };
  
    return (
        <div className={`fixed inset-0 z-50 flex justify-center items-center p-4 ${darkMode ? 'bg-gray-900/50' : 'bg-black/50'}`}>
            <div className={`p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : ''}`}>{plant.name}</h2>
                    <button
                        className={`${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}
                        onClick={onClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Image display */}
                <div className="mb-4">
                    {currentPicture?.imageUrl ? (
                        <img 
                            src={currentPicture.imageUrl} 
                            alt={`${plant.name}`} 
                            className="w-full h-64 object-contain rounded-lg mb-2"
                        />
                    ) : (
                        <div className={`w-full h-64 flex items-center justify-center rounded-lg mb-2 ${darkMode ? 'bg-slate-800' : 'bg-gray-200'}`}>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No image available</p>
                        </div>
                    )}
                    
                    {/* Image date with edit option */}
                    <div className="flex justify-between items-center">
                        {isEditingDate ? (
                            <div className="w-full space-y-2">
                                <input
                                    type="datetime-local"
                                    value={customDate}
                                    onChange={(e) => setCustomDate(e.target.value)}
                                    className={`w-full text-sm border rounded px-2 py-1 ${darkMode ? 'bg-slate-600 text-white border-gray-600' : 'border-gray-300'}`}
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button 
                                        type="button"
                                        onClick={handleCancelDateEdit}
                                        className={`px-2 py-1 text-xs rounded ${darkMode ? 'text-gray-300 hover:bg-slate-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={handleSaveDate}
                                        className={`px-2 py-1 text-xs rounded text-white ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} disabled:opacity-50`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formattedDate}</p>
                                <button 
                                    onClick={handleEditDate} 
                                    className={`text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    Edit Date
                                </button>
                            </>
                        )}
                    </div>
                    
                    {/* Hidden file input for changing picture */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handlePictureUpload}
                    />
                    
                    {/* Button to change picture */}
                    <button 
                        onClick={handleChangePicture}
                        className={`mt-2 text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                        Change Picture
                    </button>
                </div>
                
                {/* Image thumbnails */}
                {pictures.length > 1 && (
                    <div className="flex overflow-x-auto space-x-2 pb-2 mb-4">
                        {pictures.map((pic, index) => (
                            <button
                                key={pic.id}
                                onClick={() => handlePictureChange(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${index === activeIndex ? (darkMode ? 'border-green-500' : 'border-green-600') : (darkMode ? 'border-gray-700' : 'border-gray-300')}`}
                            >
                                {pic.imageUrl ? (
                                    <img src={pic.imageUrl} alt={`${plant.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-slate-800' : 'bg-gray-200'}`}>
                                        <span className="text-xs">#{index + 1}</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Notes section */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Notes</h3>
                        {/* Always show the Edit button, regardless of currentPicture status */}
                        {!isEditingNote && (
                            <button 
                                onClick={handleEditNote}
                                className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                    
                    {isEditingNote ? (
                        <div className="space-y-2">
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-600 text-white border-gray-600 placeholder-gray-400' : 'border-gray-300'}`}
                                placeholder="Add note about this plant..."
                                rows="3"
                            />
                            <div className="flex justify-end space-x-2">
                                <button 
                                    onClick={handleCancelEdit}
                                    className={`px-3 py-1 rounded ${darkMode ? 'text-gray-300 hover:bg-slate-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveNote}
                                    className={`px-3 py-1 rounded text-white ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} disabled:opacity-50`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Note'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={`border rounded-lg p-3 min-h-[80px] ${darkMode ? 'border-gray-700 bg-slate-600 text-gray-200' : 'border-gray-300 bg-gray-50'}`}>
                            {currentPicture?.note ? (
                                <p>{currentPicture.note}</p>
                            ) : (
                                <p className={`italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    No notes for this picture. Click 'Edit' to add a note.
                                </p>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="text-center pt-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}">
                    <button
                        className={`mt-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

PlantViewPopup.propTypes = {
    plant: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    pictures: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            date: PropTypes.string,
            note: PropTypes.string,
            imageUrl: PropTypes.string
        })
    ),
    onClose: PropTypes.func.isRequired,
    onUpdateSuccess: PropTypes.func
};

export default PlantViewPopup;