import Plant_gallery_card from '../components/Plant-gallery-card';
import Plant_upload_popup from '../components/Plant-upload-popup';
import PlantIcon from '../assets/plant_icon.jpeg';
import FilterIcon from '../assets/filter_icon.jpeg';
import PlantViewPopup from '../components/PlantViewPopup';
import { useState } from "react";
import { useDarkMode } from '../context/DarkModeContext';

//dummy data
const allPlants = [
    { id: 1, name: "Basil" },
    { id: 2, name: "Mint" },
    { id: 3, name: "Rosemary" },
];

function GalleryPage() {
    const { darkMode } = useDarkMode();
    const [isFilterOpen, setIsFilterOpen] = useState(false); 
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };
    const handleFilterSelect = (option) => {
        setIsFilterOpen(false); 
      };

    const filteredPlants = allPlants.filter(plant =>
        plant.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={`flex flex-row p-6 min-h-screen ${darkMode ? 'darkMode' : ''}`}>
           <div className='w-full'>
            <div className='flex flex-row items-center'>
                <img src={PlantIcon} alt="logo" className={`w-10 max-w-xs h-10 ${darkMode ? 'filter brightness-75' : ''}`} />
                <h1 className={`Jacques-Francois text-5xl p-3 ${darkMode ? 'text-gray-100' : ''}`}>Plant gallery</h1>
            </div>
            <div className="p-3 flex flex-col">
                <input
                    type="text"
                    id="plantSearch"
                    className={`w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-700 text-white border-gray-600' : 'border-gray-300'}`}
                    placeholder="Search plants..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="p-3">
                    <div className="relative inline-block">
                        <button onClick={toggleFilterMenu} className={`flex flex-row items-center gap-2 ${darkMode ? 'text-gray-200' : ''}`}>
                        <p>Sort/filter</p>
                        <img src={FilterIcon} alt="logo" className={`w-5 h-auto ${darkMode ? 'filter invert' : ''}`} />
                        </button>

                        {isFilterOpen && (
                        <div className={`absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg z-50 ${darkMode ? 'bg-slate-700 border border-gray-600' : 'bg-white border border-gray-300'}`}>
                            <ul className="py-1 text-left">
                            <li>
                                <a
                                href="#"
                                className={`block px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => handleFilterSelect("Option 1")}
                                >
                                Last week
                                </a>
                            </li>
                            <li>
                                <a
                                href="#"
                                className={`block px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => handleFilterSelect("Option 2")}
                                >
                                Last month
                                </a>
                            </li>
                            <li>
                                <a
                                href="#"
                                className={`block px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => handleFilterSelect("Option 3")}
                                >
                                Condition: good
                                </a>
                            </li>
                            </ul>
                        </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlants.length > 0 ? (
                    filteredPlants.map(plant => (
                        <div key={plant.id} onClick={() => setSelectedPlant(plant)}>
                            <Plant_gallery_card name={plant.name} />
                        </div>
                    ))
                    ) : (
                    <p className={`col-span-full text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No results</p>
                    )}
                </div>
            </div>
           </div>
           <div className="flex flex-col ml-auto p-3 gap-3">
            <button onClick={openModal} className={`py-2 px-4 rounded-xl text-white ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D5A632] hover:bg-black'}`}>
                Upload plant photo
                </button>
                <Plant_upload_popup isOpen={isModalOpen} onClose={closeModal} />
           </div>

           {selectedPlant && (
                <PlantViewPopup plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
            )}

        </div>
    )
}

export default GalleryPage;