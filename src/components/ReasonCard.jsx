import { useDarkMode } from '../context/DarkModeContext';


function ReasonCard({icon, title, description}) {
    const { darkMode } = useDarkMode();

    return (
        <div className={`rounded-lg p-4 m-4 shadow-md mb-6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
            <div className={`flex flex-row items-center p-3 border h-full rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                <div className="flex flex-col items-center justify-between gap-2 p-3">
                    <img src={icon} alt="icon" className={`w-1/8 h-auto ${darkMode ? 'filter invert' : ''}`} />
                    <h1 className='Manrope text-xl font-bold'>{title}</h1>
                    <p className='Manrope text-l'>{description}</p>
                </div>
            </div>
        </div>
    );
}

export default ReasonCard;