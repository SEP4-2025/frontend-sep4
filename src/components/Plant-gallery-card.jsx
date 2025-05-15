import logo from '../assets/GrowMate_Logo_Transparent.png';
import penIcon from '../assets/pen-icon.svg';
import calendarIcon from '../assets/calendar-icon-gray.svg';
import { useDarkMode } from '../context/DarkModeContext';

function Plant_gallery_card({ name, time, condition, suggestion }) {
    const { darkMode } = useDarkMode();

    return (
        <div className={`Manrope flex flex-col items-center justify-center rounded-lg p-4 shadow-md border-1 border-[#AFA8A8] ${darkMode ? 'bg-slate-700' : 'bg-[#F3F3F3]'}`}>
            <div className='flex flex-row gap-4 w-full'>
                <div className={`mr-auto rounded-lg px-6 py-4 text-center flex justify-start ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
                    <p>{name}</p>
                </div>
                <div className={`ml-auto rounded-lg p-4 text-center flex justify-end gap-4 ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
                    <img src={calendarIcon} alt="calendar-icon" className={`w-6 h-6 ${darkMode ? 'filter invert' : ''}`} />
                    <p className='text-[#9C8D8D]'>{time}</p>
                </div>
            </div>
            <div className='mt-4'>
                <img src={logo} alt="logo" className={`w-full max-w-xs h-auto block mx-auto ${darkMode ? 'filter brightness-90' : ''}`} />
            </div>
            <div className={`w-full h-20 mt-4${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <textarea
                    placeholder="Add a note about your plant..."
                    className={`w-full h-20 p-2 resize-none focus:outline-none focus:ring-1 focus:ring-green-500 ${darkMode
                        ? 'bg-slate-700 text-gray-200 placeholder-gray-400 border border-slate-600'
                        : 'bg-white text-gray-800 placeholder-gray-500 border border-gray-200'
                        }`}
                />
            </div>
            <div className='flex flex-row w-full mt-4'>
                <button
                    className={`mr-auto rounded-lg px-6 py-4 text-center flex flex-row gap-4 items-center border-1 border-[#AFA8A8] hover:bg-opacity-80 transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-gray-100'}`}
                    onClick={() => {
                        // to be implemented
                    }}
                >
                    <span>Edit note</span>
                    <img src={penIcon} alt="edit-icon" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />
                </button>
            </div>
        </div>
        // <div className={`rounded-lg p-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
        //     <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
        //         <img src={logo} alt="logo" className={`w-30 max-w-xs h-auto block mx-auto ${darkMode ? 'filter brightness-90' : ''}`} />
        //         <div className='flex flex-col'>
        //             <div className='flex flex-row sm:flex-row sm:justify-between sm:items-start gap-2'>
        //                 <div className='flex flex-col'>
        //                     <div className={`font-medium ${darkMode ? 'text-gray-100' : ''}`}>{name}</div> {/*needs real data */}
        //                     <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>time{time}</div> {/*needs real data */}
        //                 </div>
        //                 <div className={`ml-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>condition{condition}</div>{/*needs real data */}
        //             </div>
        //             <div className='flex flex-col mt-3'>
        //                 <p className={`font-bold mb-2 ${darkMode ? 'text-gray-100' : ''}`}>Suggestion{suggestion}</p>
        //                 <div className={`border rounded-lg p-2 ${darkMode ? 'border-gray-700 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white'}`}>Actual suggestion</div> {/*needs real data */}
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}
export default Plant_gallery_card;