import PlantGalleryCard from '../components/PlantGalleryCard';
import PlantUploadPopup from '../components/PlantUploadPopup';
import LoadingScreen from '../components/LoadingScreen';
import filterArrow from '../assets/filterArrow.png';
import { useEffect, useState } from "react";
import { useDarkMode } from '../context/DarkModeContext';
import { useLocation } from 'react-router-dom';
import { compileGalleryPageData } from '../utils/dataCompiler';

function GalleryPage() {
    const { darkMode } = useDarkMode();
    const location = useLocation();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterOption, setFilterOption] = useState("All");
    const [isPlantMenuOpen, setIsPlantMenuOpen] = useState(false);
    const [plantMenuOption, setPlantMenuOption] = useState("All plants");
    const [plantData, setPlantData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        compileGalleryPageData()
            .then((plants) => {
                setPlantData(plants);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching Gallery page data:', error);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (location.state && location.state.selectedPlant) {
            setPlantMenuOption(location.state.selectedPlant);
        }
    }, [location.state]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };
    const togglePlantMenu = () => {
        setIsPlantMenuOpen(!isPlantMenuOpen);
    }

    const handleFilterSelect = (option) => {
        setFilterOption(option);
        setIsFilterOpen(false);
    };

    const handlePlantMenuSelect = (option) => {
        setPlantMenuOption(option);
        setIsPlantMenuOpen(false);
    };

    const refreshData = () => {
        setIsLoading(true);
        compileGalleryPageData()
            .then((plants) => {
                setPlantData(plants);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error refreshing data:', error);
                setIsLoading(false);
            });
    }

    const handleNoteUpdate = async () => {
        refreshData();
    };
    const handlePictureDelete = async () => {
        refreshData();
    };
    const handleUploadSuccess = () => {
        refreshData();
    };

    const searchedPlants = plantData.filter(plant =>
        (plant.name || '').toLowerCase().includes(search.toLowerCase())
    );

    const allPicturesFromSearchedPlants = searchedPlants
        .filter(plant => plant.pictures && plant.pictures.length > 0)
        .flatMap(plant =>
            plant.pictures.map(picture => ({
                plant,
                picture,
                date: new Date(picture.timeStamp)
            }))
        );

    const dateFilteredFlatList = allPicturesFromSearchedPlants.filter(item => {
        if (filterOption === "All") return true;
        const pictureDate = item.date;
        if (filterOption === "Last week") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);
            return pictureDate >= sevenDaysAgo;
        }
        if (filterOption === "Last month") {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            oneMonthAgo.setHours(0, 0, 0, 0);
            return pictureDate >= oneMonthAgo;
        }
        if (filterOption === "Today") {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const tomorrowStart = new Date(todayStart);
            tomorrowStart.setDate(tomorrowStart.getDate() + 1);
            return pictureDate >= todayStart && pictureDate < tomorrowStart;
        }
        return false;
    });

    const sortedDateFilteredFlatList = dateFilteredFlatList.sort((a, b) => b.date - a.date);

    const plantMenuFilteredPlants = plantMenuOption === "All plants"
        ? sortedDateFilteredFlatList
        : sortedDateFilteredFlatList.filter(({ plant }) => (plant.name || `Plant ${plant.id}`) === plantMenuOption);


    if (isLoading) {
        return <LoadingScreen />;
    }
    return (
        <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
            <main className="flex-grow overflow-y-auto p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="flex-1 flex flex-col items-center lg:items-start w-full lg:order-1">
                        <div className='hidden lg:flex flex-col lg:justify-start w-full'>
                            <div className='hidden lg:flex flex-row w-full justify-between items-center'>
                                <div className="w-1/3 p-3 flex flex-col">
                                    <h1 className={`Jacques-Francois text-left text-3xl sm:text-4xl lg:text-5xl ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                        Plant gallery
                                    </h1>
                                    <p className={`hidden lg:block mt-2 ${darkMode ? 'Manrope text-gray-400' : 'Manrope text-gray-400'}`}>View your plant collection</p>
                                </div>
                                <div className='flex flex-row items-end justify-end w-full gap-4'>
                                    <input
                                        type="text"
                                        id="plantSearch"
                                        className={`w-full max-w-md lg:max-w-sm border rounded-lg px-4 py-2 my-4 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-700 text-white border-gray-600 placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'}`}
                                        placeholder="Search plants..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <div className="relative inline-block">
                                        <button onClick={() => {
                                            if (isFilterOpen) {
                                                setIsFilterOpen(false);
                                            }
                                            togglePlantMenu();
                                        }} className={`border-1 flex flex-row items-center gap-2 py-2 my-4 px-4 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-gray-600' : 'border-gray-300'}`}>
                                            <p className='Manrope '>{plantMenuOption}</p>
                                            <img src={filterArrow} className={`w-5 h-5 transition-transform duration-750 ${isPlantMenuOpen ? 'rotate-180' : ''}  ${darkMode ? 'filter invert' : ''}`} alt="filter arrow" />
                                        </button>
                                        {isPlantMenuOpen && (
                                            <div className={`absolute top-full right-0  w-48 rounded-md shadow-lg z-50 dropdown-animation ${darkMode ? 'bg-slate-700 border border-gray-600' : 'bg-white border border-gray-300'}`}>
                                                <ul className="py-1 text-left " role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                    <li>
                                                        <a
                                                            type="button"
                                                            className={`block px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                            onClick={() => handlePlantMenuSelect("All plants")}
                                                            role="menuitem"
                                                        >
                                                            All plants
                                                        </a>
                                                    </li>
                                                    {plantData.map(plant => (
                                                        <li key={plant.id}>
                                                            <a
                                                                type="button"
                                                                className={`block px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                                onClick={() => handlePlantMenuSelect(plant.name || `Plant ${plant.id}`)}
                                                                role="menuitem"
                                                            >
                                                                {plant.name || `Plant ${plant.id}`}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={openModal} className={`py-2 my-4 px-6 rounded-lg text-white ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D5A632] hover:bg-black'}`}>
                                        Upload plant photo
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:hidden flex flex-col items-center w-full gap-3 mt-4 mb-6">
                            <button onClick={openModal} className={`py-2 px-4 rounded-xl text-white ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D5A632] hover:bg-black'}`}>
                                Upload plant photo
                            </button>
                        </div>

                        <div className="relative inline-block lg:hidden">
                            <button onClick={() => {
                                if (isFilterOpen) {
                                    setIsFilterOpen(false);
                                }
                                togglePlantMenu();
                            }} className={`border-1 flex flex-row items-center gap-2 py-2 my-4 px-4 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-gray-600' : 'border-gray-300'}`}>
                                <p className='Manrope '>{plantMenuOption}</p>
                                <img src={filterArrow} className={`w-5 h-5 transition-transform duration-750 ${isPlantMenuOpen ? 'rotate-180' : ''}  ${darkMode ? 'filter invert' : ''}`} alt="filter arrow" />
                            </button>
                            {isPlantMenuOpen && (
                                <div className={`absolute top-full right-0  w-48 rounded-md shadow-lg z-50 dropdown-animation ${darkMode ? 'bg-slate-700 border border-gray-600' : 'bg-white border border-gray-300'}`}>
                                    <ul className="py-1 text-left " role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <li>
                                            <a
                                                type="button"
                                                className={`block px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                onClick={() => handlePlantMenuSelect("All plants")}
                                                role="menuitem"
                                            >
                                                All plants
                                            </a>
                                        </li>
                                        {plantData.map(plant => (
                                            <li key={plant.id}>
                                                <a
                                                    type="button"
                                                    className={`block px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                    onClick={() => handlePlantMenuSelect(plant.name || `Plant ${plant.id}`)}
                                                    role="menuitem"
                                                >
                                                    {plant.name || `Plant ${plant.id}`}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center lg:justify-end w-full mb-4">
                            <div className="relative inline-block text-left">
                                <button onClick={() => {
                                    if (isPlantMenuOpen) {
                                        setIsPlantMenuOpen(false);
                                    }
                                    toggleFilterMenu();
                                }} className={`border-1 flex flex-row items-center gap-2 py-2 px-4 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-gray-600' : 'border-gray-300'}`}>
                                    <p>Sort by: {filterOption}</p>
                                    <img src={filterArrow} className={`w-5 h-5 transition-transform duration-750 ${isFilterOpen ? 'rotate-180' : ''}  ${darkMode ? 'filter invert' : ''}`} alt="filter arrow" />
                                </button>
                                {isFilterOpen && (
                                    <div className={`origin-top-left lg:origin-top-left absolute mt-2 w-48 rounded-md shadow-lg z-50 ${darkMode ? 'bg-slate-700 border border-gray-600' : 'bg-white border border-gray-300'} left-1/2 -translate-x-1/2 lg:left-0 lg:-translate-x-0`}>
                                        <ul className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <li>
                                                <a
                                                    type="button"
                                                    className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                    onClick={() => handleFilterSelect("All")}
                                                    role="menuitem"
                                                >
                                                    All
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    type="button"
                                                    className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                    onClick={() => handleFilterSelect("Today")}
                                                    role="menuitem"
                                                >
                                                    Today
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    type="button"
                                                    className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                    onClick={() => handleFilterSelect("Last week")}
                                                    role="menuitem"
                                                >
                                                    Last week
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    type="button"
                                                    className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                    onClick={() => handleFilterSelect("Last month")}
                                                    role="menuitem"
                                                >
                                                    Last month
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {plantMenuFilteredPlants.length > 0 ? (
                                plantMenuFilteredPlants.map(({ plant, picture }) => (
                                    <div key={picture.id || `${plant.id}-${picture.url}-${Math.random()}`}>
                                        <PlantGalleryCard
                                            name={plant.name || `Plant ${plant.id}`}
                                            imageUrl={picture.url || "https://via.placeholder.com/150/92c952"}
                                            note={picture.note}
                                            time={picture.timeStamp ? picture.timeStamp.split('T')[0] : "No date available"}
                                            pictureId={picture.id}
                                            onNoteUpdate={handleNoteUpdate}
                                            onPictureDelete={handlePictureDelete}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className={`col-span-full text-center py-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    No results found {search ? `for "${search}"` : ""} {filterOption !== "All" ? `with filter "${filterOption}"` : ""} {plantMenuOption !== "All plants" ? `for plant "${plantMenuOption}"` : ""}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <PlantUploadPopup
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onUploadSuccess={handleUploadSuccess}
                />
            </main>
        </div>
    );
}

export default GalleryPage;