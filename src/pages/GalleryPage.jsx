import Plant_gallery_card from '../components/Plant-gallery-card';
import Plant_upload_popup from '../components/Plant-upload-popup';
import PlantIcon from '../assets/plant_icon.jpeg';
import FilterIcon from '../assets/filter_icon.jpeg';
import PlantViewPopup from '../components/PlantViewPopup';
import { useState, useEffect, useCallback } from "react";
import { useDarkMode } from '../context/DarkModeContext';
import { getAllPlants, getPicturesByPlantId } from '../api';

function GalleryPage() {
    const { darkMode } = useDarkMode();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [plants, setPlants] = useState([]);
    const [pictures, setPictures] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterOption, setFilterOption] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Function to fetch all plants and their pictures
    const fetchGalleryData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Fetch all plants
            const plantsData = await getAllPlants();
            setPlants(plantsData);
            
            // Fetch pictures for each plant
            const picturesMap = {};
            
            // Use Promise.all to fetch pictures for all plants in parallel
            await Promise.all(plantsData.map(async (plant) => {
                try {
                    const plantPictures = await getPicturesByPlantId(plant.id);
                    if (plantPictures && plantPictures.length > 0) {
                        picturesMap[plant.id] = plantPictures;
                    }
                } catch (err) {
                    console.error(`Error fetching pictures for plant ${plant.id}:`, err);
                }
            }));
            
            setPictures(picturesMap);
        } catch (err) {
            console.error('Error fetching gallery data:', err);
            setError('Failed to load gallery data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch data on component mount and after successful upload
    useEffect(() => {
        fetchGalleryData();
    }, [fetchGalleryData]);

    const handleUploadSuccess = useCallback(() => {
        fetchGalleryData();
    }, [fetchGalleryData]);

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleFilterSelect = (option) => {
        setFilterOption(option);
        setIsFilterOpen(false);
    };

    // Filter plants based on search and filter options
    const filteredPlants = plants.filter(plant => 
        plant.name.toLowerCase().includes(search.toLowerCase())
    );

    // Get the latest picture for each plant (for display in cards)
    const getLatestPicture = (plantId) => {
        if (!pictures[plantId] || pictures[plantId].length === 0) {
            return null;
        }
        // Sort pictures by date (newest first) and return the latest
        return [...pictures[plantId]].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        )[0];
    };

    return (
        <div className={`flex flex-row p-6 min-h-screen ${darkMode ? 'darkMode' : ''}`}>
            <div className='w-full'>
                <div className='flex flex-row items-center'>
                    <img src={PlantIcon} alt="logo" className={`w-10 max-w-xs h-10 ${darkMode ? 'filter brightness-75' : ''}`} />
                    <h1 className={`Jacques-Francois text-5xl p-3 ${darkMode ? 'text-gray-100' : ''}`}>Plant gallery</h1>
                </div>
                
                {error && (
                    <div className="mt-4 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <div className="p-3 flex flex-col">
                    <div className="flex flex-row items-center gap-4">
                        <input
                            type="text"
                            id="plantSearch"
                            className={`md:w-1/3 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-700 text-white border-gray-600' : 'border-gray-300'}`}
                            placeholder="Search plants..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        
                        <div className="relative inline-block">
                            <button 
                                onClick={toggleFilterMenu} 
                                className={`flex flex-row items-center gap-2 px-3 py-2 rounded ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'hover:bg-gray-100'}`}
                            >
                                <p>Filter</p>
                                <img src={FilterIcon} alt="filter icon" className={`w-5 h-auto ${darkMode ? 'filter invert' : ''}`} />
                            </button>

                            {isFilterOpen && (
                                <div className={`absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg z-50 ${darkMode ? 'bg-slate-700 border border-gray-600' : 'bg-white border border-gray-300'}`}>
                                    <ul className="py-1 text-left">
                                        <li>
                                            <button
                                                className={`block w-full text-left px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                onClick={() => handleFilterSelect('recent')}
                                            >
                                                Most recent
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`block w-full text-left px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                onClick={() => handleFilterSelect('alphabetical')}
                                            >
                                                Alphabetical
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`block w-full text-left px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                onClick={() => handleFilterSelect(null)}
                                            >
                                                Clear filters
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center mt-8">
                            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-gray-300' : 'border-green-500'}`}></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                            {filteredPlants.length > 0 ? (
                                filteredPlants.map(plant => (
                                    <div key={plant.id} onClick={() => setSelectedPlant(plant)}>
                                        <Plant_gallery_card 
                                            plant={plant} 
                                            picture={getLatestPicture(plant.id)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className={`col-span-full text-center my-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {plants.length === 0 ? 'No plants in the gallery yet. Add your first plant!' : 'No results found for your search.'}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex flex-col ml-auto p-3 gap-3">
                <button 
                    onClick={openModal} 
                    className={`py-2 px-4 rounded-xl text-white ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D5A632] hover:bg-black'}`}
                >
                    Upload plant photo
                </button>
                <Plant_upload_popup 
                    isOpen={isModalOpen} 
                    onClose={closeModal} 
                    onUploadSuccess={handleUploadSuccess}
                />
            </div>

            {selectedPlant && (
                <PlantViewPopup 
                    plant={selectedPlant} 
                    pictures={pictures[selectedPlant.id] || []} 
                    onClose={() => setSelectedPlant(null)} 
                />
            )}
        </div>
    );
}

export default GalleryPage;