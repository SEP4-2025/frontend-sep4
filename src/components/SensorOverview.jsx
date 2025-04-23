import { useState } from 'react';
import calendarIcon from '../assets/solar--calendar-linear.svg';

export function SensorOverview() {
  const [timeframe, setTimeframe] = useState("24h");
  const [selectedSensor, setSelectedSensor] = useState("overview"); // Options: overview, temperature, humidity, light
  
  return (
    <div className="bg-green-50 rounded-lg p-4 mb-3 max-h-80 w-250 mt-50 ml-5 mr-10 border-1 border-black">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold">Sensor Overview</h2>
          <p className="text-sm text-gray-500">Overview parameters</p>
        </div>
        <div className="flex items-center space-x-2">
          <img src={calendarIcon} className="w-5 h-5 text-green-600" alt="Calendar" />
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

      {/* Chart Navigation */}
      <div className="bg-white rounded-lg p-2 h-auto">
        {selectedSensor === "overview" && (
          <>
            <div className="grid grid-cols-3 h-8 mb-2">
              <div 
                className="border-r border-gray-200 flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-green-50 transition-colors"
                onClick={() => setSelectedSensor("temperature")}
              >
                Temperature
              </div>
              <div 
                className="border-r border-gray-200 flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-green-50 transition-colors"
                onClick={() => setSelectedSensor("humidity")}
              >
                Humidity
              </div>
              <div 
                className="flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-green-50 transition-colors"
                onClick={() => setSelectedSensor("light")}
              >
                Light Intensity
              </div>
            </div>
            <div className="h-36 flex justify-between p-1">
              {/* Temperature visualization */}
              <div className="flex flex-col items-center w-1/3 border-r border-gray-100 p-1">
                <div className="mb-2 w-full flex justify-center">
                  <span className="inline-flex items-center justify-center bg-red-50 p-1 rounded-full h-8 w-8">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="h-5 w-5">
                      <path d="M12 9.5V3m0 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm0 0V3m4.5 9.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z" /> {/* temperature icon visualization */}
                    </svg>
                  </span>
                </div>
                <div className="relative h-24 w-full flex justify-center">
                  <div className="absolute bottom-0 w-6 h-20 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-orange-300 rounded-full" style={{ height: '65%' }}></div>
                  </div>
                  <div className="absolute bottom-0 right-0 text-xs font-medium text-gray-700">25°C</div>
                </div>
              </div>

              {/* Humidity visualization */}
              <div className="flex flex-col items-center w-1/3 border-r border-gray-100 p-1">
                <div className="mb-2 w-full flex justify-center">
                  <span className="inline-flex items-center justify-center bg-blue-50 p-1 rounded-full h-8 w-8">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="h-5 w-5">
                      <path d="M12 21.5C16.5 21.5 20 18.5 20 14.5C20 10.5 12 3.5 12 3.5C12 3.5 4 10.5 4 14.5C4 18.5 7.5 21.5 12 21.5Z" /> {/* humidity icon visualization */}
                    </svg>
                  </span>
                </div>
                <div className="relative h-24 w-full flex justify-center">
                  <div className="absolute bottom-0 w-6 h-20 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-300 rounded-full" style={{ height: '45%' }}></div>
                  </div>
                  <div className="absolute bottom-0 right-0 text-xs font-medium text-gray-700">45%</div>
                </div>
              </div>

              {/* Light Intensity visualization */}
              <div className="flex flex-col items-center w-1/3 p-1">
                <div className="mb-2 w-full flex justify-center">
                  <span className="inline-flex items-center justify-center bg-yellow-50 p-1 rounded-full h-8 w-8">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" className="h-5 w-5">
                      <circle cx="12" cy="12" r="4" /> {/* light icon visualization */}
                      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  </span>
                </div>
                <div className="relative h-24 w-full flex justify-center">
                  <div className="absolute bottom-0 w-6 h-20 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-full" style={{ height: '80%' }}></div>
                  </div>
                  <div className="absolute bottom-0 right-0 text-xs font-medium text-gray-700">80 lux</div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Humidity specific chart view */}
        {selectedSensor === "humidity" && (
          <>
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
                {/* Humidity line chart simulation */}
                <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                  <div className="w-full h-3/5 bg-green-100 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-full">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path 
                        d="M0,50 Q10,45 20,60 T40,70 T60,40 T80,30 T100,50" 
                          fill="none" 
                          stroke="#22c55e" 
                          strokeWidth="2"
                        />  
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 pt-1">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Temperature specific chart view */}
        {selectedSensor === "temperature" && (
          <>
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
                {/* Temperature line chart simulation */}
                <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                  <div className="w-full h-4/5 bg-red-50 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-full">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path 
                          d="M0,30 Q10,40 20,35 T40,50 T60,45 T80,55 T100,45" 
                          fill="none" 
                          stroke="#ef4444" 
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                  <span>30°C</span>
                  <span>20°C</span>
                  <span>10°C</span>
                  <span>0°C</span>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 pt-1">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>

                {/* Interactive spot that redirects to humidity */}
                <div 
                  className="absolute left-1/2 bottom-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full cursor-pointer hover:bg-red-600"
                  onClick={() => setSelectedSensor("humidity")}
                  title="Click to view humidity data"
                ></div>
              </div>
            </div>
          </>
        )}
        
        {/* Light specific chart view */}
        {selectedSensor === "light" && (
          <>
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
                {/* Light intensity line chart simulation */}
                <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                  <div className="w-full h-4/5 bg-yellow-50 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-full">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path 
                          d="M0,5 Q10,5 20,10 T40,80 T60,90 T80,70 T100,5" 
                          fill="none" 
                          stroke="#eab308" 
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                  <span>100 lux</span>
                  <span>75 lux</span>
                  <span>50 lux</span>
                  <span>25 lux</span>
                  <span>0 lux</span>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 pt-1">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>

                {/* Interactive spot that redirects to humidity */}
                <div 
                  className="absolute left-3/4 bottom-1/4 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-600"
                  onClick={() => setSelectedSensor("humidity")}
                  title="Click to view humidity data"
                ></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
