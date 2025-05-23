import { useDarkMode } from '../context/DarkModeContext';

function WaterManagementStatus ({ waterNeeded, lastWatered, waterPumpStatus, isLoading }) {
    const { darkMode } = useDarkMode();
    
    // Format the last watered time
    const formatLastWatered = () => {
        if (!lastWatered) return 'N/A';
        
        try {
            const lastWateredDate = new Date(lastWatered);
            const now = new Date();
            const diffInHours = Math.round((now - lastWateredDate) / (1000 * 60 * 60));
            
            if (diffInHours < 1) {
                const diffInMinutes = Math.round((now - lastWateredDate) / (1000 * 60));
                return `${diffInMinutes}m ago`;
            } else if (diffInHours < 24) {
                return `${diffInHours}h ago`;
            } else {
                const diffInDays = Math.round(diffInHours / 24);
                return `${diffInDays}d ago`;
            }
        } catch (error) {
            console.error('Error formatting lastWatered date:', error);
            return 'N/A';
        }
    };
    

    const calculateWaterPrediction = () => {
        if (!lastWatered) return 'N/A';
        
        try {
            const lastWateredDate = new Date(lastWatered);
            const predictedDate = new Date(lastWateredDate.getTime() + (24 * 60 * 60 * 1000));
            const now = new Date();
            const diffInHours = Math.round((predictedDate - now) / (1000 * 60 * 60));
            
            if (diffInHours < 1) {
                return 'Soon';
            } else if (diffInHours < 24) {
                return `In ${diffInHours}h`;
            } else {
                const diffInDays = Math.round(diffInHours / 24);
                return `In ${diffInDays}d`;
            }
        } catch (error) {
            console.error('Error calculating water prediction:', error);
            return 'N/A';
        }
    };
    
    const waterPrediction = calculateWaterPrediction();

    return (
        <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
            <div className="p-6">
                <h2 className="font-bold text-xl mb-4 text-center">Status</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className={`rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-50'} p-4`}>
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center pb-2 border-b border-dashed border-opacity-30 border-gray-400">
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Water needed:</span>
                                <span className="font-medium">{waterNeeded || 'N/A'} ml</span>
                            </li>
                            <li className="flex justify-between items-center pb-2 border-b border-dashed border-opacity-30 border-gray-400">
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last watered:</span>
                                <span className="font-medium">{formatLastWatered()}</span>
                            </li>
                            <li className="flex justify-between items-center pb-2 border-b border-dashed border-opacity-30 border-gray-400">
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Next water prediction:</span>
                                <span className="font-medium">{waterPrediction}</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Water pump status:</span>
                                <span className={`font-medium px-2 py-1 rounded-full text-xs ${waterPumpStatus === 'Online' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                                    {waterPumpStatus || 'Unknown'}
                                </span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
export default WaterManagementStatus;