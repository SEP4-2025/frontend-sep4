import { useDarkMode } from '../context/DarkModeContext';

function ExpandedImageModal({ image, alt, onClose }) {
  const { darkMode } = useDarkMode();
  
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 
      ${darkMode ? 'bg-transparent bg-opacity-80' : 'bg-transparent bg-opacity-70'} 
      backdrop-blur-md`} 
      onClick={onClose}
    >
      <div className="relative max-w-7xl max-h-screen w-full h-full flex flex-col items-center justify-center">
        <button 
          onClick={onClose} 
          className={`absolute top-4 right-4 z-50 p-2 rounded-full cursor-pointer ${darkMode ? 'bg-white hover:bg-gray-100 text-black' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <img 
          src={image} 
          alt={alt} 
          className="max-h-full max-w-full object-contain" 
          onClick={(e) => e.stopPropagation()} 
        />
      </div>
    </div>
  );
}

export default ExpandedImageModal;