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
  getLogs,
  getWaterPumpById,
  getWaterPumpWaterLevel,
  toggleAutomationStatus,
  triggerManualWatering,
  updateCurrentWaterLevel,
  updateWaterPumpThreshold,
  getWaterUsageHistory
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

export async function compileSensorLogs(requestedApiType, signal) {
  try {
    const rawLogs = await getLogs(requestedApiType, null); 


    if (!rawLogs || !Array.isArray(rawLogs)) {
      console.warn(`No logs returned or invalid format for ${requestedApiType} from getLogs.`);
      return [];
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const filteredLogsByDate = rawLogs.filter(log => {
      
      if (!log || !log.timestamp) { 
        return false;
      }
      const logDate = new Date(log.timestamp); 
      return !isNaN(logDate.getTime()) && logDate >= thirtyDaysAgo;
    });

    
    function mapSensorIdToText(sensorId) {
        if (sensorId === 1) return 'Temperature';
        if (sensorId === 2) return 'Humidity';
        if (sensorId === 3) return 'Light';
        if (sensorId === 4) return 'Soil Moisture';
        if (sensorId == null) return 'General'; 
        return 'Unknown';
    }

    return filteredLogsByDate.map(log => ({
      type: "Log Entry", 
      message: log.message,
      
      timeStamp: new Date(log.timestamp).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      sensorType: mapSensorIdToText(log.sensorReadingId), 
      
      originalLogDate: new Date(log.timestamp),
      // Ensure waterPumpId and sensorReadingId are passed through
      waterPumpId: log.waterPumpId, 
      sensorReadingId: log.sensorReadingId 
    })).sort((a, b) => b.originalLogDate - a.originalLogDate); 

  } catch (error) {
    if (error.name === 'AbortError' && signal && signal.aborted) {
      console.log(`Log fetching operation possibly affected by abort signal for ${requestedApiType}.`);
      throw error;
    }
    console.error(`Error compiling sensor logs for ${requestedApiType}:`, error);
    return []; 
  }
}

/**
 * Fetch and compile water pump data
 * @param {number} pumpId - ID of the water pump to fetch
 * @returns {Promise<Object>} - Compiled water pump data
 */
export async function compileWaterPumpData(pumpId = 1) {
  try {
    // Fetch water pump data
    const waterPump = await getWaterPumpById(pumpId);
    const waterLevel = await getWaterPumpWaterLevel(pumpId);
    
    // Return compiled data
    return {
      pumpData: waterPump,
      waterLevel: waterLevel,
      lastWatered: waterPump.lastWatered || new Date().toISOString(),
      autoWatering: waterPump.autoWatering || false,
      thresholdValue: waterPump.thresholdValue || 50,
      waterTankCapacity: waterPump.waterTankCapacity || 1000
    };
  } catch (error) {
    console.error('Error compiling water pump data:', error);
    // Return default values if API fails
    return {
      pumpData: {},
      waterLevel: 0,
      lastWatered: new Date().toISOString(),
      autoWatering: false,
      thresholdValue: 50,
      waterTankCapacity: 1000
    };
  }
}

/**
 * Fetch and compile water usage history data for the graph
 * @param {number} pumpId - ID of the water pump to fetch history for
 * @returns {Promise<Object>} - Compiled water usage history data
 */
export async function compileWaterUsageHistory(pumpId = 1) {
  try {
    // Fetch water usage history from the API
    const waterUsageHistory = await getWaterUsageHistory(pumpId);
    
    console.log('Water usage API response:', waterUsageHistory);
    
    // Process the data for the chart
    if (!waterUsageHistory || !Array.isArray(waterUsageHistory) || waterUsageHistory.length === 0) {
      throw new Error('No water usage history available');
    }
    
    // Sort by date if needed
    const sortedHistory = [...waterUsageHistory].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    // Extract dates and consumption values
    const labels = sortedHistory.map(item => {
      if (!item.date) return '';
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }).filter(label => label !== '');
    
    const consumption = sortedHistory.map(item => item.dailyWaterUsage || 0);
    
    // Calculate current water level percentage based on latest data
    let waterLevelPercentage = 0;
    const latestData = await getWaterPumpById(pumpId);
    if (latestData && latestData.waterLevel && latestData.waterTankCapacity) {
      waterLevelPercentage = Math.round((latestData.waterLevel / latestData.waterTankCapacity) * 100);
    }
    
    // For debugging
    console.log('Processed chart data:', { labels, consumption, waterLevelPercentage });
    
    return {
      labels,
      consumption,
      waterLevelPercentage
    };
  } catch (error) {
    console.error('Error compiling water usage history:', error);
    // Return default dummy data if API fails
    return {
      labels: ['5/12', '5/13', '5/14', '5/15'],
      consumption: [0, 100, 250, 500],
      waterLevelPercentage: 30
    };
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
      

      const recentData = historyDataRaw.filter((item, index) => {
        // Use item.timeStamp instead of item.date
        

        // Use item.timeStamp for checks
        if (!item || typeof item.timeStamp === 'undefined' || item.timeStamp === null || item.value === null || typeof item.value === 'undefined') {
            
            return false;
        }
        
        const itemDateStr = item.timeStamp; // Use item.timeStamp
        const itemDate = new Date(itemDateStr); 
        const isItemDateValid = !isNaN(itemDate.getTime()); 


        if (!isItemDateValid) {
            
            return false;
        }

        const isWithinTimeRange = itemDate >= thirtyDaysAgo;
        
        if (!isWithinTimeRange) {
            
            return false;
        }
        
        
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