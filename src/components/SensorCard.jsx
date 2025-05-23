import { useDarkMode } from '../context/DarkModeContext';
import React from 'react';

function SensorCard({
    title,
    iconSrc,
    currentData,
    averageToday,
    averageYesterday,
    unit,
    precision,
    additionalText, // For custom text in the second line, e.g., water level details
    cardClassName,  // For specific card styling (e.g. col-span)
    dataTestId
}) {
    const { darkMode } = useDarkMode();

    const formatComparisonText = (todayData, yesterdayData, compUnit, compPrecision = 1) => {
        if (todayData && typeof todayData.value === 'number' &&
            yesterdayData && typeof yesterdayData.value === 'number') {
            
            const diff = todayData.value - yesterdayData.value;
            if (isNaN(diff)) return 'Comparison error'; // Ensure diff is a number
            const displayDiffString = diff.toFixed(compPrecision);
            const sign = diff > 0 ? '+' : '';
            return `${sign}${displayDiffString}${compUnit} from yesterday`;
        }
        return 'No comparison data';
    };

    const Icon = () => (
        <img src={iconSrc} alt={title} className={`w-6 h-6 ${darkMode ? 'invert' : ''}`} />
    );

    return (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm ${cardClassName || ''}`} data-testid={dataTestId}>
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                <Icon />
            </div>
            <div className="flex flex-col">
                <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentData && typeof currentData.value === 'number' ?
                        `${currentData.value.toFixed(precision)}${unit}` : 'N/A'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {additionalText !== undefined ? 
                        additionalText 
                        : formatComparisonText(averageToday, averageYesterday, unit, precision)}
                </span>
            </div>
        </div>
    );
}

export default SensorCard;