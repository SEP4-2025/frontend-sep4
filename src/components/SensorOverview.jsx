import { useState, useEffect } from 'react';
import { getSensorData, getSensorDataLastest } from '../api';
import calendarIcon from '../assets/solar--calendar-linear.svg';
import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import soilMoistureIcon from '../assets/water-drop-svgrepo-com.svg';

export function SensorOverview() {
  const [timeframe, setTimeframe] = useState("24h");
  const [selectedSensor, setSelectedSensor] = useState("overview");
  const [chartData, setChartData] = useState([]);
  const [latestData, setLatestData] = useState({
    temperature: null,
    humidity: null,
    light: null,
    soilMoisture: null,
  });

  useEffect(() => {
    if (selectedSensor === "overview") {
      fetchLatestData();
    } else {
      fetchSensorData(selectedSensor);
    }
  }, [selectedSensor]);

  const fetchLatestData = async () => {
    try {
      const temperature = await getSensorDataLastest("temperature");
      const humidity = await getSensorDataLastest("humidity");
      const light = await getSensorDataLastest("light");
      const soilMoisture = await getSensorDataLastest("soilMoisture");
      setLatestData({ temperature, humidity, light, soilMoisture });
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  };

  const fetchSensorData = async (sensorType) => {
    try {
      const data = await getSensorData(sensorType);
      const formattedData = data.map((item) => ({
        time: new Date(item.date).toLocaleTimeString(),
        value: item.value,
      }));
      setChartData(formattedData);
    } catch (error) {
      console.error(`Error fetching data for ${sensorType}:`, error);
    }
  };

  return (
    <div className="w-full bg-green-50 rounded-xl p-4 border border-black mt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div>
          <h2 className="Manrope text-xl font-bold">Sensor Overview</h2>
          <p className="Manrope text-sm text-gray-500">Overview parameters</p>
        </div>
        <div className="flex items-center gap-2">
          <img src={calendarIcon} className="w-5 h-5" alt="Calendar" />
          <select
            className="bg-white border border-green-300 rounded-md px-2 py-1 text-sm"
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
      <div className="grid grid-cols-1 sm:grid-cols-4 border rounded-lg overflow-hidden text-sm font-medium text-center text-gray-700">
        <button className="py-2 border-b sm:border-b-0 sm:border-r hover:bg-green-100 transition" onClick={() => setSelectedSensor("temperature")}>
          Temperature
        </button>
        <button className="py-2 border-b sm:border-b-0 sm:border-r hover:bg-green-100 transition" onClick={() => setSelectedSensor("humidity")}>
          Humidity
        </button>
        <button className="py-2 border-b sm:border-b-0 sm:border-r hover:bg-green-100 transition" onClick={() => setSelectedSensor("light")}>
          Light Intensity
        </button>
        <button className="py-2 hover:bg-green-100 transition" onClick={() => setSelectedSensor("soilMoisture")}>
          Soil Moisture
        </button>
      </div>

      {/* Overview mode */}
      {selectedSensor === "overview" && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Temperature */}
          <div className="flex flex-col items-center border rounded-lg p-4 bg-white">
            <div className="mb-2 flex flex-row w-full justify-between">
              <p className="font-medium">Temperature</p>
              <img src={temperatureIcon} alt="temperature icon" width="23" height="23" />
            </div>
            <div className="relative h-32 flex justify-center items-end w-full">
              <div className="w-8 h-full bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-orange-300"
                  style={{ height: `${latestData.temperature ? latestData.temperature.value : 0}%` }}
                />
              </div>
              <div className="absolute bottom-2 right-0 text-sm font-bold px-2 py-1 bg-white/80 rounded-md shadow-sm text-red-600">
                {latestData.temperature ? `${latestData.temperature.value}°C` : "N/A"}
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="flex flex-col items-center border rounded-lg p-4 bg-white">
            <div className="mb-2 flex flex-row w-full justify-between">
              <p className="font-medium">Humidity</p>
              <img src={humidityIcon} alt="humidity icon" width="23" height="23" />
            </div>
            <div className="relative h-32 flex justify-center items-end w-full">
              <div className="w-8 h-full bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-300"
                  style={{ height: `${latestData.humidity ? latestData.humidity.value : 0}%` }}
                />
              </div>
              <div className="absolute bottom-2 right-0 text-sm font-bold px-2 py-1 bg-white/80 rounded-md shadow-sm text-blue-600">
                {latestData.humidity ? `${latestData.humidity.value}%` : "N/A"}
              </div>
            </div>
          </div>

          {/* Light Intensity */}
          <div className="flex flex-col items-center border rounded-lg p-4 bg-white">
            <div className="mb-2 flex flex-row w-full justify-between">
              <p className="font-medium">Light Intensity</p>
              <img src={lightIntensityIcon} alt="light intensity icon" width="23" height="23" />
            </div>
            <div className="relative h-32 flex justify-center items-end w-full">
              <div className="w-8 h-full bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 to-yellow-300"
                  style={{ height: `${latestData.light ? latestData.light.value : 0}%` }}
                />
              </div>
              <div className="absolute bottom-2 right-0 text-sm font-bold px-2 py-1 bg-white/80 rounded-md shadow-sm text-yellow-600">
                {latestData.light ? `${latestData.light.value} lux` : "N/A"}
              </div>
            </div>
          </div>

          {/* Soil Moisture */}
          <div className="flex flex-col items-center border rounded-lg p-4 bg-white">
            <div className="mb-2 flex flex-row w-full justify-between">
              <p className="font-medium">Soil Moisture</p>
              <img src={soilMoistureIcon} alt="soil moisture icon" width="23" height="23" />
            </div>
            <div className="relative h-32 flex justify-center items-end w-full">
              <div className="w-8 h-full bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-green-600 to-green-300"
                  style={{ height: `${latestData.soilMoisture ? latestData.soilMoisture.value : 0}%` }}
                />
              </div>
              <div className="absolute bottom-2 right-0 text-sm font-bold px-2 py-1 bg-white/80 rounded-md shadow-sm text-green-600">
                {latestData.soilMoisture ? `${latestData.soilMoisture.value}%` : "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart view */}
      {selectedSensor !== "overview" && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium">{selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)} Data</h3>
            <button
              className="text-xs text-green-600 border border-green-300 rounded-md px-2 py-1 hover:bg-green-50"
              onClick={() => setSelectedSensor("overview")}
            >
              Back to Overview
            </button>
          </div>
          <div className="h-40 flex flex-col">
            <div className="text-sm text-center mb-2 text-gray-500">{selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)} Over Time</div>
            <div className="flex-1 border-b border-l border-gray-200 relative">
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                <div className="w-full h-full bg-gray-50 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      points={chartData.map((point, index) => `${index * 10},${100 - point.value}`).join(" ")}
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                <span>Max</span><span>Mid</span><span>Min</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 pt-1">
                {chartData.map((point, index) => (
                  <span key={index}>{point.time}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}