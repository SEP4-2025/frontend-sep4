import deleteIcon from '../assets/delete-icon.svg';
import penIcon from '../assets/pen-icon.svg';
import calendarIcon from '../assets/calendar-icon-gray.svg';
import saveIcon from '../assets/saveIcon.svg';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import { editPictureNote, deletePicture } from '../api/index.js';
import ExpandedImageModal from './ExpandedImageModal.jsx';
import DeleteConfirmationModal from './DeleteConfirmationModal.jsx';
import { useState } from 'react';

function PlantGalleryCard({ name, time, imageUrl, note, pictureId, onNoteUpdate, onPictureDelete }) {
    const { darkMode } = useDarkMode();
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNote, setEditedNote] = useState(note || "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [noteError, setNoteError] = useState("");


    // Image clicker functions
    const handleImageClick = (e) => {
        e.stopPropagation();
        setIsImageExpanded(true);
    };

    // Edit note function
    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditedNote(note || "");
        setNoteError("");
    };

    const handleSaveClick = async (e) => {
        e.stopPropagation();

        if (!editedNote.trim()) {
            setNoteError("Please enter a note before saving.");
            return;
        }

        if (!pictureId) {
            console.error("Cannot save note: No picture ID provided");
            return;
        }
        try {
            await editPictureNote(pictureId, editedNote);
            setIsEditing(false);
            setNoteError("");
            if (onNoteUpdate) {
                onNoteUpdate(pictureId, editedNote);
            }
        } catch (error) {
            console.error("Failed to save note:", error);
            setNoteError("Failed to save note. Please try again.");
        }
    };

    // Delete note function
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!pictureId) {
            console.error("Cannot delete picture: No picture ID provided");
            setIsDeleteModalOpen(false);
            return;
        }

        try {
            await deletePicture(pictureId);
            setIsDeleteModalOpen(false);
            if (onPictureDelete) {
                onPictureDelete(pictureId);
            }
        } catch (error) {
            console.error("Failed to delete picture:", error);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <>
            <div className={`Manrope flex flex-col items-center justify-center rounded-lg p-4 shadow-md border-1 border-[#AFA8A8] ${darkMode ? 'bg-slate-700' : 'bg-[#F3F3F3]'}`}>
                <div className={`w-full p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <div className='flex flex-col space-y-2'>
                        <p className='text-center font-medium'>{name}</p>
                        <div className='flex items-center justify-center gap-2'>
                            <img src={calendarIcon} alt="calendar-icon" className={`w-5 h-5 ${darkMode ? 'filter invert' : ''}`} />
                            <p className={`text-sm ${darkMode ? 'text-[#dfdde4]' : 'text-gray-400'}`}>{time}</p>
                        </div>
                    </div>
                </div>
                <div className='mt-4 w-full h-90 overflow-hidden'>
                    <img
                        src={imageUrl}
                        alt="picture"
                        className={`w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform ${darkMode ? 'filter brightness-90' : ''}`}
                        onClick={handleImageClick}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150/92c952";
                        }}
                    />
                </div>
                <div className={`w-full h-full mt-4 ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
                    <textarea
                        value={isEditing ? editedNote : (note || "")}
                        placeholder={isEditing ? "Write a note about your plant..." : "No note available for this plant"}
                        readOnly={!isEditing}
                        onChange={(e) => isEditing && setEditedNote(e.target.value)}
                        className={`w-full h-20 p-2 resize-none focus:outline-none focus:ring-1 focus:ring-green-500 ${darkMode
                            ? 'bg-slate-700 text-gray-200 placeholder-gray-400 border border-slate-600'
                            : 'bg-white text-gray-800 placeholder-gray-500 border border-gray-200'
                            } ${isEditing ? 'border-green-500' : ''}`}
                    />
                </div>
                {/* Error message display */}
                <div className="h-6 mt-1 px-2">
                    {noteError && (
                        <p className="text-red-500 text-sm">
                            {noteError}
                        </p>
                    )}
                </div>
                <div className='flex flex-row w-full mt-4 gap-4'>
                    {isEditing ? (
                        <button
                            className={`mr-auto cursor-pointer rounded-lg px-6 py-4 text-center flex flex-row gap-4 items-center border-1 ${darkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
                            onClick={handleSaveClick}
                        >
                            <span>Save Note</span>
                            <img src={saveIcon} alt="save-icon" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />
                        </button>
                    ) : (
                        <button
                            className={`mr-auto cursor-pointer rounded-lg px-6 py-4 text-center flex flex-row gap-4 items-center border-1 border-[#AFA8A8] hover:bg-opacity-80 transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-gray-100'}`}
                            onClick={handleEditClick}
                        >
                            <span>Edit note</span>
                            <img src={penIcon} alt="edit-icon" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />
                        </button>
                    )}
                    <button onClick={handleDeleteClick} className={`ml-auto cursor-pointer rounded-lg px-6 py-4 text-center flex flex-row gap-4 items-center border-1 border-[#AFA8A8] hover:bg-opacity-80 transition-colors ${darkMode ? 'bg-red-800 hover:bg-red-700 text-white border-red-700' : 'bg-red-500 hover:bg-red-600 text-white border-red-400'}`}>
                        <span>Delete photo</span>
                        <img src={deleteIcon} alt="delete-icon" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Image modal */}
            {isImageExpanded && (
                <ExpandedImageModal
                    image={imageUrl}
                    alt={name}
                    onClose={() => setIsImageExpanded(false)}
                />
            )}

            {/* Delete confirmation modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Photo"
                    message="Are you sure you want to delete this photo?"
                />
            )}
        </>
    );
}

export default PlantGalleryCard;