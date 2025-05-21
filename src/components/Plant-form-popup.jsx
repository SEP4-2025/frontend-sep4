import { useState, useEffect } from "react";
import { useDarkMode } from "../context/DarkModeContext";

function Plant_form_popup({ isOpen, onClose, onAddSuccess, initialPlant = null }) {
    const { darkMode } = useDarkMode();
    const [plantName, setPlantName] = useState('');
    const [species, setSpecies] = useState('');
    const [error, setError] = useState(''); // Add error handling

    // Prevent clicks inside the modal from closing it
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    useEffect(() => {
        if (initialPlant) {
            setPlantName(initialPlant.name || '');
            setSpecies(initialPlant.species || '');
        } else {
            setPlantName('');
            setSpecies('');
        }
    }, [initialPlant, isOpen]);


    if (!isOpen) return null;
    return (
        <div onClick={onClose} className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-transparent bg-opacity-80' : 'bg-transparent bg-opacity-70'} backdrop-blur-md`}>
            <div onClick={handleModalClick} className={`w-full max-w-md rounded-lg shadow-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'}`}>
                <div className="p-6">
                    <h2 className={`Manrope text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {initialPlant ? 'Edit Plant' : 'Add New Plant'}
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Plant Name</label>
                            <input
                                type="text"
                                value={plantName}
                                onChange={(e) => setPlantName(e.target.value)}
                                className={`w-full p-3 rounded-md border ${darkMode
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                placeholder="Enter plant name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Species</label>
                            <input
                                type="text"
                                value={species}
                                onChange={(e) => setSpecies(e.target.value)}
                                className={`w-full p-3 rounded-md border ${darkMode
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                placeholder="Enter plant species"
                            />
                        </div>
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                onClick={onClose}
                                className={`px-4 py-2 rounded-md ${darkMode
                                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md text-white ${darkMode
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-[#D5A632] hover:bg-[#c4972d]'
                                    }`}
                            >
                                {initialPlant ? 'Update' : 'Add'} Plant
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Plant_form_popup;