import {
  fetchGrenhouseDataByGardenerId,
  getSensorDataLastest,
  getSensorData,
  getSensorAverageByDate,
  getAllNotifications,
  getNotificationPreferences,
  toggleNotificationPreference,
  getSensorStatus,
  getSensorThresholds,
  getLogs
} from '../api';

function formatDate(date){
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function compileDashboardData(gardenerId) {
  const greenhouseData = await fetchGrenhouseDataByGardenerId(gardenerId);

  const lightSensorData = await getSensorDataLastest('light');
  const temperatureSensorData = await getSensorDataLastest('temperature');
  const humiditySensorData = await getSensorDataLastest('humidity');
  const soilMoistureSensorData = await getSensorDataLastest('soilMoisture');

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

  // Fetch historical data
  const rawTemperatureHistory = await getSensorData('temperature');
  const temperatureHistory = rawTemperatureHistory.map(item => ({ date: item.timeStamp, value: item.value }));

  const rawHumidityHistory = await getSensorData('humidity');
  const humidityHistory = rawHumidityHistory.map(item => ({ date: item.timeStamp, value: item.value }));

  const rawLightHistory = await getSensorData('light');
  const lightHistory = rawLightHistory.map(item => ({ date: item.timeStamp, value: item.value }));

  const rawSoilMoistureHistory = await getSensorData('soilMoisture');
  const soilMoistureHistory = rawSoilMoistureHistory.map(item => ({ date: item.timeStamp, value: item.value }));

  const notificationData = await getAllNotifications();
  const notificationPreferences = await getNotificationPreferences(); 

  // Log the fetched data for debugging
  console.log('✅➡️Fetched data:', {
    lightSensorData,
    temperatureSensorData,
    humiditySensorData,
    soilMoistureSensorData,
    greenhouseData,
    lightSensorDataAverageToday,
    temperatureSensorDataAverageToday,
    humiditySensorDataAverageToday,
    soilMoistureSensorDataAverageToday,
    lightSensorDataAverageYesterday,
    temperatureSensorDataAverageYesterday,
    humiditySensorDataAverageYesterday,
    soilMoistureSensorDataAverageYesterday,
    temperatureHistory,
    humidityHistory,
    lightHistory,
    soilMoistureHistory,
    notificationData,
    notificationPreferences
  });

  return {
    lightSensorData,
    temperatureSensorData,
    humiditySensorData,
    soilMoistureSensorData,
    greenhouseData,
    lightSensorDataAverageToday,
    temperatureSensorDataAverageToday,
    humiditySensorDataAverageToday,
    soilMoistureSensorDataAverageToday,
    lightSensorDataAverageYesterday,
    temperatureSensorDataAverageYesterday,
    humiditySensorDataAverageYesterday,
    soilMoistureSensorDataAverageYesterday,
    temperatureHistory,
    humidityHistory,
    lightHistory,
    soilMoistureHistory,
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

export async function compileSensorLogs(sensorApiType, signal) {
  try {
    // getLogs expects sensorType like "temperature", "humidity", etc.
    // It fetches all logs for that type if date is null.
    // The getLogs function in api/index.js does not currently accept a signal.
    const rawLogs = await getLogs(sensorApiType, null);

    //print the raw logs for debugging
    console.log(`➡️ Raw logs for ${sensorApiType}:`, rawLogs);

    if (!rawLogs || !Array.isArray(rawLogs)) {
      console.warn(`No logs returned or invalid format for ${sensorApiType} from getLogs.`);
      return [];
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const filteredLogs = rawLogs.filter(log => {
      if (!log || !log.date) { // API log object has 'date'
        return false;
      }
      const logDate = new Date(log.date);
      // Check if the date is valid and within the last 30 days
      return !isNaN(logDate.getTime()) && logDate >= thirtyDaysAgo;
    });

    // Map to the structure expected by NotificationCard/SensorLog component
    // The API log has: date, message, waterpumpid, sensorreadingid, greenhouseid
    // SensorLog (via NotificationCard) expects: type, message, timeStamp
    return filteredLogs.map(log => ({
      type: "Log Entry", // API logs don't have a 'type' like "Warning", "Info". Using a generic one.
      message: log.message,
      timeStamp: new Date(log.date).toLocaleString(), // Format for display
      // You can include original log data if needed elsewhere
      // originalData: log 
    })).sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)); // Sort by most recent first for display

  } catch (error) {
    // Handle AbortError if the main page's signal caused an abort elsewhere that affects this.
    if (error.name === 'AbortError' && signal && signal.aborted) {
      console.log(`Log fetching operation possibly affected by abort signal for ${sensorApiType}.`);
      // Rethrow if the signal passed to this function (if it were used by getLogs) was aborted.
      // Since getLogs doesn't use it, this is more for consistency if the page aborts.
      throw error;
    }
    console.error(`Error compiling sensor logs for ${sensorApiType}:`, error);
    return []; // Return empty array on error to prevent UI crashing
  }
}

export async function compileSensorViewGraphData(sensorApiType, sensorConfig, signal) {
  const options = signal ? { signal } : {};

  try {
    const [historyDataRaw, thresholdValue, latestDataRaw, statusRaw] = await Promise.all([
      getSensorData(sensorApiType, options),
      getSensorThresholds(sensorApiType, options),
      getSensorDataLastest(sensorApiType, options),
      getSensorStatus(sensorApiType, options)
    ]);

    let processedHistory = [];
    if (Array.isArray(historyDataRaw) && historyDataRaw.length > 0) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      
      //console.log(`[DEBUG] thirtyDaysAgo: ${thirtyDaysAgo.toISOString()} for ${sensorApiType}`);

      const recentData = historyDataRaw.filter((item, index) => {
        // Use item.timeStamp instead of item.date
        //console.log(`[DEBUG ${sensorApiType}] Filtering item ${index}: Original item.timeStamp = "${item ? item.timeStamp : 'N/A'}", item.value = "${item ? item.value : 'N/A'}"`);

        // Use item.timeStamp for checks
        if (!item || typeof item.timeStamp === 'undefined' || item.timeStamp === null || item.value === null || typeof item.value === 'undefined') {
            //console.log(`[DEBUG ${sensorApiType}] Item ${index} invalid (missing properties, null timeStamp, or null/undefined value). Skipping.`);
            return false;
        }
        
        const itemDateStr = item.timeStamp; // Use item.timeStamp
        const itemDate = new Date(itemDateStr); 
        const isItemDateValid = !isNaN(itemDate.getTime()); 

        //console.log(`[DEBUG ${sensorApiType}] Item ${index} - Parsed itemDate from timeStamp: ${isItemDateValid ? itemDate.toISOString() : 'Invalid Date from string: ' + itemDateStr}`);
        
        if (!isItemDateValid) {
            //console.log(`[DEBUG ${sensorApiType}] Item ${index} - Date parsing failed. Skipping.`);
            return false;
        }

        const isWithinTimeRange = itemDate >= thirtyDaysAgo;
        //console.log(`[DEBUG ${sensorApiType}] Item ${index} - Is itemDate (${itemDate.toISOString()}) >= thirtyDaysAgo (${thirtyDaysAgo.toISOString()})? ${isWithinTimeRange}`);
        
        if (!isWithinTimeRange) {
            //console.log(`[DEBUG ${sensorApiType}] Item ${index} - Not within time range. Skipping.`);
            return false;
        }
        
        //console.log(`[DEBUG ${sensorApiType}] Item ${index} - Keeping item.`);
        return true; 
      });

      if (recentData.length > 0) {
        const groupedByDate = recentData.reduce((acc, item) => {
          const itemDate = new Date(item.timeStamp); // Use item.timeStamp
          const dateKey = itemDate.toLocaleDateString('en-CA'); 

          if (!acc[dateKey]) {
            acc[dateKey] = { sum: 0, count: 0, dayDate: new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()) };
          }
          acc[dateKey].sum += Number(item.value);
          acc[dateKey].count++;
          return acc;
        }, {});

        processedHistory = Object.keys(groupedByDate)
          .sort()
          .map(dateKey => {
            const group = groupedByDate[dateKey];
            return {
              date: group.dayDate.toLocaleDateString([], { day: '2-digit', month: '2-digit' }), 
              value: group.sum / group.count
            };
          });

      } else {
        console.log(`No recent data found for ${sensorApiType} to process after filtering.`);
      }
    } else {
        console.log(`No historical data or empty array returned initially for ${sensorApiType}.`);
    }

    const idealValueFromThreshold = thresholdValue !== null && thresholdValue !== undefined
      ? Number(thresholdValue)
      : sensorConfig.defaultIdeal;

    return {
      history: processedHistory,
      idealValue: idealValueFromThreshold,
      status: statusRaw !== null && statusRaw !== undefined ? (statusRaw ? 'Online' : 'Offline') : 'N/A',
      lastMeasurementValue: latestDataRaw && latestDataRaw.value !== undefined ? Number(latestDataRaw.value) : 'N/A',
      unit: sensorConfig.unit,
      name: sensorConfig.name,
      error: null,
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log(`Data fetching aborted for ${sensorApiType} in compiler.`);
      throw err; 
    }
    console.error(`Failed to compile sensor view graph data for ${sensorApiType}:`, err);
    return {
      history: [],
      idealValue: sensorConfig.defaultIdeal,
      status: 'Error',
      lastMeasurementValue: 'N/A',
      unit: sensorConfig.unit,
      name: sensorConfig.name,
      error: `Failed to load data for ${sensorConfig.name}.`,
    };
  }
}