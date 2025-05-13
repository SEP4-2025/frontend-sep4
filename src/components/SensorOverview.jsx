import { useState, useEffect } from 'react';
import calendarIcon from '../assets/solar--calendar-linear.svg';
import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import soilMoistureIcon from '../assets/soil-moisture-icon.svg'; 
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

const defaultSensorHistory = [];
const defaultLatestValue = null;

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
  const { darkMode } = useDarkMode(); // Consume darkMode from context
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
      setProcessedChartData({ labels: [], datasets: [{ data: [] }] });
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
        backgroundColor: `${getColor(selectedSensor)}33`, // Example: FF000033 for semi-transparent red
        tension: 0.4,
        spanGaps: true,
      }]
    });

  }, [selectedSensor, timeframe, temperatureHistory, humidityHistory, lightHistory, soilMoistureHistory]);

  const getColor = (sensorType) => {
    switch (sensorType) {
      case "temperature": return "#FF0000"; // Red
      case "humidity": return "#0000FF";    // Blue
      case "light": return "#FFD700";       // Gold/Yellow
      case "soilMoisture": return "#008000"; // Green
      default: return "#22c55e"; // Default green
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

  const chartTextColor = darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
  const gridColor = darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <div className={`w-full rounded-xl p-4 border mt-4 ${darkMode ? 'bg-slate-800 border-slate-700 text-gray-200' : 'bg-green-50 border-gray-300 text-gray-800'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div>
          <h2 className={`Manrope text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Sensor Overview</h2>
          <p className={`Manrope text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Overview parameters</p>
        </div>
        <div className="flex items-center gap-2">
          <img src={calendarIcon} className={`w-5 h-5 ${darkMode ? 'filter invert' : ''}`} alt="Calendar" />
          <select
            className={`border rounded-md px-2 py-1 text-sm ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white border-green-300 text-gray-700'}`}
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
          </select>
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-4 rounded-lg overflow-hidden text-sm font-medium text-center ${darkMode ? 'border border-slate-600 text-gray-200' : 'border border-gray-400 text-gray-700'}`}>
        <button className={`py-2 border-b sm:border-b-0 sm:border-r ${darkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-400 hover:bg-green-100'} transition`} onClick={() => setSelectedSensor("temperature")}>Temperature</button>
        <button className={`py-2 border-b sm:border-b-0 sm:border-r ${darkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-400 hover:bg-green-100'} transition`} onClick={() => setSelectedSensor("humidity")}>Humidity</button>
        <button className={`py-2 border-b sm:border-b-0 sm:border-r ${darkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-400 hover:bg-green-100'} transition`} onClick={() => setSelectedSensor("light")}>Light Intensity</button>
        <button className={`py-2 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-green-100'} transition`} onClick={() => setSelectedSensor("soilMoisture")}>Soil Moisture</button>
      </div>

      {selectedSensor === "overview" && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <OverviewCard
            darkMode={darkMode}
            title="Temperature"
            icon={temperatureIcon}
            value={latestTemperature ? `${latestTemperature.value}${getUnit("temperature")}` : "N/A"}
            gradient="from-red-500 to-red-300"
            percentage={latestTemperature ? latestTemperature.value : 0}
          />
          <OverviewCard
            darkMode={darkMode}
            title="Humidity"
            icon={humidityIcon}
            value={latestHumidity ? `${latestHumidity.value}${getUnit("humidity")}` : "N/A"}
            gradient="from-blue-600 to-blue-300"
            percentage={latestHumidity ? latestHumidity.value : 0}
          />
          <OverviewCard
            darkMode={darkMode}
            title="Light Intensity"
            icon={lightIntensityIcon}
            value={latestLight ? `${latestLight.value} ${getUnit("light")}` : "N/A"}
            gradient="from-yellow-500 to-yellow-300"
            percentage={latestLight ? (latestLight.value / 100000) * 100 : 0} // Assuming max light is 100,000 for percentage
          />
          <OverviewCard
            darkMode={darkMode}
            title="Soil Moisture"
            icon={soilMoistureIcon}
            value={latestSoilMoisture ? `${latestSoilMoisture.value}${getUnit("soilMoisture")}` : "N/A"}
            gradient="from-green-600 to-green-300"
            percentage={latestSoilMoisture ? latestSoilMoisture.value : 0}
          />
        </div>
      )}

      {selectedSensor !== "overview" && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-md font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)} Data</h3>
            <button
              className={`text-xs rounded-md px-2 py-1 ${darkMode ? 'text-green-300 border-green-600 border hover:bg-slate-700' : 'text-green-600 border border-green-300 hover:bg-green-50'}`}
              onClick={() => setSelectedSensor("overview")}
            >
              Back to Overview
            </button>
          </div>
          <div className="w-full">
          <Line
              data={processedChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: timeframe === "24h" ? "Time (HH:MM)" : "Date (YYYY-MM-DD)",
                      color: chartTextColor,
                    },
                    ticks: { display: true, autoSkip: true, color: chartTextColor },
                    grid: { color: gridColor },
                  },
                  y: {
                    title: { display: true, text: `Value (${getUnit(selectedSensor)})`, color: chartTextColor },
                    min: selectedSensor === "temperature" ? -30 : 0, // Set min for temperature
                    max: selectedSensor === "temperature" ? 70 : (selectedSensor === "light" ? 100000 : 100), // Adjust max based on sensor
                    ticks: { color: chartTextColor },
                    grid: { color: gridColor },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: chartTextColor,
                    }
                  }
                }
              }}
              height={300}
            />
          </div>
        </div>
      )}
      </div>
  );
}

function OverviewCard({ darkMode, title, icon, value, gradient, percentage }) {
  const getValueTextClass = () => {
    const baseBgClass = darkMode ? 'bg-slate-900/80' : 'bg-white/80';
    let colorClass = '';
    const lowerTitle = title.toLowerCase();

    if (darkMode) {
      if (lowerTitle.includes('temperature')) colorClass = 'text-red-400';
      else if (lowerTitle.includes('humidity')) colorClass = 'text-blue-400';
      else if (lowerTitle.includes('light')) colorClass = 'text-yellow-400';
      else if (lowerTitle.includes('soil moisture')) colorClass = 'text-green-400';
      else colorClass = 'text-gray-300';
    } else {
      if (lowerTitle.includes('temperature')) colorClass = 'text-red-600';
      else if (lowerTitle.includes('humidity')) colorClass = 'text-blue-600';
      else if (lowerTitle.includes('light')) colorClass = 'text-yellow-600';
      else if (lowerTitle.includes('soil moisture')) colorClass = 'text-green-600';
      else colorClass = 'text-gray-700';
    }
    return `absolute bottom-2 right-0 text-sm font-bold px-2 py-1 rounded-md shadow-sm ${baseBgClass} ${colorClass}`;
  };

  return (
    <div className={`flex flex-col items-center border rounded-lg p-4 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'}`}>
      <div className="mb-2 flex flex-row w-full justify-between">
        <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{title}</p>
        <img src={icon} alt={`${title} icon`} width="23" height="23" className={`${darkMode ? 'filter invert' : ''}`} />
      </div>
      <div className="relative h-32 flex justify-center items-end w-full">
        <div className={`w-8 h-full rounded-full overflow-hidden relative ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
          <div
            className={`absolute bottom-0 w-full bg-gradient-to-t ${gradient}`}
            style={{ height: `${percentage}%` }} 
          />
        </div>
        <div className={getValueTextClass()}>
          {value}
        </div>
      </div>
    </div>
  );
}