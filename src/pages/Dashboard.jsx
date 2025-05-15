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

  const [notificationData, setNotificationData] = useState([]);
  const [notificationPreferences, setNotificationPreferences] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const gardenerId = 1; //TODO: Get this from the logged-in user context or props
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

        // Set the notification data
        setNotificationData(data.notificationData);
        setNotificationPreferences(data.notificationPreferences);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingScreen />; // Note: LoadingScreen will also need dark mode
  }
  // If you are annoyed about the warnings in the console just comment out the sensor-card component
  return (
    <div className={`mx-auto px-4 py-6 ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-2">
        {/* Top row - Name Card and Clock */}
        <div className="lg:col-span-5">
          <Name_card greenhouseData={greenhouseData} />
        </div>
        <div className="lg:col-span-1">
          <ClockCard />
        </div>
        
        {/* Sensor Cards row - spans all columns */}
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
        
        {/* Sensor Overview */}
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
        
        {/* Bottom row - Notifications and AI Predictions */}
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
    </div>
  );
}

export default Dashboard;