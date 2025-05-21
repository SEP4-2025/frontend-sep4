import '../App.css'; // For any global styles it might need, path is correct from pages dir
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

const _dummyAiMetrics = [
  { name: 'Temperature', unit: 'ºC', value: 23, optimal: 25, min: 0, max: 50 },
  { name: 'Light Intensity', unit: 'lux', value: 15000, optimal: 20000, min: 4000, max: 24000 },
  { name: 'Humidity', unit: '%', value: 45, optimal: 60, min: 0, max: 100 },
];

// Assume toggleMobileNav is passed as a prop from the parent layout/router (App.jsx)
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
  const [isLoading, setIsLoading] = useState(true);
  const gardenerId = 1; //TODO: Get this from the logged-in user context or props

  useEffect(() => {
    setIsLoading(true);
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
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      });
  }, [gardenerId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
      <main className={`flex-grow overflow-y-auto px-4 py-6 ${darkMode ? 'text-white' : 'text-gray-900'} ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
          <div className="lg:col-span-5">
            <Name_card greenhouseData={greenhouseData} />
          </div>
          <div className="hidden lg:block lg:col-span-1">
            <ClockCard />
          </div>
          <div className="lg:col-span-6 mt-1">
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
            <Notification_centre 
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