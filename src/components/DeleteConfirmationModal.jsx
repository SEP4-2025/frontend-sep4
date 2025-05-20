import { useDarkMode } from '../context/DarkModeContext';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  const { darkMode } = useDarkMode();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`w-full max-w-md p-6 rounded-lg shadow-lg ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'}`}>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${darkMode 
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;