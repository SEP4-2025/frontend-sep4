import { useDarkMode } from '../context/DarkModeContext';

function LoadingScreen(){
    const { darkMode } = useDarkMode();
    
    return (
        <div className={`flex flex-col justify-center items-center h-screen ${darkMode ? 'bg-slate-700 text-white' : ''}`}>
            <div className={`loader border-t-4 border-b-4 rounded-full w-32 h-32 mb-4 animate-spin spin-slow ${darkMode ? 'border-green-400' : 'border-green-500'}`}></div>
            <div className={`font-medium flex ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                <p>Loading your greenhouse data </p>
                <span className="dots-1">.</span>
                <span className="dots-2">.</span>
                <span className="dots-3">.</span>
            </div>
        </div>
    );
}

export default LoadingScreen;