import { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { compileDashboardData } from '../utils/dataCompiler';
import Name_card from '../components/Name-card';
import Sensor_card from '../components/Sensor-cards';
import { SensorOverview } from '../components/SensorOverview';
import Notification_centre from '../components/Notification-centre';
import { AIModelPredictions } from '../components/AIModelPredictions';
import ClockCard from '../components/Clock-card';
import LoadingScreen from '../components/Loading-screen';

// --- TEMPORARY DUMMY DATA GENERATOR ---
// TODO: Remove this function and its usage when real data pipeline is stable
function generateDummySensorOverviewData() {
  const sensorTypes = {
    temperature: { sensorId: 1, min: 15, max: 30, unit: '°C' },
    humidity: { sensorId: 2, min: 40, max: 70, unit: '%' },
    light: { sensorId: 3, min: 5000, max: 60000, unit: 'lux' }, // Wider range for light
    soilMoisture: { sensorId: 4, min: 30, max: 80, unit: '%' },
  };

  const histories = {
    temperatureHistory: [],
    humidityHistory: [],
    lightHistory: [],
    soilMoistureHistory: [],
  };

  const latestAverages = {
    latestTemperature: null,
    latestHumidity: null,
    latestLight: null,
    latestSoilMoisture: null,
  };

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const todayValues = { temperature: [], humidity: [], light: [], soilMoisture: [] };

  // Generate historical data for the past 35 days
  for (let dayOffset = 0; dayOffset < 35; dayOffset++) {
    const currentDay = new Date(now);
    currentDay.setDate(now.getDate() - dayOffset);

    // Generate readings every 3 hours for each day
    for (let hour = 0; hour < 24; hour += 3) {
      const readingDate = new Date(currentDay);
      readingDate.setHours(hour, 0, 0, 0);
      const readingDateISO = readingDate.toISOString();

      Object.entries(sensorTypes).forEach(([key, config]) => {
        let value = Math.random() * (config.max - config.min) + config.min;
        // Simulate day/night cycle for light
        if (key === 'light') {
          if (hour < 6 || hour > 20) { // Night time
            value = Math.random() * 500 + 100; // Much lower light
          } else { // Day time
             value = Math.random() * (50000 - 10000) + 10000; // Higher light
          }
        }
        const reading = {
          id: Math.floor(Math.random() * 100000), // Dummy ID
          date: readingDateISO,
          value: parseFloat(value.toFixed(2)),
          sensorId: config.sensorId,
        };
        histories[`${key}History`].push(reading);

        // Collect today's values for averaging
        if (dayOffset === 0) {
          todayValues[key].push(reading.value);
        }
      });
    }
  }

  // Calculate today's averages
  Object.entries(sensorTypes).forEach(([key, config]) => {
    if (todayValues[key].length > 0) {
      const sum = todayValues[key].reduce((acc, val) => acc + val, 0);
      const avg = sum / todayValues[key].length;
      latestAverages[`latest${key.charAt(0).toUpperCase() + key.slice(1)}`] = {
        // id: Math.floor(Math.random() * 10000), // Average doesn't usually have its own DB id like this
        date: todayStr,
        value: parseFloat(avg.toFixed(2)),
        sensorId: config.sensorId,
      };
    }
  });
  
  // Dummy greenhouse data (if needed by other components, otherwise can be omitted if only for SensorOverview)
  const dummyGreenhouseData = [{ id: 1, name: "Dummy Greenhouse", gardenerId: 1 }];

  console.log("--- USING DUMMY SENSOR DATA ---");
  return {
    ...histories,
    ...latestAverages,
    // Add other data pieces if compileDashboardData usually returns them and they are needed
    lightSensorData: latestAverages.latestLight, // Or a specific "latest" reading if different from average
    temperatureSensorData: latestAverages.latestTemperature,
    humiditySensorData: latestAverages.latestHumidity,
    soilMoistureSensorData: latestAverages.latestSoilMoisture,
    greenhouseData: dummyGreenhouseData,
    lightSensorDataAverageToday: latestAverages.latestLight,
    temperatureSensorDataAverageToday: latestAverages.latestTemperature,
    humiditySensorDataAverageToday: latestAverages.latestHumidity,
    soilMoistureSensorDataAverageToday: latestAverages.latestSoilMoisture,
    // Dummy yesterday's averages (can be simplified or made more realistic)
    lightSensorDataAverageYesterday: { ...latestAverages.latestLight, value: latestAverages.latestLight ? parseFloat((latestAverages.latestLight.value * 0.9).toFixed(2)) : null },
    temperatureSensorDataAverageYesterday: { ...latestAverages.latestTemperature, value: latestAverages.latestTemperature ? parseFloat((latestAverages.latestTemperature.value * 0.95).toFixed(2)) : null },
    humiditySensorDataAverageYesterday: { ...latestAverages.latestHumidity, value: latestAverages.latestHumidity ? parseFloat((latestAverages.latestHumidity.value * 1.05).toFixed(2)) : null },
    soilMoistureSensorDataAverageYesterday: { ...latestAverages.latestSoilMoisture, value: latestAverages.latestSoilMoisture ? parseFloat((latestAverages.latestSoilMoisture.value * 0.98).toFixed(2)) : null },
  };
}
// --- END OF TEMPORARY DUMMY DATA GENERATOR ---

const _dummyAiMetrics = [
  { name: 'Temperature', unit: 'ºC', value: 23, optimal: 25 },
  { name: 'Light Intensity', unit: 'lux', value: 15000, optimal: 20000 },
  { name: 'Humidity', unit: '%', value: 45, optimal: 60 },
];

function Dashboard() {
  // States for latest single values (used by Sensor_card)
  const { darkMode } = useDarkMode();
  const [lightSensorData, setLightSensorData] = useState(null);
  const [temperatureSensorData, setTemperatureSensorData] = useState(null);
  const [humiditySensorData, setHumiditySensorData] = useState(null);
  const [soilMoistureSensorData, setSoilMoistureSensorData] = useState(null);
  
  const [greenhouseData, setGreenhouseData] = useState([]);
  
  // States for today's averages (used by Sensor_card and SensorOverview overview cards)
  const [lightSensorDataAverageToday, setLightSensorDataAverageToday] = useState(null);
  const [temperatureSensorDataAverageToday, setTemperatureSensorDataAverageToday] = useState(null);
  const [humiditySensorDataAverageToday, setHumiditySensorDataAverageToday] = useState(null);
  const [soilMoistureSensorDataAverageToday, setSoilMoistureSensorDataAverageToday] = useState(null);
  
  // States for yesterday's averages (used by Sensor_card)
  const [lightSensorDataAverageYesterday, setLightSensorDataAverageYesterday] = useState(null);
  const [temperatureSensorDataAverageYesterday, setTemperatureSensorDataAverageYesterday] = useState(null);
  const [humiditySensorDataAverageYesterday, setHumiditySensorDataAverageYesterday] = useState(null);
  const [soilMoistureSensorDataAverageYesterday, setSoilMoistureSensorDataAverageYesterday] = useState(null);

  // New states for historical data for SensorOverview charts
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [lightHistory, setLightHistory] = useState([]);
  const [soilMoistureHistory, setSoilMoistureHistory] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // Dummy data flag (for testing purposes)
  const USE_DUMMY_DATA = true; // Set to true to use dummy data, false to fetch real data
  useEffect(() => {
    const gardenerId = 1; //TODO: Get this from the logged-in user context or props
    setIsLoading(true);

    if (USE_DUMMY_DATA) {
      const dummyData = generateDummySensorOverviewData();
      setLightSensorData(dummyData.lightSensorData);
      setTemperatureSensorData(dummyData.temperatureSensorData);
      setHumiditySensorData(dummyData.humiditySensorData);
      setSoilMoistureSensorData(dummyData.soilMoistureSensorData);
      
      setGreenhouseData(dummyData.greenhouseData);
      
      setLightSensorDataAverageToday(dummyData.lightSensorDataAverageToday);
      setTemperatureSensorDataAverageToday(dummyData.temperatureSensorDataAverageToday);
      setHumiditySensorDataAverageToday(dummyData.humiditySensorDataAverageToday);
      setSoilMoistureSensorDataAverageToday(dummyData.soilMoistureSensorDataAverageToday);
      
      setLightSensorDataAverageYesterday(dummyData.lightSensorDataAverageYesterday);
      setTemperatureSensorDataAverageYesterday(dummyData.temperatureSensorDataAverageYesterday);
      setHumiditySensorDataAverageYesterday(dummyData.humiditySensorDataAverageYesterday);
      setSoilMoistureSensorDataAverageYesterday(dummyData.soilMoistureSensorDataAverageYesterday);

      setTemperatureHistory(dummyData.temperatureHistory || []);
      setHumidityHistory(dummyData.humidityHistory || []);
      setLightHistory(dummyData.lightHistory || []);
      setSoilMoistureHistory(dummyData.soilMoistureHistory || []);

      setIsLoading(false);
    } else {
      compileDashboardData(gardenerId)
        .then((data) => {
          setLightSensorData(data.lightSensorData);
          setTemperatureSensorData(data.temperatureSensorData);
          setHumiditySensorData(data.humiditySensorData);
          setSoilMoistureSensorData(data.soilMoistureSensorData);
          
          setGreenhouseData(data.greenhouseData);
          
          setLightSensorDataAverageToday(data.lightSensorDataAverageToday);
          setTemperatureSensorDataAverageToday(data.temperatureSensorDataAverageToday);
          setHumiditySensorDataAverageToday(data.humiditySensorDataAverageToday);
          setSoilMoistureSensorDataAverageToday(data.soilMoistureSensorDataAverageToday);
          
          setLightSensorDataAverageYesterday(data.lightSensorDataAverageYesterday);
          setTemperatureSensorDataAverageYesterday(data.temperatureSensorDataAverageYesterday);
          setHumiditySensorDataAverageYesterday(data.humiditySensorDataAverageYesterday);
          setSoilMoistureSensorDataAverageYesterday(data.soilMoistureSensorDataAverageYesterday);

          setTemperatureHistory(data.temperatureHistory || []);
          setHumidityHistory(data.humidityHistory || []);
          setLightHistory(data.lightHistory || []);
          setSoilMoistureHistory(data.soilMoistureHistory || []);

          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching dashboard data:', error);
          setIsLoading(false);
        });
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen />; // Note: LoadingScreen will also need dark mode
  }
  // If you are annoyed about the warnings in the console just comment out the sensor-card component
  return (
    <div className={`p-4 min-h-screen ${darkMode ? 'darkMode' : ''}`}>
      <div className='flex flex-row justify-between'>
        <Name_card greenhouseData={greenhouseData} />
        <ClockCard />
      </div>
      <Sensor_card 
        lightSensorData={lightSensorData}
        temperatureSensorData={temperatureSensorData}
        humiditySensorData={humiditySensorData}
        soilMoistureSensorData={soilMoistureSensorData}
        lightSensorDataAverageToday={lightSensorDataAverageToday}
        temperatureSensorDataAverageToday={temperatureSensorDataAverageToday}
        humiditySensorDataAverageToday={humiditySensorDataAverageToday}
        soilMoistureSensorDataAverageToday={soilMoistureSensorDataAverageToday}
        lightSensorDataAverageYesterday={lightSensorDataAverageYesterday}
        temperatureSensorDataAverageYesterday={temperatureSensorDataAverageYesterday}
        humiditySensorDataAverageYesterday={humiditySensorDataAverageYesterday}
        soilMoistureSensorDataAverageYesterday={soilMoistureSensorDataAverageYesterday} 
      />
      <SensorOverview 
        temperatureHistory={temperatureHistory}
        humidityHistory={humidityHistory}
        lightHistory={lightHistory}
        soilMoistureHistory={soilMoistureHistory}
        latestTemperature={temperatureSensorDataAverageToday}
        latestHumidity={humiditySensorDataAverageToday}
        latestLight={lightSensorDataAverageToday}
        latestSoilMoisture={soilMoistureSensorDataAverageToday}
      />
      <div className="flex ">
        <Notification_centre />
        <AIModelPredictions metrics={_dummyAiMetrics} />
      </div>
    </div>
  );
}

export default Dashboard;