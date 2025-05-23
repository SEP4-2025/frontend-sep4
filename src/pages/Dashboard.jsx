import '../App.css';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { compileDashboardData } from '../utils/dataCompiler';
import { getGardenerIdFromToken, getSensorThresholds } from '../api';
import NameCard from '../components/NameCard';
import SensorCard from '../components/SensorCard';
import { SensorOverview } from '../components/SensorOverview';
import NotificationCentre from '../components/NotificationCentre';
import { AIModelPredictions } from '../components/AIModelPredictions';
import ClockCard from '../components/ClockCard';
import LoadingScreen from '../components/LoadingScreen';

function Dashboard() {
  const { darkMode } = useDarkMode();
  const [lightSensorData, setLightSensorData] = useState(null);
  const [temperatureSensorData, setTemperatureSensorData] = useState(null);
  const [humiditySensorData, setHumiditySensorData] = useState(null);
  const [soilMoistureSensorData, setSoilMoistureSensorData] = useState(null);
  const [soilMoistureSensorThreshold, setSoilMoistureSensorThreshold] = useState(null);
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
  const [aiPredictionData, setAiPredictionData] = useState(null);

  const [gardenerId, setGardenerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = getGardenerIdFromToken();
    if (id) {
      setGardenerId(id);
    } else {
      console.warn('Gardener ID not found in token. Dashboard data will not be loaded.');
      setIsLoading(false); // Ensure loading stops if no ID
    }
  }, []);

  useEffect(() => {
    if (gardenerId) {
      setIsLoading(true);
      setError(null);
      Promise.all([
        compileDashboardData(gardenerId),
        getSensorThresholds('soilMoisture')
      ])
        .then(([dashboardData, thresholdValue]) => {
          setLightSensorData(dashboardData.lightSensorData);
          setTemperatureSensorData(dashboardData.temperatureSensorData);
          setHumiditySensorData(dashboardData.humiditySensorData);
          setSoilMoistureSensorData(dashboardData.soilMoistureSensorData);
          setSoilMoistureSensorThreshold(thresholdValue);
          setGreenhouseData(dashboardData.greenhouseData);
          setLightSensorDataAverageToday(dashboardData.lightSensorDataAverageToday);
          setTemperatureSensorDataAverageToday(dashboardData.temperatureSensorDataAverageToday);
          setHumiditySensorDataAverageToday(dashboardData.humiditySensorDataAverageToday);
          setSoilMoistureSensorDataAverageToday(dashboardData.soilMoistureSensorDataAverageToday);
          setLightSensorDataAverageYesterday(dashboardData.lightSensorDataAverageYesterday);
          setTemperatureSensorDataAverageYesterday(dashboardData.temperatureSensorDataAverageYesterday);
          setHumiditySensorDataAverageYesterday(dashboardData.humiditySensorDataAverageYesterday);
          setSoilMoistureSensorDataAverageYesterday(dashboardData.soilMoistureSensorDataAverageYesterday);
          setTemperatureHistory(dashboardData.temperatureHistory || []);
          setHumidityHistory(dashboardData.humidityHistory || []);
          setLightHistory(dashboardData.lightHistory || []);
          setSoilMoistureHistory(dashboardData.soilMoistureHistory || []);
          setNotificationData(dashboardData.notificationData);
          setNotificationPreferences(dashboardData.notificationPreferences);
          setAiPredictionData(dashboardData.aiPredictionData);
        })
        .catch((fetchError) => {
          console.error('Error fetching dashboard data or soil moisture threshold:', fetchError);
          setError(`Failed to load dashboard data: ${fetchError.message}. Please try again later.`);
          setSoilMoistureSensorThreshold(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // If gardenerId is not set (e.g., initially or if token issue), ensure loading is false.
      // This was slightly different in the provided snippet, ensuring it's covered.
      if (!getGardenerIdFromToken()) { // Double check, though the first useEffect should handle this.
         setIsLoading(false);
      }
    }
  }, [gardenerId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    // This error state should also be a simple content block.
    // App.jsx's <main> handles the background and scrolling.
    return (
      <div className={`px-4 py-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!gardenerId) {
    // This state should also be a simple content block.
    return (
      <div className={`px-4 py-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <p className="text-yellow-500 text-lg">Unable to retrieve user information. Please ensure you are logged in.</p>
      </div>
    );
  }

  // The root of the Dashboard page content.
  // - No `min-h-screen` or `h-screen`.
  // - No `flex flex-col` unless specifically needed for the grid's direct parent.
  // - No `overflow-y-auto`.
  // - Background color is inherited from App.jsx's <main> area.
  // - Text color and padding are appropriate here.
  return (
    <div className={`px-4 py-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
          <AIModelPredictions
            latestSoilMoistureReading={soilMoistureSensorData}
            aiSoilMoisturePrediction={aiPredictionData}
            soilMoistureSensorThreshold={soilMoistureSensorThreshold}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;