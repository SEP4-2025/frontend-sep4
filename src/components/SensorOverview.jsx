import { useState } from 'react';
import calendarIcon from '../assets/solar--calendar-linear.svg';
import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';

export function SensorOverview() {
  const [timeframe, setTimeframe] = useState("24h");
  const [selectedSensor, setSelectedSensor] = useState("overview");

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
      <div className="grid grid-cols-1 sm:grid-cols-3 border rounded-lg overflow-hidden text-sm font-medium text-center text-gray-700">
        <button className="py-2 border-b sm:border-b-0 sm:border-r hover:bg-green-100 transition" onClick={() => setSelectedSensor("temperature")}>
          Temperature
        </button>
        <button className="py-2 border-b sm:border-b-0 sm:border-r hover:bg-green-100 transition" onClick={() => setSelectedSensor("humidity")}>
          Humidity
        </button>
        <button className="py-2 hover:bg-green-100 transition" onClick={() => setSelectedSensor("light")}>
          Light Intensity
        </button>
      </div>

      {/* Overview mode */}
      {selectedSensor === "overview" && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Temperature */}
          <div className="flex flex-col items-center border rounded-lg p-4 bg-white">
            <div className="mb-2 flex flex-row w-full justify-between">
              <p className="font-medium">Temperature</p>
              <img src={temperatureIcon} alt="temperature icon" width="23" height="23" />
            </div>
            <div className="relative h-32 flex justify-center items-end w-full">
              <div className="w-8 h-full bg-gray-100 rounded-full overflow-hidden relative">
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-orange-300" style={{ height: '65%' }} />
              </div>
              <div className="absolute bottom-2 right-0 text-sm font-bold px-2 py-1 bg-white/80 rounded-md shadow-sm text-red-600">25°C</div>
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
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-300" style={{ height: '45%' }} />
              </div>
              <div className="absolute bottom-2 right-0 text-sm font-bold px-2 py-1 bg-white/80 rounded-md shadow-sm text-blue-600">45%</div>
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
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 to-yellow-300" style={{ height: '80%' }} />
              </div>
              <div className="absolute bottom-2 right-0 text-sm font-bold px-2 py-1 bg-white/80 rounded-md shadow-sm text-yellow-600">80 lux</div>
            </div>
          </div>
        </div>
      )}

      {/* Humidity chart view */}
      {selectedSensor === "humidity" && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium">Humidity Data</h3>
            <button
              className="text-xs text-green-600 border border-green-300 rounded-md px-2 py-1 hover:bg-green-50"
              onClick={() => setSelectedSensor("overview")}
            >
              Back to Overview
            </button>
          </div>
          <div className="h-40 flex flex-col">
            <div className="text-sm text-center mb-2 text-gray-500">Humidity Over Time</div>
            <div className="flex-1 border-b border-l border-gray-200 relative">
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                <div className="w-full h-3/5 bg-green-100 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-full">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,50 Q10,45 20,60 T40,70 T60,40 T80,30 T100,50" fill="none" stroke="#22c55e" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 pt-1">
                <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Temperature chart view */}
      {selectedSensor === "temperature" && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium">Temperature Data</h3>
            <button
              className="text-xs text-green-600 border border-green-300 rounded-md px-2 py-1 hover:bg-green-50"
              onClick={() => setSelectedSensor("overview")}
            >
              Back to Overview
            </button>
          </div>
          <div className="h-40 flex flex-col">
            <div className="text-sm text-center mb-2 text-gray-500">Temperature Over Time</div>
            <div className="flex-1 border-b border-l border-gray-200 relative">
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                <div className="w-full h-4/5 bg-red-50 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-full">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,30 Q10,40 20,35 T40,50 T60,45 T80,55 T100,45" fill="none" stroke="#ef4444" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                <span>30°C</span><span>20°C</span><span>10°C</span><span>0°C</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 pt-1">
                <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Light intensity chart view */}
      {selectedSensor === "light" && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium">Light Intensity Data</h3>
            <button
              className="text-xs text-green-600 border border-green-300 rounded-md px-2 py-1 hover:bg-green-50"
              onClick={() => setSelectedSensor("overview")}
            >
              Back to Overview
            </button>
          </div>
          <div className="h-40 flex flex-col">
            <div className="text-sm text-center mb-2 text-gray-500">Light Intensity Over Time</div>
            <div className="flex-1 border-b border-l border-gray-200 relative">
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                <div className="w-full h-4/5 bg-yellow-50 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-full">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,5 Q10,5 20,10 T40,80 T60,90 T80,70 T100,5" fill="none" stroke="#eab308" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                <span>100 lux</span><span>75 lux</span><span>50 lux</span><span>25 lux</span><span>0 lux</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 pt-1">
                <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
