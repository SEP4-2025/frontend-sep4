import { useDarkMode } from '../context/DarkModeContext';

function WaterManagementStatus () {
    const waterNeeded = 20;
    const lastWatered = 5;
    const waterPrediction = 2;
    const waterPumpStatus = "Online"

    const { darkMode } = useDarkMode();

    return (
        <div className={`${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-lg p-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <p className="Manrope font-bold text-center text-2xl">Status</p>
                    <ul>
                        <li>Water needed: {waterNeeded} ml</li>
                        <li>Last watered: {lastWatered}h ago</li>
                        <li>Next water prediction: In {waterPrediction}h </li>
                        <li>Water pump status: {waterPumpStatus}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default WaterManagementStatus;