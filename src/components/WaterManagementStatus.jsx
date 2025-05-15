import { useDarkMode } from '../context/DarkModeContext';

function WaterManagementStatus () {
    const waterNeeded = 20;
    const lastWatered = 5;
    const waterPrediction = 2;
    const waterPumpStatus = "Online"

    const { darkMode } = useDarkMode();

    return (
        <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
            <div className="p-6">
                <h2 className="font-bold text-xl mb-4 text-center">Status</h2>
                <div className={`rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-50'} p-4`}>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center pb-2 border-b border-dashed border-opacity-30 border-gray-400">
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Water needed:</span>
                            <span className="font-medium">{waterNeeded} ml</span>
                        </li>
                        <li className="flex justify-between items-center pb-2 border-b border-dashed border-opacity-30 border-gray-400">
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last watered:</span>
                            <span className="font-medium">{lastWatered}h ago</span>
                        </li>
                        <li className="flex justify-between items-center pb-2 border-b border-dashed border-opacity-30 border-gray-400">
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Next water prediction:</span>
                            <span className="font-medium">In {waterPrediction}h</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Water pump status:</span>
                            <span className="font-medium px-2 py-1 rounded-full text-xs bg-green-500 text-white">{waterPumpStatus}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default WaterManagementStatus;