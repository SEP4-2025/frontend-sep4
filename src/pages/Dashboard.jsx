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

const _dummyMetrics = [
  { name: 'Temperature', unit: 'ºC', value: 23, optimal: 25 },
  { name: 'Light Intensity', unit: 'lux', value: 15000, optimal: 20000 },
  { name: 'Humidity', unit: '%', value: 45, optimal: 60 },
];

function Dashboard() {
  const { darkMode } = useDarkMode();
  const [lightSensorData, setlightSensorData,] = useState([]);
  const [temperatureSensorData, setTemperatureSensorData] = useState([]);
  const [humiditySensorData, setHumiditySensorData] = useState([]);
  const [soilMoistureSensorData, setSoilMoistureSensorData] = useState([]);
  const [greenhouseData, setGreenhouseData] = useState([]);
  const [lightSensorDataAverageToday, setLightSensorDataAverageToday] = useState([]);
  const [temperatureSensorDataAverageToday, setTemperatureSensorDataAverageToday] = useState([]);
  const [humiditySensorDataAverageToday, setHumiditySensorDataAverageToday] = useState([]);
  const [soilMoistureSensorDataAverageToday, setSoilMoistureSensorDataAverageToday] = useState([]);
  const [lightSensorDataAverageYesterday, setLightSensorDataAverageYesterday] = useState([]);
  const [temperatureSensorDataAverageYesterday, setTemperatureSensorDataAverageYesterday] = useState([]);
  const [humiditySensorDataAverageYesterday, setHumiditySensorDataAverageYesterday] = useState([]);
  const [soilMoistureSensorDataAverageYesterday, setSoilMoistureSensorDataAverageYesterday] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const gardenerId = 1; // TODO: We will need to pass the information about the gardenerId from the login page to the dashboard page, for now it is hardcoded
    compileDashboardData(gardenerId)
      .then((data) => {
        // Set the current sensor data
        setlightSensorData(data.lightSensorData);
        setTemperatureSensorData(data.temperatureSensorData);
        setHumiditySensorData(data.humiditySensorData);
        setSoilMoistureSensorData(data.soilMoistureSensorData);
        // Set the greenhouse data
        setGreenhouseData(data.greenhouseData);
        // Set the average sensor data today
        setLightSensorDataAverageToday(data.lightSensorDataAverageToday);
        setTemperatureSensorDataAverageToday(data.temperatureSensorDataAverageToday);
        setHumiditySensorDataAverageToday(data.humiditySensorDataAverageToday);
        setSoilMoistureSensorDataAverageToday(data.soilMoistureSensorDataAverageToday);
        // Set the average sensor data yesterday
        setLightSensorDataAverageYesterday(data.lightSensorDataAverageYesterday);
        setTemperatureSensorDataAverageYesterday(data.temperatureSensorDataAverageYesterday);
        setHumiditySensorDataAverageYesterday(data.humiditySensorDataAverageYesterday);
        setSoilMoistureSensorDataAverageYesterday(data.soilMoistureSensorDataAverageYesterday);

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
    <div className={`p-4 min-h-screen ${darkMode ? 'darkMode' : ''}`}>
      <div className='flex flex-row justify-between'>
        <Name_card greenhouseData={greenhouseData} />
        <ClockCard />
      </div>
      <Sensor_card lightSensorData={lightSensorData}
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
        soilMoistureSensorDataAverageYesterday={soilMoistureSensorDataAverageYesterday} />
      <SensorOverview />
      <div className="flex ">
        <Notification_centre />
        <AIModelPredictions metrics={_dummyMetrics} />
      </div>
    </div>
  );
}

export default Dashboard;
