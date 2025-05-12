import { useDarkMode } from '../context/DarkModeContext';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

function Plant_gallery_card({ plant, picture }) {
    const { darkMode } = useDarkMode();
    
    // Format the date if available
    const formattedDate = picture && picture.date 
        ? format(new Date(picture.date), 'MMM d, yyyy')
        : 'No date';

    return (
        <div className={`rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
            <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                {/* Display the plant image if available */}
                {picture && picture.imageUrl ? (
                    <img 
                        src={picture.imageUrl} 
                        alt={plant.name} 
                        className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                ) : (
                    <div className={`w-full h-48 flex items-center justify-center rounded-lg mb-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                
                <div className='flex flex-col'>
                    <div className='flex flex-row sm:flex-row sm:justify-between sm:items-start gap-2'>
                        <div className='flex flex-col'>
                            <div className={`font-medium text-lg ${darkMode ? 'text-gray-100' : ''}`}>{plant.name}</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formattedDate}</div>
                        </div>
                    </div>
                    
                    {picture && picture.note && (
                        <div className='flex flex-col mt-3'>
                            <p className={`font-bold mb-2 ${darkMode ? 'text-gray-100' : ''}`}>Notes</p>
                            <div className={`border rounded-lg p-2 ${darkMode ? 'border-gray-700 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white'}`}>
                                {picture.note}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Plant_gallery_card.propTypes = {
    plant: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    picture: PropTypes.shape({
        id: PropTypes.number,
        date: PropTypes.string,
        note: PropTypes.string,
        imageUrl: PropTypes.string
    })
};

export default Plant_gallery_card;