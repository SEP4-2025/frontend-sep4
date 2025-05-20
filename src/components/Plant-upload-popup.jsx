import logo from '../assets/GrowMate_Logo_Transparent.png';
import filterArrow from '../assets/filterArrow.png';
import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { getAllPlants, uploadPicture } from '../api/index.js';

function Plant_upload_popup({ isOpen, onClose }) {
  const { darkMode } = useDarkMode();
  const [note, setNote] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPlantMenuOpen, setIsPlantMenuOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plants, setPlants] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch all the plants from database
  useEffect(() => {
    if (isOpen) {
      getAllPlants()
        .then(plants => {
          setPlants(plants);
          if (plants.length > 0) {
            setSelectedPlant(plants[0]);
          }
        })
        .catch(error => {
          console.error('Failed to fetch plants:', error);
          setError('Failed to load plants. Please try again.');
        });
    }
  }, [isOpen]);

  // Function to handle plant menu open, similar to the one in Gallery page
  const togglePlantMenu = () => {
    setIsPlantMenuOpen(!isPlantMenuOpen);
  };

  const handlePlantSelect = (plant) => {
    setSelectedPlant(plant);
    setIsPlantMenuOpen(false);
  };

  // Function to handle the upload of the files
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function that handles all the upload logic using function from index.js
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }

    if (!selectedPlant) {
      setError('Please select a plant for this photo.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      await uploadPicture(selectedPlant.id, selectedFile, note);
      setIsUploading(false);
      setNote('');
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Error uploading picture:', error);
      setError('Failed to upload picture. Please try again.');
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 max-h-screen overflow-y-auto ${darkMode ? 'bg-gray-900/50' : 'bg-black/50'}`}>
      <div className={`w-full max-w-md p-6 rounded-xl shadow-lg flex flex-col items-center gap-4 ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
        {/* File upload area */}
        <div
          className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${darkMode
            ? 'bg-slate-800 border-gray-600 hover:bg-slate-700'
            : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
            }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Drag and drop an image here
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                or click to select a file
              </p>
            </>
          )}
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Plant selection dropdown */}
        <div className="w-full mb-3">
          <p className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Select plant:</p>
          <div className="relative w-full">
            <button
              onClick={togglePlantMenu}
              className={`w-full flex justify-between items-center px-4 py-2 border rounded-lg ${darkMode
                ? 'bg-slate-600 text-white border-gray-600'
                : 'border-gray-300 bg-white'}`}
            >
              <span>{selectedPlant ? selectedPlant.name || `Plant ${selectedPlant.id}` : 'Select a plant'}</span>
              <img
                src={filterArrow}
                className={`w-5 h-5 transition-transform duration-300 ${isPlantMenuOpen ? 'rotate-180' : ''} ${darkMode ? 'filter invert' : ''}`}
                alt="dropdown arrow"
              />
            </button>

            {isPlantMenuOpen && (
              <div className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${darkMode ? 'bg-slate-700 border border-gray-600' : 'bg-white border border-gray-300'}`}>
                <ul className="py-1 max-h-60 overflow-auto">
                  {plants.length > 0 ? (
                    plants.map(plant => (
                      <li
                        key={plant.id}
                        className={`px-4 py-2 cursor-pointer ${darkMode
                          ? 'text-gray-200 hover:bg-slate-600'
                          : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => handlePlantSelect(plant)}
                      >
                        {plant.name || `Plant ${plant.id}`}
                      </li>
                    ))
                  ) : (
                    <li className={`px-4 py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No plants available
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Note input */}
        <div className="w-full">
          <p className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Add a note:</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode
              ? 'bg-slate-600 text-white border-gray-600 placeholder-gray-400'
              : 'border-gray-300 placeholder-gray-500'
              }`}
            placeholder="Write a note about your plant..."
            rows="3"
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm w-full">{error}</p>
        )}
        {/* Action buttons */}
        <div className="flex flex-col w-full gap-2">
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !selectedPlant}
            className={`text-white py-2 px-4 rounded-xl ${darkMode
              ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-800'
              : 'bg-[#D5A632] hover:bg-[#c49928] disabled:bg-[#e0c072]'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isUploading ? 'Uploading...' : 'Upload plant photo'}
          </button>
          <button
            onClick={onClose}
            className={`${darkMode ? 'text-red-400' : 'text-red-500'} hover:underline py-2`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
export default Plant_upload_popup;