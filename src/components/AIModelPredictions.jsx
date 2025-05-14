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
    <div className={`p-5 rounded-lg shadow-sm h-[380px] flex flex-col ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Model Suggestions</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">Optimal growth metrics for your plant</p>

      <div className="space-y-4 flex-grow overflow-y-auto z-10">
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
            <div key={m.name} className="mb-4">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>{m.name}</span>
                <span className={color}>{label}</span>
              </div>
              
              <div className={`relative h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div
                  className={`absolute top-0 left-0 bottom-0 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-400'}`}
                  style={{ width: `${fillPct}%` }}
                />
                <div
                  className={`absolute top-0 bottom-0 w-0.5 ${darkMode ? 'bg-blue-300' : 'bg-blue-700'}`}
                  style={{ left: `${optimalPos}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs mt-1 text-gray-500">
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
