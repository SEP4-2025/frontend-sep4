import Plant_gallery_card from '../components/Plant-gallery-card';
import Plant_upload_popup from '../components/Plant-upload-popup';
import PlantIcon from '../assets/plant_icon.svg';
import filterArrow from '../assets/filterArrow.png';
import FilterIcon from '../assets/filter_icon.svg'; // Corrected import
import calendarIcon from '../assets/calendar-icon-gray.svg';
import PlantViewPopup from '../components/PlantViewPopup';
import { useState } from "react";
import { useDarkMode } from '../context/DarkModeContext';
import MobileHeader from '../components/MobileHeader';

//dummy data
const allPlants = [
    { id: 1, name: "Basil", imageUrl: "https://via.placeholder.com/150/92c952", date: "2024-05-10", condition: "good" },
    { id: 2, name: "Mint", imageUrl: "https://via.placeholder.com/150/771796", date: "2024-04-20", condition: "fair" },
    { id: 3, name: "Rosemary", imageUrl: "https://via.placeholder.com/150/24f355", date: "2024-05-01", condition: "good" },
    { id: 4, name: "Thyme", imageUrl: "https://via.placeholder.com/150/d32776", date: "2024-03-15", condition: "excellent" },
    { id: 5, name: "Oregano", imageUrl: "https://via.placeholder.com/150/f66b97", date: "2024-05-12", condition: "good" },
    { id: 6, name: "Sage", imageUrl: "https://via.placeholder.com/150/56a8c2", date: "2024-04-01", condition: "poor" },
];

function GalleryPage({ toggleMobileNav }) {
    const { darkMode } = useDarkMode();
    const [isFilterOpen, setIsFilterOpen] = useState(false); // filter menu state
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState(null); // For PlantViewPopup
    const [filterOption, setFilterOption] = useState("All"); // To store the selected filter

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleFilterSelect = (option) => {
        setFilterOption(option);
        setIsFilterOpen(false);
        // Implement actual filtering logic based on 'option' if needed beyond search
        // For now, it just closes the menu and sets the option.
        // The filtering based on search is already handled by `filteredPlants`.
        // If "Last week", "Last month", "Condition: good" need to modify `allPlants` or a derived state,
        // that logic would go here or be triggered from here.
    };

    // Filter plants based on search term
    const searchedPlants = allPlants.filter(plant =>
        plant.name.toLowerCase().includes(search.toLowerCase())
    );

    // Further filter based on the selected dropdown option (example logic)
    const filteredPlants = searchedPlants.filter(plant => {
        if (filterOption === "All") return true;
        if (filterOption === "Condition: good") return plant.condition === "good";
        // Add more complex date filtering for "Last week" / "Last month" if required
        // This would involve parsing plant.date and comparing with current date
        return true; // Default to true if filter option not yet implemented for data filtering
    });


    return (
        <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
           <MobileHeader toggleMobileNav={toggleMobileNav} title="Plant Gallery" />
           <main className="flex-grow overflow-y-auto p-4 sm:p-6">
                {/* Overall container for gallery content and desktop upload button */}
                <div className="flex flex-col lg:flex-row lg:gap-6">

                    {/* Main content area: Title, Mobile Upload, Search, Filter, Grid */}
                    <div className="flex-1 flex flex-col items-center lg:items-start w-full lg:order-1">
                        {/* Title Section */}
                        <div className='hidden lg:flex flex-row items-center justify-center lg:justify-start w-full'>
                            <img src={PlantIcon} alt="Plant Icon" className={`w-8 h-8 sm:w-10 sm:h-10 ${darkMode ? 'invert' : ''}`} />
                            <h1 className={`Jacques-Francois text-center lg:text-left text-3xl sm:text-4xl lg:text-5xl p-3 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Plant gallery</h1>
                        </div>

                        {/* Upload button section - Mobile Only (Centered) */}
                        <div className="lg:hidden flex flex-col items-center w-full gap-3 mt-4 mb-6">
                            <button onClick={openModal} className={`py-2 px-4 rounded-xl text-white ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D5A632] hover:bg-black'}`}>
                                Upload plant photo
                            </button>
                        </div>
                        
                        {/* Search Input */}
                        <input
                            type="text"
                            id="plantSearch"
                            className={`w-full max-w-md lg:max-w-sm border rounded-lg px-4 py-2 my-4 focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-slate-700 text-white border-gray-600 placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'}`}
                            placeholder="Search plants..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* Filter section */}
                        <div className="flex justify-center lg:justify-start w-full lg:w-auto mb-4">
                            <div className="relative inline-block text-left">
                                <button onClick={toggleFilterMenu} className={`flex flex-row items-center gap-2 py-2 px-3 rounded-md ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                                    <p>Sort/filter: {filterOption}</p> {/* Display current filter */}
                                    <img src={FilterIcon} alt="Filter Icon" className={`w-5 h-auto ${darkMode ? 'filter invert' : ''}`} />
                                </button>
                                {isFilterOpen && (
                                <div className={`origin-top-left lg:origin-top-left absolute mt-2 w-48 rounded-md shadow-lg z-50 ${darkMode ? 'bg-slate-700 border border-gray-600' : 'bg-white border border-gray-300'} left-1/2 -translate-x-1/2 lg:left-0 lg:-translate-x-0`}>
                                    <ul className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    <li>
                                        <a
                                        href="#"
                                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => handleFilterSelect("All")}
                                        role="menuitem"
                                        >
                                        All
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                        href="#"
                                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => handleFilterSelect("Last week")}
                                        role="menuitem"
                                        >
                                        Last week
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                        href="#"
                                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => handleFilterSelect("Last month")}
                                        role="menuitem"
                                        >
                                        Last month
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                        href="#"
                                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => handleFilterSelect("Condition: good")}
                                        role="menuitem"
                                        >
                                        Condition: good
                                        </a>
                                    </li>
                                    </ul>
                                </div>
                                )}
                            </div>
                        </div>

                        {/* Plant Grid */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPlants.length > 0 ? (
                            filteredPlants.map(plant => (
                                <div key={plant.id} onClick={() => setSelectedPlant(plant)} className="cursor-pointer">
                                    {/* Pass imageUrl to Plant_gallery_card if it accepts it */}
                                    <Plant_gallery_card name={plant.name} imageUrl={plant.imageUrl} />
                                </div>
                            ))
                            ) : (
                            <p className={`col-span-full text-center py-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No results found for "{search}" {filterOption !== "All" ? `with filter "${filterOption}"` : ""}</p>
                            )}
                        </div>
                    </div>

                    {/* Upload button section - Desktop Only (Sidebar-like) */}
                    <div className="hidden lg:flex lg:flex-col lg:w-auto lg:ml-auto gap-3 mt-0 lg:order-2 pt-[calc(2.5rem+1.5rem)]"> {/* Adjust pt to align with title area if needed */}
                        <button onClick={openModal} className={`py-2 px-4 rounded-xl text-white ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D5A632] hover:bg-black'}`}>
                            Upload plant photo
                        </button>
                    </div>
                </div>
                
                <Plant_upload_popup isOpen={isModalOpen} onClose={closeModal} />
           </main>

           {selectedPlant && (
                <PlantViewPopup plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
            )}
        </div>
    );
}

export default GalleryPage;