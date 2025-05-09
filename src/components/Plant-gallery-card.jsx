import logo from '../assets/GrowMate_Logo_Transparent.png';
import { useDarkMode } from '../context/DarkModeContext';

function Plant_gallery_card ({name, time, condition, suggestion}) {
    const { darkMode } = useDarkMode();

    return (
        <div className={`cursor-pointer rounded-lg p-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
            <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                <img src={logo} alt="logo" className={`w-30 max-w-xs h-auto block mx-auto ${darkMode ? 'filter brightness-90' : ''}`} />
                <div className='flex flex-col'>
                    <div className='flex flex-row sm:flex-row sm:justify-between sm:items-start gap-2'>
                        <div className='flex flex-col'>
                            <div className={`font-medium ${darkMode ? 'text-gray-100' : ''}`}>{name}</div> {/*needs real data */}
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>time{time}</div> {/*needs real data */}
                        </div>
                        <div className={`ml-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>condition{condition}</div>{/*needs real data */}
                    </div>
                    <div className='flex flex-col mt-3'>
                        <p className={`font-bold mb-2 ${darkMode ? 'text-gray-100' : ''}`}>Suggestion{suggestion}</p>
                        <div className={`border rounded-lg p-2 ${darkMode ? 'border-gray-700 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white'}`}>Actual suggestion</div> {/*needs real data */}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Plant_gallery_card;