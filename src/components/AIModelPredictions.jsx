import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';

export function AIModelPredictions({
  latestSoilMoistureReading,
  aiSoilMoisturePrediction,
  soilMoistureSensorThreshold
}) {
  const { darkMode } = useDarkMode();

  const dataAvailable = latestSoilMoistureReading && typeof latestSoilMoistureReading.value === 'number' &&
                        aiSoilMoisturePrediction && typeof aiSoilMoisturePrediction.prediction === 'number';

  const thresholdValueIsNumber = typeof soilMoistureSensorThreshold === 'number';

  if (!dataAvailable) {
    return (
      <div className={`p-5 rounded-lg shadow-sm h-[380px] flex flex-col ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Soil Moisture Prediction</h3>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Soil moisture data or AI prediction is currently unavailable.
          </p>
        </div>
      </div>
    );
  }

  const currentSoilHumidity = latestSoilMoistureReading.value;
  const unit = latestSoilMoistureReading.metricUnit || '%';
  const sensorThresholdValue = thresholdValueIsNumber ? soilMoistureSensorThreshold : null;

  const predictedDecreaseAmount = aiSoilMoisturePrediction.prediction;
  const effectivePredictedDecrease = Math.max(0, Math.min(predictedDecreaseAmount, currentSoilHumidity));
  const predictedFutureHumidity = currentSoilHumidity - effectivePredictedDecrease;

  const minRange = 0;
  const maxRange = 100;

  const blueBarWidthPercent = Math.max(0, Math.min(100, (predictedFutureHumidity / maxRange) * 100));
  const redBarWidthPercent = Math.max(0, Math.min(100 - blueBarWidthPercent, (effectivePredictedDecrease / maxRange) * 100));

  let thresholdPositionPercent = null;
  if (sensorThresholdValue !== null) {
    thresholdPositionPercent = Math.max(0, Math.min(100, (sensorThresholdValue / maxRange) * 100));
  }

  let statusText;
  if (effectivePredictedDecrease > 0) {
    statusText = `AI predicts a decrease of ${effectivePredictedDecrease.toFixed(1)}${unit}. Expected in 1h: ~${predictedFutureHumidity.toFixed(1)}${unit}.`;
  } else if (predictedDecreaseAmount < 0) {
    const predictedIncreaseAmount = Math.abs(predictedDecreaseAmount);
    const futureHumidityWithIncrease = Math.min(maxRange, currentSoilHumidity + predictedIncreaseAmount);
    statusText = `AI predicts an increase of ${predictedIncreaseAmount.toFixed(1)}${unit}. Expected in 1h: ~${futureHumidityWithIncrease.toFixed(1)}${unit}.`;
  } else {
    statusText = `AI predicts moisture will be ~${currentSoilHumidity.toFixed(1)}${unit} in 1h (stable or no decrease predicted).`;
  }

  const statusColor = effectivePredictedDecrease > 0
    ? (darkMode ? 'text-orange-400' : 'text-orange-500')
    : (predictedDecreaseAmount < 0 ? (darkMode ? 'text-green-400' : 'text-green-500')
    : (darkMode ? 'text-gray-300' : 'text-gray-700'));

  let timeToThresholdMessage = null;
  if (sensorThresholdValue !== null && currentSoilHumidity > sensorThresholdValue && effectivePredictedDecrease > 0) {
    const differenceToThreshold = currentSoilHumidity - sensorThresholdValue;
    const hoursToReachThreshold = differenceToThreshold / effectivePredictedDecrease;

    let formattedTime;
    if (hoursToReachThreshold * 60 < 1) { // Less than 1 minute
      formattedTime = "less than a minute";
    } else if (hoursToReachThreshold < 1) { // Less than 1 hour, show in minutes
      const minutes = Math.round(hoursToReachThreshold * 60);
      formattedTime = `${minutes} minute${minutes === 1 ? '' : 's'}`;
    } else if (hoursToReachThreshold === 1) { // Exactly 1 hour
      formattedTime = "1 hour";
    } else { // More than 1 hour
      formattedTime = `${hoursToReachThreshold.toFixed(1)} hours`;
    }
    timeToThresholdMessage = `Time to reach threshold (${sensorThresholdValue.toFixed(1)}${unit}): approx. ${formattedTime}.`;
  }

  return (
    <div className={`p-5 rounded-lg shadow-sm h-[380px] flex flex-col ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Soil Moisture Prediction</h3>
      </div>
      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
        Current soil moisture: <strong>{currentSoilHumidity.toFixed(1)}{unit}</strong>
      </p>
      {sensorThresholdValue !== null && (
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
          Sensor Threshold: <strong>{sensorThresholdValue.toFixed(1)}{unit}</strong>
        </p>
      )}

      <div className="mb-3">
        <p className={`text-sm font-medium mt-1 ${statusColor}`}>
          {statusText}
        </p>
        {timeToThresholdMessage && (
          <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
            {timeToThresholdMessage}
          </p>
        )}
      </div>

      <div className="space-y-4 mt-auto">
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Soil Moisture Level</span>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'} title={`Current: ${currentSoilHumidity.toFixed(1)}${unit} | Predicted in 1h: ${predictedFutureHumidity.toFixed(1)}${unit}`}>
              {currentSoilHumidity.toFixed(0)}{unit}
            </span>
          </div>

          <div className={`relative h-5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-300'}`}>
            <div
              className="absolute top-0 left-0 bottom-0 bg-blue-500"
              style={{ width: `${blueBarWidthPercent}%` }}
              title={`Predicted in 1h: ${predictedFutureHumidity.toFixed(1)}${unit}`}
            />
            {effectivePredictedDecrease > 0 && (
              <div
                className="absolute top-0 bottom-0 bg-red-500"
                style={{
                  left: `${blueBarWidthPercent}%`,
                  width: `${redBarWidthPercent}%`,
                }}
                title={`Predicted decrease: ${effectivePredictedDecrease.toFixed(1)}${unit}`}
              />
            )}
            {thresholdPositionPercent !== null && (
              <div
                className={`absolute top-0 bottom-0 w-0.5 ${darkMode ? 'bg-yellow-400' : 'bg-yellow-500'}`}
                style={{ left: `${thresholdPositionPercent}%` }}
                title={`Sensor Threshold: ${sensorThresholdValue.toFixed(1)}${unit}`}
              />
            )}
          </div>

          <div className={`flex justify-between text-xs mt-1 px-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>{minRange}{unit}</span>
            {/* The | T marker span that was here has been removed */}
            <span>{maxRange}{unit}</span>
          </div>
        </div>
      </div>
       <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'} mt-2 text-center`}>
        Blue: Predicted in 1h ({predictedFutureHumidity.toFixed(1)}{unit})
        {effectivePredictedDecrease > 0 && <><br/>Red: Predicted Decrease Amount ({effectivePredictedDecrease.toFixed(1)}{unit})</>}
        {sensorThresholdValue !== null && <><br/>Yellow Line: Sensor Threshold ({sensorThresholdValue.toFixed(1)}${unit})</>}
      </p>
    </div>
  );
}