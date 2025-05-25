import { useDarkMode } from '../context/DarkModeContext';

function WaterManagementStatus ({ waterNeeded, lastWatered, waterPumpStatus, isLoading }) {
    const { darkMode } = useDarkMode();
    
    // Format the last watered time
    const formatLastWatered = () => {
        if (!lastWatered) return 'N/A';
        
        try {
            const lastWateredDate = new Date(lastWatered);
            // Check if the date is valid
            if (isNaN(lastWateredDate.getTime())) {
                console.error('Invalid lastWatered date provided:', lastWatered);
                return 'N/A';
            }

            const now = new Date();
            const diffInMilliseconds = now.getTime() - lastWateredDate.getTime();

            // Handle cases where lastWateredDate might be slightly in the future due to timing
            if (diffInMilliseconds < 0) {
                // If it's a very small future difference (e.g., within 30 seconds), treat as "Just now"
                if (Math.abs(diffInMilliseconds) < 30 * 1000) {
                    return 'Just now';
                }
                // Otherwise, it's likely invalid future data for "last watered"
                console.warn('lastWatered date is in the future:', lastWatered);
                return 'N/A';
            }
            
            const diffInMinutes = Math.round(diffInMilliseconds / (1000 * 60));
            const diffInHours = Math.round(diffInMilliseconds / (1000 * 60 * 60));
            
            if (diffInHours < 1) {
                if (diffInMinutes < 1) { // Covers the "0m ago" case
                    return 'Just now';
                }
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
                            {/* Water needed item removed */}
                            <li className="flex justify-between items-center pb-2 border-b border-dashed border-opacity-30 border-gray-400">
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last watered:</span>
                                <span className="font-medium">{formatLastWatered()}</span>
                            </li>
                            {/* Next water prediction item removed */}
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