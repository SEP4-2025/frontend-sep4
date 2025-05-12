import { useState, useEffect } from 'react';
// API imports are removed as data is passed via props
import calendarIcon from '../assets/solar--calendar-linear.svg';
import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import soilMoistureIcon from '../assets/water-drop-svgrepo-com.svg';
import { useDarkMode } from '../context/DarkModeContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const defaultSensorHistory = []; // Default for historical data arrays
const defaultLatestValue = null; // Default for single latest average values

export function SensorOverview({
  temperatureHistory = defaultSensorHistory,
  humidityHistory = defaultSensorHistory,
  lightHistory = defaultSensorHistory,
  soilMoistureHistory = defaultSensorHistory,
  latestTemperature = defaultLatestValue,
  latestHumidity = defaultLatestValue,
  latestLight = defaultLatestValue,
  latestSoilMoisture = defaultLatestValue,
}) {
  const { darkMode } = useDarkMode();
  const [timeframe, setTimeframe] = useState("24h");
  const [selectedSensor, setSelectedSensor] = useState("overview");
  
  const [processedChartData, setProcessedChartData] = useState({
    labels: [],
    datasets: [{
      label: '', data: [], borderColor: '', backgroundColor: '', tension: 0.4, spanGaps: true,
    }]
  });

  useEffect(() => {
    if (selectedSensor === "overview") {
      setProcessedChartData({ labels: [], datasets: [{ data: [] }] }); // Clear chart for overview
      return;
    }

    let sourceData;
    switch (selectedSensor) {
      case "temperature": sourceData = temperatureHistory; break;
      case "humidity":    sourceData = humidityHistory;    break;
      case "light":       sourceData = lightHistory;       break;
      case "soilMoisture":sourceData = soilMoistureHistory;break;
      default:            sourceData = [];
    }

    if (!sourceData || sourceData.length === 0) {
      setProcessedChartData({
        labels: [],
        datasets: [{
          label: `${selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)} Over Time`,
          data: [],
          borderColor: getColor(selectedSensor),
          backgroundColor: `${getColor(selectedSensor)}33`,
          tension: 0.4,
          spanGaps: true,
        }]
      });
      return;
    }
    
    const now = new Date();
    let displayLabels = [];
    let dataPoints = [];

    if (timeframe === "30d" || timeframe === "7d") {
      const numDays = timeframe === "30d" ? 30 : 7;
      for (let i = 0; i < numDays; i++) {
        const dayDate = new Date(now);
        dayDate.setDate(now.getDate() - (numDays - 1 - i));
        dayDate.setHours(0, 0, 0, 0); 
        displayLabels.push(dayDate.toISOString().split('T')[0]); 

        const dayEnd = new Date(dayDate);
        dayEnd.setDate(dayDate.getDate() + 1);

        const valuesInDay = sourceData
          .filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= dayDate && itemDate < dayEnd;
          })
          .map(item => item.value);

        if (valuesInDay.length > 0) {
          const avg = valuesInDay.reduce((a, b) => a + b, 0) / valuesInDay.length;
          dataPoints.push(parseFloat(avg.toFixed(2)));
        } else {
          dataPoints.push(null); 
        }
      }
    } else if (timeframe === "24h") {
      for (let i = 0; i < 24; i++) {
        const hourDate = new Date(now);
        hourDate.setHours(now.getHours() - (23 - i), 0, 0, 0);
        displayLabels.push(hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

        const hourEnd = new Date(hourDate);
        hourEnd.setHours(hourDate.getHours() + 1);

        const valuesInHour = sourceData
          .filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= hourDate && itemDate < hourEnd;
          })
          .map(item => item.value);

        if (valuesInHour.length > 0) {
          const avg = valuesInHour.reduce((a, b) => a + b, 0) / valuesInHour.length;
          dataPoints.push(parseFloat(avg.toFixed(2)));
        } else {
          dataPoints.push(null); 
        }
      }
    }

    setProcessedChartData({
      labels: displayLabels,
      datasets: [{
        label: `${selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)} Over Time`,
        data: dataPoints,
        borderColor: getColor(selectedSensor),
        backgroundColor: `${getColor(selectedSensor)}33`,
        tension: 0.4,
        spanGaps: true,
      }]
    });

  }, [selectedSensor, timeframe, temperatureHistory, humidityHistory, lightHistory, soilMoistureHistory]);

  const getColor = (sensorType) => {
    switch (sensorType) {
      case "temperature": return "#FF0000";
      case "humidity": return "#0000FF";
      case "light": return "#FFD700";
      case "soilMoisture": return "#008000";
      default: return "#22c55e";
    }
  };

  const getUnit = (sensorType) => {
    switch (sensorType) {
      case "temperature": return "°C";
      case "humidity": case "soilMoisture": return "%";
      case "light": return "lux";
      default: return "";
    }
  };

  return (
    <div className={`w-full rounded-lg p-6 shadow-md mt-4 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
      <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-green-50'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div>
          <h2 className={`Manrope text-xl font-bold ${darkMode ? 'text-gray-100' : ''}`}>Sensor Overview</h2>
          <p className={`Manrope text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Overview parameters</p>
        </div>
        <div className="flex items-center gap-2">
          <img src={calendarIcon} className={`w-5 h-5 ${darkMode ? 'filter invert' : ''}`} alt="Calendar" />
          <select
            className={`border rounded-md px-2 py-1 text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-green-300'}`}
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
          </select>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className={`grid grid-cols-1 sm:grid-cols-4 border-2 rounded-lg overflow-hidden text-sm font-medium text-center ${darkMode ? 'border-gray-700 text-gray-200' : 'border-gray-400 text-gray-700'}`}>
        <button className={`py-2 border-b-2 sm:border-b-0 sm:border-r-2 transition ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-400 hover:bg-green-100'}`} onClick={() => setSelectedSensor("temperature")}>
          Temperature
        </button>
        <button className={`py-2 border-b-2 sm:border-b-0 sm:border-r-2 transition ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-400 hover:bg-green-100'}`} onClick={() => setSelectedSensor("humidity")}>
          Humidity
        </button>
        <button className={`py-2 border-b-2 sm:border-b-0 sm:border-r-2 transition ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-400 hover:bg-green-100'}`} onClick={() => setSelectedSensor("light")}>
          Light Intensity
        </button>
        <button className={`py-2 transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-100'}`} onClick={() => setSelectedSensor("soilMoisture")}>
          Soil Moisture
        </button>
      </div>

      {selectedSensor === "overview" && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Temperature */}
          <div className={`flex flex-col items-center border rounded-lg p-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
            <div className="mb-2 flex flex-row w-full justify-between">
              <p className={`font-medium ${darkMode ? 'text-gray-100' : ''}`}>Temperature</p>
              <img src={temperatureIcon} alt="temperature icon" width="23" height="23" className={`${darkMode ? 'filter invert' : ''}`} />
            </div>
            <div className="relative h-32 flex justify-center items-end w-full">
              <div className={`w-8 h-full rounded-full overflow-hidden relative ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-orange-300"
                  style={{ height: `${latestData.temperature ? latestData.temperature.value : 0}%` }}
                />
              </div>
              <div className={`absolute bottom-2 right-0 text-sm font-bold px-2 py-1 rounded-md shadow-sm ${darkMode ? 'bg-gray-800/90 text-red-400' : 'bg-white/80 text-red-600'}`}>
                {latestData.temperature ? `${latestData.temperature.value}°C` : "N/A"}
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className={`flex flex-col items-center border rounded-lg p-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
            <div className="mb-2 flex flex-row w-full justify-between">
              <p className={`font-medium ${darkMode ? 'text-gray-100' : ''}`}>Humidity</p>
              <img src={humidityIcon} alt="humidity icon" width="23" height="23" className={`${darkMode ? 'filter invert' : ''}`} />
            </div>
            <div className="relative h-32 flex justify-center items-end w-full">
              <div className={`w-8 h-full rounded-full overflow-hidden relative ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-300"
                  style={{ height: `${latestData.humidity ? latestData.humidity.value : 0}%` }}
                />
              </div>
              <div className={`absolute bottom-2 right-0 text-sm font-bold px-2 py-1 rounded-md shadow-sm ${darkMode ? 'bg-gray-800/90 text-blue-400' : 'bg-white/80 text-blue-600'}`}>
                {latestData.humidity ? `${latestData.humidity.value}%` : "N/A"}
              </div>
            </div>
          </div>

          {/* Light Intensity */}
          <div className={`flex flex-col items-center border rounded-lg p-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
            <div className="mb-2 flex flex-row w-full justify-between">
              <p className={`font-medium ${darkMode ? 'text-gray-100' : ''}`}>Light Intensity</p>
              <img src={lightIntensityIcon} alt="light intensity icon" width="23" height="23" className={`${darkMode ? 'filter invert' : ''}`} />
            </div>
            <div className="relative h-32 flex justify-center items-end w-full">
              <div className={`w-8 h-full rounded-full overflow-hidden relative ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 to-yellow-300"
                  style={{ height: `${latestData.light ? latestData.light.value : 0}%` }}
                />
              </div>
              <div className={`absolute bottom-2 right-0 text-sm font-bold px-2 py-1 rounded-md shadow-sm ${darkMode ? 'bg-gray-800/90 text-yellow-400' : 'bg-white/80 text-yellow-600'}`}>
                {latestData.light ? `${latestData.light.value} lux` : "N/A"}
              </div>
            </div>
          </div>

          {/* Soil Moisture */}
          <div className={`flex flex-col items-center border rounded-lg p-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
            <div className="mb-2 flex flex-row w-full justify-between">
              <p className={`font-medium ${darkMode ? 'text-gray-100' : ''}`}>Soil Moisture</p>
              <img src={soilMoistureIcon} alt="soil moisture icon" width="23" height="23" className={`${darkMode ? 'filter invert' : ''}`} />
            </div>
            <div className="relative h-32 flex justify-center items-end w-full">
              <div className={`w-8 h-full rounded-full overflow-hidden relative ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-green-600 to-green-300"
                  style={{ height: `${latestData.soilMoisture ? latestData.soilMoisture.value : 0}%` }}
                />
              </div>
              <div className={`absolute bottom-2 right-0 text-sm font-bold px-2 py-1 rounded-md shadow-sm ${darkMode ? 'bg-gray-800/90 text-green-400' : 'bg-white/80 text-green-600'}`}>
                {latestData.soilMoisture ? `${latestData.soilMoisture.value}%` : "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSensor !== "overview" && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-md font-medium ${darkMode ? 'text-gray-100' : ''}`}>{selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)} Data</h3>
            <button
              className={`text-xs rounded-md px-2 py-1 ${darkMode ? 'text-green-400 border-green-500 border hover:bg-gray-700' : 'text-green-600 border border-green-300 hover:bg-green-50'}`}
              onClick={() => setSelectedSensor("overview")}
            >
              Back to Overview
            </button>
          </div>
          <div className="h-40 flex flex-col">
            <div className={`text-sm text-center mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)} Over Time</div>
            <div className={`flex-1 border-b border-l relative ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                <div className={`w-full h-full relative overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke={darkMode ? '#4ade80' : '#22c55e'}
                      strokeWidth="2"
                      points={chartData.map((point, index) => `${index * 10},${100 - point.value}`).join(" ")}
                    />
                  </svg>
                </div>
              </div>
              <div className={`absolute top-0 left-0 h-full flex flex-col justify-between text-xs pr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>Max</span><span>Mid</span><span>Min</span>
              </div>
              <div className={`absolute bottom-0 left-0 w-full flex justify-between text-xs pt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {chartData.map((point, index) => (
                  <span key={index}>{point.time}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function OverviewCard({ title, icon, value, gradient, percentage, textColor }) {
  return (
    <div className="flex flex-col items-center border rounded-lg p-4 bg-white">
      <div className="mb-2 flex flex-row w-full justify-between">
        <p className="font-medium">{title}</p>
        <img src={icon} alt={`${title} icon`} width="23" height="23" />
      </div>
      <div className="relative h-32 flex justify-center items-end w-full">
        <div className="w-8 h-full bg-gray-100 rounded-full overflow-hidden relative">
          <div
            className={`absolute bottom-0 w-full bg-gradient-to-t ${gradient}`}
            style={{ height: `${percentage}%` }} // Ensure percentage is scaled appropriately (0-100)
          />
        </div>
        <div
          className="absolute bottom-2 right-0 text-sm font-bold px-2 py-1 bg-white/80 rounded-md shadow-sm"
          style={{ color: textColor }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}