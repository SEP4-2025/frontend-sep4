import { useDarkMode } from '../context/DarkModeContext';

function SensorSettings () {
    const { darkMode } = useDarkMode();

    return (
        <div className={`w-full ${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-lg p-4 mb-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <p className='Manrope font-bold text-center text-lg mb-3'>Sensor settings</p>
                        <div className='mb-5'>
                        <p className='mb-2'>Temperature bottom threshold</p>
                        <input
                            type="text"
                            placeholder="Value"
                            class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                            />
                            </div>
                        <div>
                        <p className='mb-2'>Temperature deviation</p>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            class="w-full accent-green-500"
                            />
                        </div>
                        <button
                            className={`rounded-lg p-2 mt-2 text-white ${darkMode ? 'text-white bg-slate-800' : 'bg-gray-600'}`}
                        >
                            Update
                        </button>
                </div>
            </div>
        </div>
    )
}
export default SensorSettings;