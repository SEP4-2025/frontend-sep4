import '../App.css';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { compileDashboardData } from '../utils/dataCompiler';
import { getGardenerIdFromToken } from '../api'; // Import the function
import NameCard from '../components/NameCard';
import SensorCard from '../components/SensorCard';
import { SensorOverview } from '../components/SensorOverview';
import NotificationCentre from '../components/NotificationCentre';
import { AIModelPredictions } from '../components/AIModelPredictions';
import ClockCard from '../components/ClockCard';
import LoadingScreen from '../components/LoadingScreen';

// Remove the local getGardenerIdFromToken helper function if it was here

const _dummyAiMetrics = [
  { name: 'Temperature', unit: 'ºC', value: 23, optimal: 25, min: 0, max: 50 },
  { name: 'Light Intensity', unit: 'lux', value: 15000, optimal: 20000, min: 4000, max: 24000 },
  { name: 'Humidity', unit: '%', value: 45, optimal: 60, min: 0, max: 100 },
];

function Dashboard() {
  const { darkMode } = useDarkMode();
  const [lightSensorData, setLightSensorData] = useState(null);
  const [temperatureSensorData, setTemperatureSensorData] = useState(null);
  const [humiditySensorData, setHumiditySensorData] = useState(null);
  const [soilMoistureSensorData, setSoilMoistureSensorData] = useState(null);
  const [greenhouseData, setGreenhouseData] = useState([]);
  const [lightSensorDataAverageToday, setLightSensorDataAverageToday] = useState(null);
  const [temperatureSensorDataAverageToday, setTemperatureSensorDataAverageToday] = useState(null);
  const [humiditySensorDataAverageToday, setHumiditySensorDataAverageToday] = useState(null);
  const [soilMoistureSensorDataAverageToday, setSoilMoistureSensorDataAverageToday] = useState(null);
  const [lightSensorDataAverageYesterday, setLightSensorDataAverageYesterday] = useState(null);
  const [temperatureSensorDataAverageYesterday, setTemperatureSensorDataAverageYesterday] = useState(null);
  const [humiditySensorDataAverageYesterday, setHumiditySensorDataAverageYesterday] = useState(null);
  const [soilMoistureSensorDataAverageYesterday, setSoilMoistureSensorDataAverageYesterday] = useState(null);
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [lightHistory, setLightHistory] = useState([]);
  const [soilMoistureHistory, setSoilMoistureHistory] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [notificationPreferences, setNotificationPreferences] = useState([]);
  
  const [gardenerId, setGardenerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = getGardenerIdFromToken(); // Use the imported function
    if (id) {
      setGardenerId(id);
    } else {
      // setError('User information could not be retrieved. Please log in again.');
      // It's possible the token is not yet available on initial load if login is async
      // Or if the user is not logged in.
      // Consider redirecting to login or showing a message.
      // For now, if no ID, data fetching won't proceed.
      console.warn('Gardener ID not found in token. Dashboard data will not be loaded.');
      setIsLoading(false); // Stop loading if no ID is found
    }
  }, []);

  useEffect(() => {
    if (gardenerId) {
      setIsLoading(true);
      setError(null);
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
          setNotificationData(data.notificationData);
          setNotificationPreferences(data.notificationPreferences);
        })
        .catch((fetchError) => {
          console.error('Error fetching dashboard data:', fetchError);
          setError(`Failed to load dashboard data: ${fetchError.message}. Please try again later.`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!isLoading && !getGardenerIdFromToken()) {
        // This condition ensures that if gardenerId was never set (e.g. no token),
        // and we are not already in a loading state from a previous attempt,
        // we set loading to false.
        // The first useEffect already handles setting isLoading to false if no ID is found initially.
        // This is more of a safeguard.
        setIsLoading(false);
    }
  }, [gardenerId]); // Re-run this effect if gardenerId changes

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className={`flex flex-col min-h-screen justify-center items-center ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!gardenerId) {
    // This state occurs if the token wasn't found or couldn't be parsed, and no error was set for data fetching.
    return (
      <div className={`flex flex-col min-h-screen justify-center items-center ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <p className="text-yellow-500 text-lg">Unable to retrieve user information. Please ensure you are logged in.</p>
        {/* Optionally, add a button to redirect to login page */}
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
      <main className={`flex-grow overflow-y-auto px-4 py-6 ${darkMode ? 'text-white' : 'text-gray-900'} ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
          <div className="lg:col-span-5">
            <NameCard greenhouseData={greenhouseData} />
          </div>
          <div className="hidden lg:block lg:col-span-1">
            <ClockCard />
          </div>
          <div className="lg:col-span-6 mt-1">
            <SensorCard
              lightSensorData={lightSensorData}
              temperatureSensorData={temperatureSensorData}
              humiditySensorData={humiditySensorData}
              soilMoistureSensorData={soilMoistureSensorData}
              lightSensorDataAverageToday={lightSensorDataAverageToday}
              temperatureSensorDataAverageToday={temperatureSensorDataAverageToday}
// ...existing code...
              humiditySensorDataAverageToday={humiditySensorDataAverageToday}
              soilMoistureSensorDataAverageToday={soilMoistureSensorDataAverageToday}
              lightSensorDataAverageYesterday={lightSensorDataAverageYesterday}
              temperatureSensorDataAverageYesterday={temperatureSensorDataAverageYesterday}
              humiditySensorDataAverageYesterday={humiditySensorDataAverageYesterday}
              soilMoistureSensorDataAverageYesterday={soilMoistureSensorDataAverageYesterday}
            />
          </div>
          <div className="lg:col-span-6 mb-5">
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
          </div>
          <div className="lg:col-span-3 mt-1">
            <NotificationCentre 
              notificationData={notificationData} 
              notificationPreferences={notificationPreferences} 
            />
          </div>
          <div className="lg:col-span-3 mt-1">
            <AIModelPredictions metrics={_dummyAiMetrics} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;