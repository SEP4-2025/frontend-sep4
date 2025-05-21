import { useDarkMode } from '../context/DarkModeContext';
import MobileHeader from '../components/MobileHeader';
import PlantForm from '../components/Plant-form-popup';
import { compilePlantManagamentData } from '../utils/dataCompiler';
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/Loading-screen';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import PasswordConfirmPopup from '../components/PasswordConfirmPopup';
import filterArrow from '../assets/filterArrow.png';
import { deletePlant } from '../api/index.js';
import { useNavigate } from 'react-router-dom';

function PlantManagement({ toggleMobileNav }) {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [plantData, setPlantData] = useState([]);
    const [search, setSearch] = useState('');

    const [isPlantFormOpen, setIsPlantFormOpen] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState(null);

    const [openDropdownId, setOpenDropdownId] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    

    useEffect(() => {
        refreshPlantData();
    }, []);

    const refreshPlantData = () => {
        setIsLoading(true);
        compilePlantManagamentData()
            .then((plants) => {
                setPlantData(plants);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching Plant managament data:', error);
                setIsLoading(false);
            });
    };

    const searchedPlants = plantData.filter(plant =>
        plant.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddPlant = () => {
        setSelectedPlant(null);
        setIsPlantFormOpen(true);
    };
    const handleEditPlant = (plant) => {
        setSelectedPlant(plant);
        setIsPlantFormOpen(true);
        setOpenDropdownId(null);
    };
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };
    const handleDeleteConfirm = async () => {
        if (selectedPlant) {
            try {
                await deletePlant(selectedPlant.id);
                setPlantData((prevPlants) => prevPlants.filter((plant) => plant.id !== selectedPlant.id));
                setIsDeleteModalOpen(false);
                setSelectedPlant(null);
            } catch (error) {
                console.error('Error deleting plant:', error);
                alert('Failed to delete plant. Please check if any pictures are tight to this plant.');
            }
        }
    };
    const handleSeeInGallery = (plantName) => {
        navigate('/gallery', { state: { selectedPlant: plantName } });
    };


    const toggleDropdown = (plantId) => {
        if (openDropdownId === plantId) {
            setOpenDropdownId(null);
        } else {
            setOpenDropdownId(plantId);
        }
    };


    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
                <MobileHeader toggleMobileNav={toggleMobileNav} title="Plant Management" />
                <main className="flex-grow overflow-y-auto p-4 sm:p-6">
                    {/* Header Section - desktop */}
                    <div className='hidden lg:flex flex-col lg:justify-start w-full mb-6'>
                        <div className='flex flex-row w-full justify-between items-center'>
                            {/* Title Section */}
                            <div className="w-1/2 p-3 flex flex-col">
                                <h1 className={`Jacques-Francois text-left text-3xl sm:text-4xl lg:text-5xl ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                    Plant management
                                </h1>
                                <p className={`hidden lg:block mt-2 ${darkMode ? 'Manrope text-gray-400' : 'Manrope text-gray-400'}`}>
                                    Manage your plant collection
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Add New Plant */}
                    <div className=" Manrope flex flex-col sm:flex-row justify-between items-center w-full mb-6">
                        <div className="w-full sm:w-2/3 mb-4 sm:mb-0">
                            <input
                                type="text"
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-700 text-white border-gray-600 placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'}`}
                                placeholder="Search plants..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button onClick={handleAddPlant} className={`w-full cursor-pointer sm:w-auto py-2 px-6 rounded-lg text-white flex items-center justify-center ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D5A632] hover:bg-black'}`}>
                            Add new plant
                        </button>
                    </div>

                    {/* Plant Table */}
                    <div className="Manrope w-full">
                        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-50'}>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider flex items-center">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Species
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`Manrope divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {searchedPlants.length > 0 ? (
                                    searchedPlants.map((plant) => (
                                        <tr key={plant.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">{plant.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">{plant.species}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <div className="relative inline-block text-left">
                                                    <button
                                                        onClick={() => toggleDropdown(plant.id)}
                                                        className={`flex items-center justify-center ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
                                                    >
                                                        <img
                                                            src={filterArrow}
                                                            alt="actions-icon"
                                                            className={`w-5 h-5 cursor-pointer transition-transform duration-750 ${openDropdownId === plant.id ? 'rotate-180' : ''
                                                                } ${darkMode ? 'filter invert' : ''}`}
                                                        />
                                                    </button>

                                                    {openDropdownId === plant.id && (
                                                        <div
                                                            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 dropdown-animation ${darkMode ? 'bg-slate-700 border border-gray-600' : 'bg-white border border-gray-300'
                                                                }`}
                                                            style={{ top: '100%' }}
                                                        >
                                                            <ul className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                                <li>
                                                                    <a
                                                                        type="button"
                                                                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'
                                                                            }`}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handleEditPlant(plant);
                                                                        }}
                                                                        role="menuitem"
                                                                    >
                                                                        Edit
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a
                                                                        type="button"
                                                                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-red-400 hover:bg-slate-600' : 'text-red-600 hover:bg-gray-100'
                                                                            }`}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handleDeleteClick(plant.id);
                                                                            setSelectedPlant(plant);
                                                                        }}
                                                                        role="menuitem"
                                                                    >
                                                                        Delete
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a
                                                                        type="button"
                                                                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'
                                                                            }`}
                                                                        onClick={() => handleSeeInGallery(plant.name)}
                                                                        role="menuitem"
                                                                    >
                                                                        See in gallery
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center text-sm">
                                            No plants found. Add your first plant to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <PlantForm
                        isOpen={isPlantFormOpen}
                        onClose={() => setIsPlantFormOpen(false)}
                        initialPlant={selectedPlant}
                        onSuccess={refreshPlantData}
                    />
                </main>
            </div>

            {/* Delete confirmation modal */}
            {isDeleteModalOpen && (
                <PasswordConfirmPopup
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                    }}
                    onConfirm={handleDeleteConfirm}
                    actionName="delete this plant"
                />
            )}
        </>
    );
}

export default PlantManagement;