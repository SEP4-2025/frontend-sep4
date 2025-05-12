import logo from '../assets/GrowMate_Logo_Transparent.png';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { addPicture, createPlant, getAllPlants } from '../api';

function Plant_upload_popup({isOpen, onClose, onUploadSuccess}) {
    const { darkMode } = useDarkMode();
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [note, setNote] = useState('');
    const [plantName, setPlantName] = useState('');
    const [plantSpecies, setPlantSpecies] = useState(''); // Add state for species
    const [existingPlants, setExistingPlants] = useState([]);
    const [selectedPlantId, setSelectedPlantId] = useState(null);
    const [isNewPlant, setIsNewPlant] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Fetch existing plants when popup opens
        if (isOpen) {
            fetchPlants();
        } else {
            // Reset form when popup closes
            resetForm();
        }
    }, [isOpen]);

    // Create a preview when a file is selected
    useEffect(() => {
        if (!selectedFile) return;

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        // Free memory when component is removed from the DOM
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const fetchPlants = async () => {
        try {
            const plants = await getAllPlants();
            setExistingPlants(plants);
        } catch (err) {
            setError('Failed to load plants. Please try again.');
            console.error('Error fetching plants:', err);
        }
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
                setError(null);
            } else {
                setError('Please upload an image file');
            }
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
                setError(null);
            } else {
                setError('Please upload an image file');
            }
        }
    };

    const handleButtonClick = () => {
        inputRef.current.click();
    };

    const handlePlantSelection = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setIsNewPlant(true);
            setSelectedPlantId(null);
        } else {
            setIsNewPlant(false);
            setSelectedPlantId(parseInt(value));
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setPreview(null);
        setNote('');
        setPlantName('');
        setPlantSpecies(''); // Reset species field
        setSelectedPlantId(null);
        setIsNewPlant(false);
        setError(null);
        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let plantId = selectedPlantId;

            // If it's a new plant, create it first
            if (isNewPlant) {
                if (!plantName.trim()) {
                    setError('Please enter a plant name');
                    setIsLoading(false);
                    return;
                }
                
                if (!plantSpecies.trim()) {
                    setError('Please enter a plant species');
                    setIsLoading(false);
                    return;
                }
                
                try {
                    // Use the explicit species input field value
                    const newPlant = await createPlant(plantName, plantSpecies);
                    plantId = newPlant.id;
                } catch (err) {
                    console.error('Error creating plant:', err);
                    setError(err.message || 'Failed to create plant. Please try again.');
                    setIsLoading(false);
                    return;
                }
            }

            // Check if we have a file and plant ID
            if (!selectedFile) {
                setError('Please select an image file');
                setIsLoading(false);
                return;
            }

            if (!plantId) {
                setError('Please select a plant or create a new one');
                setIsLoading(false);
                return;
            }

            // Upload the picture
            await addPicture(plantId, selectedFile, note);
            
            // Reset and close
            resetForm();
            if (onUploadSuccess) onUploadSuccess();
            onClose();
        } catch (err) {
            setError('Failed to upload image. Please try again.');
            console.error('Error uploading image:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 max-h-screen overflow-y-auto ${darkMode ? 'bg-gray-900/50' : 'bg-black/50'}`}>
            <div className={`w-full max-w-md p-6 rounded-xl shadow-lg flex flex-col items-center gap-4 ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <img src={logo} alt="logo" className={`w-full max-w-xs h-auto block mx-auto ${darkMode ? 'filter brightness-90' : ''}`} />
                <h2 className={`text-xl font-bold ${darkMode ? 'text-gray-200' : ''}`}>Upload Plant Photo</h2>
                
                {error && (
                    <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    {/* Drag & Drop Area */}
                    <div 
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                        ${darkMode ? 'bg-slate-600 border-gray-500 hover:bg-slate-500' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}
                        ${dragActive ? (darkMode ? 'bg-slate-500 border-green-500' : 'bg-green-50 border-green-500') : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={handleButtonClick}
                    >
                        <input 
                            type="file" 
                            ref={inputRef}
                            onChange={handleChange}
                            accept="image/*"
                            className="hidden"
                            id="upload-input"
                        />
                        
                        {preview ? (
                            <div className="space-y-2">
                                <img 
                                    src={preview} 
                                    alt="Preview" 
                                    className="max-h-48 mx-auto object-contain"
                                />
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Drag and drop an image, or click to select</p>
                            </div>
                        )}
                    </div>

                    {/* Plant Selection */}
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Select Plant
                        </label>
                        <select
                            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-600 text-white border-gray-600' : 'border-gray-300'}`}
                            value={selectedPlantId || (isNewPlant ? 'new' : '')}
                            onChange={handlePlantSelection}
                        >
                            <option value="">-- Select a plant --</option>
                            {existingPlants.map(plant => (
                                <option key={plant.id} value={plant.id}>{plant.name}</option>
                            ))}
                            <option value="new">+ Add new plant</option>
                        </select>
                    </div>
                    
                    {/* New Plant Fields (conditional) */}
                    {isNewPlant && (
                        <div className="space-y-4">
                            {/* Plant Name Field */}
                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    New Plant Name *
                                </label>
                                <input
                                    type="text"
                                    value={plantName}
                                    onChange={(e) => setPlantName(e.target.value)}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-600 text-white border-gray-600 placeholder-gray-400' : 'border-gray-300'}`}
                                    placeholder="Enter plant name..."
                                    required
                                />
                            </div>
                            
                            {/* Plant Species Field */}
                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Plant Species *
                                </label>
                                <input
                                    type="text"
                                    value={plantSpecies}
                                    onChange={(e) => setPlantSpecies(e.target.value)}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-600 text-white border-gray-600 placeholder-gray-400' : 'border-gray-300'}`}
                                    placeholder="Enter plant species..."
                                    required
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Note Input */}
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Add a Note (Optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-600 text-white border-gray-600 placeholder-gray-400' : 'border-gray-300'}`}
                            placeholder="Add notes about this plant photo..."
                            rows="3"
                        />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-col gap-2">
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`text-white py-2 px-4 rounded-xl disabled:opacity-50 ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D5A632] hover:bg-black'}`}
                        >
                            {isLoading ? 'Uploading...' : 'Upload Photo'}
                        </button>
                        <button 
                            type="button"
                            onClick={onClose} 
                            className={`${darkMode ? 'text-red-400' : 'text-red-500'} hover:underline`}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Plant_upload_popup;