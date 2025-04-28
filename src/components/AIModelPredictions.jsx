import React from 'react';

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
  const getStatus = (value, optimal, min, max) => {
    const range = max - min;
    const diff = Math.abs(value - optimal);
    const pct = diff / range;
    if (pct <= 0.10) return { label: 'Excellent', color: 'text-green-600' };
    if (pct <= 0.25) return { label: 'Good', color: 'text-yellow-500' };
    return { label: 'Needs attention', color: 'text-red-500' };
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 w-full max-w-[960px] bg-green-50 rounded-xl border border-black shadow-lg">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">AI model predictions</h2>
        <p className="text-sm text-gray-600">Optimal growth metrics for your plant</p>
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
          <div key={m.name} className="mb-4 last:mb-0">
            <div className="flex justify-between text-sm font-medium">
              <span>{m.name}</span>
              <span className={color}>{label}</span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full mt-1 overflow-hidden">
              {/* current-value fill */}
              <div
                className="absolute top-0 left-0 bottom-0 rounded-full bg-blue-400"
                style={{ width: `${fillPct}%` }}
              />
              {/* optimal marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-blue-700"
                style={{ left: `${optimalPos}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{min}{m.unit}</span>
              <span>{max}{m.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
