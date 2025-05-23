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

// Import icons for each sensor
import lightIcon from '../assets/entypo--light-up.svg';
import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/hugeicons--humidity.svg';
import soilMoistureIcon from '../assets/soil-moisture-icon.svg';
import waterLevelIcon from '../assets/lets-icons--water.svg';

function Dashboard() {
  const { darkMode } = useDarkMode();
  const [greenhouseData, setGreenhouseData] = useState(null);
  const [lightSensorData, setLightSensorData] = useState(null);
  const [temperatureSensorData, setTemperatureSensorData] = useState(null);
  const [humiditySensorData, setHumiditySensorData] = useState(null);
  const [soilMoistureSensorData, setSoilMoistureSensorData] = useState(null);
  const [soilMoistureSensorThreshold, setSoilMoistureSensorThreshold] = useState(null);
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
  const [waterLevelCardData, setWaterLevelCardData] = useState(null);

  const [gardenerId, setGardenerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = getGardenerIdFromToken();
    if (id) {
      setGardenerId(id);
    } else {
      console.warn('Gardener ID not found in token. Dashboard data will not be loaded.');
      setError("User information not found. Please log in again.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!gardenerId) return;

    let isMounted = true;

    const fetchData = async (isInitialLoad = false) => {
      if (isInitialLoad && isMounted) {
        setIsLoading(true);
        setError(null);
      }

      try {
        // Call compileDashboardData and getSensorThresholds without signal
        const [dashboardData, thresholdValue] = await Promise.all([
          compileDashboardData(gardenerId),
          getSensorThresholds('soilMoisture')
        ]);

        if (isMounted) {
          setGreenhouseData(dashboardData.greenhouseData);
          setLightSensorData(dashboardData.lightSensorData);
          setTemperatureSensorData(dashboardData.temperatureSensorData);
          setHumiditySensorData(dashboardData.humiditySensorData);
          setSoilMoistureSensorData(dashboardData.soilMoistureSensorData);
          setSoilMoistureSensorThreshold(thresholdValue);
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
          setWaterLevelCardData(dashboardData.waterLevelCardData);
          if (!isInitialLoad) setError(null); // Clear previous non-critical errors on successful background refresh
        }
      } catch (fetchError) {
        if (isMounted) {
            console.error('Error fetching dashboard data:', fetchError);
            if (isInitialLoad) {
                setError(`Failed to load dashboard data: ${fetchError.message}.`);
                setSoilMoistureSensorThreshold(null); // Reset threshold if initial load fails
            } else {
                // For background refresh failures, just log a warning.
                // The UI will continue to show the stale data.
                console.warn("Background dashboard data refresh failed:", fetchError.message);
            }
        }
      } finally {
        if (isMounted && isInitialLoad) {
          setIsLoading(false);
        }
      }
    };

    fetchData(true); // Initial fetch

    const intervalId = setInterval(() => fetchData(false), 30000); // Refresh every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [gardenerId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className={`px-4 py-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }
  
  // Display message if data is null after loading and no critical error
  if (!greenhouseData && !error && !isLoading) {
      return (
          <div className={`px-4 py-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <p>No dashboard data available. Try refreshing.</p>
          </div>
      );
  }

  return (
    <div className={`px-4 py-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
        <div className="lg:col-span-5">
          <NameCard greenhouseData={greenhouseData} />
        </div>
        <div className="hidden lg:block lg:col-span-1">
          <ClockCard />
        </div>

        <div className="lg:col-span-6 mt-1 grid grid-cols-2 lg:grid-cols-5 gap-4">
          <SensorCard
            title="Light"
            iconSrc={lightIcon}
            currentData={lightSensorData}
            averageToday={lightSensorDataAverageToday}
            averageYesterday={lightSensorDataAverageYesterday}
            unit=" lux"
            precision={0}
            cardClassName="lg:col-span-1"
            dataTestId="light-sensor-card"
          />
          <SensorCard
            title="Temperature"
            iconSrc={temperatureIcon}
            currentData={temperatureSensorData}
            averageToday={temperatureSensorDataAverageToday}
            averageYesterday={temperatureSensorDataAverageYesterday}
            unit="°C"
            precision={1}
            cardClassName="lg:col-span-1"
            dataTestId="temperature-sensor-card"
          />
          <SensorCard
            title="Humidity"
            iconSrc={humidityIcon}
            currentData={humiditySensorData}
            averageToday={humiditySensorDataAverageToday}
            averageYesterday={humiditySensorDataAverageYesterday}
            unit="%"
            precision={1}
            cardClassName="lg:col-span-1"
            dataTestId="humidity-sensor-card"
          />
          <SensorCard
            title="Soil Moisture"
            iconSrc={soilMoistureIcon}
            currentData={soilMoistureSensorData}
            averageToday={soilMoistureSensorDataAverageToday}
            averageYesterday={soilMoistureSensorDataAverageYesterday}
            unit="%"
            precision={1}
            cardClassName="lg:col-span-1"
            dataTestId="soil-moisture-sensor-card"
          />
          <SensorCard
            title="Water Level"
            iconSrc={waterLevelIcon}
            currentData={waterLevelCardData}
            additionalText={waterLevelCardData ? `Level: ${waterLevelCardData.value}%` : 'N/A'}
            unit="%" 
            precision={0}
            cardClassName="col-span-2 lg:col-span-1"
            dataTestId="water-level-sensor-card"
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