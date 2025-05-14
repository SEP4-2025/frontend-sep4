import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';

/*
 * metrics: array of {
 *   name: string,
 *   unit?: string,
 *   value: number,
 *   optimal: number,
 *   min?: number,
 *   max?: number,
 * }
 */

export function AIModelPredictions({ metrics }) {
  const { darkMode } = useDarkMode();
  const getStatus = (value, optimal, min, max) => {
    const range = max - min;
    const diff = Math.abs(value - optimal);
    const pct = diff / range;
    if (pct <= 0.05) return { label: 'Excellent', color: darkMode ? 'text-green-400' : 'text-green-600' };
    if (pct <= 0.1) return { label: 'Good', color: darkMode ? 'text-yellow-400' : 'text-yellow-500' };
    return { label: 'Needs attention', color: darkMode ? 'text-red-400' : 'text-red-500' };
  };

  return (
    <div className={`ml-[1%] mt-[2%] p-4 w-[100%] rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
      <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-green-50'}`}>
      {/* Header */}
      <div className="mb-[0%]">
        <h2 className={`Manrope text-xl font-bold ${darkMode ? 'text-gray-100' : ''}`}>
          AI model predictions
        </h2>
        <p className={`Manrope text-sm mt-[1%] pb-3 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          Optimal growth metrics for your plant
        </p>
      </div>

      {/* Bars */}
      {metrics.map((m) => {
        const min = m.min ?? (m.name === 'Light Intensity' ? 4000 : 0);
        const max = m.max ?? (m.name === 'Temperature'
          ? 50
          : m.name === 'Light Intensity'
            ? 24000
            : 100
        );
        const { label, color } = getStatus(m.value, m.optimal, min, max);
        const optimalPos = ((m.optimal - min) / (max - min)) * 100;
        const fillPct = ((m.value - min) / (max - min)) * 100;

        return (
          <div key={m.name} className="mb-[0%] last:mb-0">
            <div className="flex justify-between text-[clamp(0.75rem,2%,1rem)] font-medium">
              <span className={darkMode ? 'text-gray-200' : ''}>{m.name}</span>
              <span className={color}>{label}</span>
            </div>
            
            <div className={`relative h-[1vh] min-h-[8px] rounded-full mt-[1%] overflow-hidden z-0 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
              <div
                className={`absolute top-0 left-0 bottom-0 rounded-full z-10 ${darkMode ? 'bg-blue-500' : 'bg-blue-400'}`}
                style={{ width: `${fillPct}%` }}
              />
              <div
                className={`absolute top-0 bottom-0 w-0.5 z-20 ${darkMode ? 'bg-blue-400' : 'bg-blue-700'}`}
                style={{ left: `${optimalPos}%` }}
              />
            </div>
            
            <div className={`flex justify-between text-[clamp(0.6rem,1.5%,0.8rem)] mt-[0.5%] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span>{min}{m.unit}</span>
              <span>{max}{m.unit}</span>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
