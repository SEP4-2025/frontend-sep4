import {
  fetchGrenhouseDataByGardenerId,
  getSensorDataLastest,
  getSensorData,
  getSensorAverageByDate,
  getAllNotifications,
  getNotificationPreferences,
  toggleNotificationPreference
} from '../api';

function formatDate(date){
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function compileDashboardData(gardenerId) {
  const greenhouseData = await fetchGrenhouseDataByGardenerId(gardenerId);

  // Getting the current data about the sensors (latest single reading)
  const lightSensorData = await getSensorDataLastest('light');
  const temperatureSensorData = await getSensorDataLastest('temperature');
  const humiditySensorData = await getSensorDataLastest('humidity');
  const soilMoistureSensorData = await getSensorDataLastest('soilMoisture');

  // Getting the average data about the sensors from today
  const today = new Date();
  const todayFormatted = formatDate(today);
  const lightSensorDataAverageToday = await getSensorAverageByDate('light', todayFormatted);
  const temperatureSensorDataAverageToday = await getSensorAverageByDate('temperature', todayFormatted);
  const humiditySensorDataAverageToday = await getSensorAverageByDate('humidity', todayFormatted);
  const soilMoistureSensorDataAverageToday = await getSensorAverageByDate('soilMoisture', todayFormatted);
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayFormatted = formatDate(yesterday);
  const lightSensorDataAverageYesterday = await getSensorAverageByDate('light', yesterdayFormatted);
  const temperatureSensorDataAverageYesterday = await getSensorAverageByDate('temperature', yesterdayFormatted); 
  const humiditySensorDataAverageYesterday = await getSensorAverageByDate('humidity', yesterdayFormatted);
  const soilMoistureSensorDataAverageYesterday = await getSensorAverageByDate('soilMoisture', yesterdayFormatted);

  // Fetch historical data for each sensor type for the charts
  // getSensorData(type) returns an array of {date, value, sensorId}
  const temperatureHistory = await getSensorData('temperature');
  const humidityHistory = await getSensorData('humidity');
  const lightHistory = await getSensorData('light');
  const soilMoistureHistory = await getSensorData('soilMoisture');
  // Getting the notification data
  const notificationData = await getAllNotifications();
  const notificationPreferences = await getNotificationPreferences(); 

  return {
    // Current sensor data
    lightSensorData,
    temperatureSensorData,
    humiditySensorData,
    soilMoistureSensorData,
    // Grenhouse data, used to get the name of the greenhouse
    greenhouseData,
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
    // Notification data
    notificationData,
    notificationPreferences
  };

}

/**
 * Get notification preferences from the API
 * @returns {Promise<Array>} - Array of notification preferences
 */
export async function getNotificationPreferencesData() {
  try {
    return await getNotificationPreferences();
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
}

/**
 * Toggle notification preference status
 * @param {number} gardenerId - ID of the gardener
 * @param {string} type - Type of notification preference
 * @returns {Promise<string>} - Success message
 */
export async function toggleNotificationPreferenceData(gardenerId, type) {
  try {
    return await toggleNotificationPreference(gardenerId, type);
  } catch (error) {
    console.error(`Error toggling notification preference for gardener ${gardenerId} and type ${type}:`, error);
    throw error;
  }
}