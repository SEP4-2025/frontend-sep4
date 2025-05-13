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
    light: { sensorId: 3, min: 100, max: 60000, unit: 'lux' }, // Adjusted min for night
    soilMoisture: { sensorId: 4, min: 30, max: 80, unit: '%' },
  };

  const histories = {
    temperatureHistory: [],
    humidityHistory: [],
    lightHistory: [],
    soilMoistureHistory: [],
  };

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const yesterdayDt = new Date(now);
  yesterdayDt.setDate(now.getDate() - 1);
  const yesterdayStr = yesterdayDt.toISOString().split('T')[0];

  const todayValuesForAverage = { temperature: [], humidity: [], light: [], soilMoisture: [] };

  // Generate historical data for the past 35 days
  for (let dayOffset = 34; dayOffset >= 0; dayOffset--) { // Iterate from past to present for easier sorting later
    const currentLoopDay = new Date(now);
    currentLoopDay.setDate(now.getDate() - dayOffset);
    currentLoopDay.setHours(0, 0, 0, 0); // Start of the day

    // Generate readings every 3 hours for each day
    for (let hour = 0; hour < 24; hour += 3) {
      const readingDate = new Date(currentLoopDay);
      readingDate.setHours(hour, 0, 0, 0);
      const readingDateISO = readingDate.toISOString();

      Object.entries(sensorTypes).forEach(([key, config]) => {
        let value = Math.random() * (config.max - config.min) + config.min;
        if (key === 'light') {
          if (hour < 6 || hour >= 21) { // Night time (e.g., before 6 AM or after 9 PM)
            value = Math.random() * (config.min + 400) + config.min; // Lower light, e.g. 100-500 lux
          } else { // Day time
            value = Math.random() * (config.max - (config.min + 10000)) + (config.min + 10000); // Higher light
          }
        }
        const reading = {
          id: Math.floor(Math.random() * 1000000), // Dummy ID
          date: readingDateISO,
          value: parseFloat(value.toFixed(2)),
          sensorId: config.sensorId,
        };
        histories[`${key}History`].push(reading);

        // Collect today's values for averaging
        if (dayOffset === 0) { // Today
          todayValuesForAverage[key].push(reading.value);
        }
      });
    }
  }

  // Sort histories chronologically (oldest to newest)
  Object.values(histories).forEach(historyArray => {
    historyArray.sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  // Get latest single sensor readings
  const getLatestReading = (historyArray) => historyArray.length > 0 ? historyArray[historyArray.length - 1] : null;

  const lightSensorData = getLatestReading(histories.lightHistory);
  const temperatureSensorData = getLatestReading(histories.temperatureHistory);
  const humiditySensorData = getLatestReading(histories.humidityHistory);
  const soilMoistureSensorData = getLatestReading(histories.soilMoistureHistory);

  // Calculate today's averages
  const calculateAverage = (values, dateString, sensorId) => {
    if (values.length === 0) return null;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    return {
      date: dateString,
      value: parseFloat(avg.toFixed(2)),
      sensorId: sensorId,
    };
  };

  const lightSensorDataAverageToday = calculateAverage(todayValuesForAverage.light, todayStr, sensorTypes.light.sensorId);
  const temperatureSensorDataAverageToday = calculateAverage(todayValuesForAverage.temperature, todayStr, sensorTypes.temperature.sensorId);
  const humiditySensorDataAverageToday = calculateAverage(todayValuesForAverage.humidity, todayStr, sensorTypes.humidity.sensorId);
  const soilMoistureSensorDataAverageToday = calculateAverage(todayValuesForAverage.soilMoisture, todayStr, sensorTypes.soilMoisture.sensorId);

  // Derive yesterday's averages (simplified)
  const deriveYesterdayAverage = (todayAverage, dateStr) => {
    if (!todayAverage) return null;
    // Simulate some variation for yesterday
    let multiplier = 1;
    if (todayAverage.sensorId === sensorTypes.temperature.sensorId) multiplier = 0.98; // Slightly cooler
    else if (todayAverage.sensorId === sensorTypes.humidity.sensorId) multiplier = 1.02; // Slightly more humid
    else if (todayAverage.sensorId === sensorTypes.light.sensorId) multiplier = 0.95; // Slightly less light
    else if (todayAverage.sensorId === sensorTypes.soilMoisture.sensorId) multiplier = 0.97; // Slightly drier

    return {
      ...todayAverage, // spread sensorId
      date: dateStr,
      value: parseFloat((todayAverage.value * multiplier).toFixed(2)),
    };
  };

  const lightSensorDataAverageYesterday = deriveYesterdayAverage(lightSensorDataAverageToday, yesterdayStr);
  const temperatureSensorDataAverageYesterday = deriveYesterdayAverage(temperatureSensorDataAverageToday, yesterdayStr);
  const humiditySensorDataAverageYesterday = deriveYesterdayAverage(humiditySensorDataAverageToday, yesterdayStr);
  const soilMoistureSensorDataAverageYesterday = deriveYesterdayAverage(soilMoistureSensorDataAverageToday, yesterdayStr);

  const dummyGreenhouseData = [{ id: 1, name: "Dummy's greenhouse", gardenerId: 1 }];

  console.log("--- USING DUMMY SENSOR DATA ---");
  return {
    // Current sensor data (latest single reading)
    lightSensorData,
    temperatureSensorData,
    humiditySensorData,
    soilMoistureSensorData,

    // Greenhouse data
    greenhouseData: dummyGreenhouseData,

    // Average sensor data today
    lightSensorDataAverageToday,
    temperatureSensorDataAverageToday,
    humiditySensorDataAverageToday,
    soilMoistureSensorDataAverageToday,

    // Average sensor data yesterday
    lightSensorDataAverageYesterday,
    temperatureSensorDataAverageYesterday,
    humiditySensorDataAverageYesterday,
    soilMoistureSensorDataAverageYesterday,

    // Historical sensor data for charts
    temperatureHistory: histories.temperatureHistory,
    humidityHistory: histories.humidityHistory,
    lightHistory: histories.lightHistory,
    soilMoistureHistory: histories.soilMoistureHistory,
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

  const [notificationData, setNotificationData] = useState([]);
  const [notificationPreferences, setNotificationPreferences] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // Dummy data flag (for testing purposes)
  const USE_DUMMY_DATA = true; // Set to true to use dummy data, false to fetch real data
  useEffect(() => {
    const gardenerId = 1; //TODO: Get this from the logged-in user context or props
    setIsLoading(true);

    if (USE_DUMMY_DATA) {
      const dummyData = generateDummySensorOverviewData();
      console.log("Generated Dummy Data:", dummyData);

      // Latest single readings
      setLightSensorData(dummyData.lightSensorData);
      setTemperatureSensorData(dummyData.temperatureSensorData);
      setHumiditySensorData(dummyData.humiditySensorData);
      setSoilMoistureSensorData(dummyData.soilMoistureSensorData);

      setGreenhouseData(dummyData.greenhouseData);

      // Today's averages
      setLightSensorDataAverageToday(dummyData.lightSensorDataAverageToday);
      setTemperatureSensorDataAverageToday(dummyData.temperatureSensorDataAverageToday);
      setHumiditySensorDataAverageToday(dummyData.humiditySensorDataAverageToday);
      setSoilMoistureSensorDataAverageToday(dummyData.soilMoistureSensorDataAverageToday);

      // Yesterday's averages
      setLightSensorDataAverageYesterday(dummyData.lightSensorDataAverageYesterday);
      setTemperatureSensorDataAverageYesterday(dummyData.temperatureSensorDataAverageYesterday);
      setHumiditySensorDataAverageYesterday(dummyData.humiditySensorDataAverageYesterday);
      setSoilMoistureSensorDataAverageYesterday(dummyData.soilMoistureSensorDataAverageYesterday);

      // Historical data
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

          // Set the notification data
          setNotificationData(data.notificationData);
          setNotificationPreferences(data.notificationPreferences);

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
        <Notification_centre notificationData={notificationData} notificationPreferences={notificationPreferences} />
        <AIModelPredictions metrics={_dummyAiMetrics} />
      </div>
    </div>
  );
}

export default Dashboard;