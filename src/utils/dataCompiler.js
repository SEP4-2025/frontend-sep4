import {
  fetchGreenhouseDataByGardenerId,
  getSensorDataLastest,
  getSensorData,
  getSensorAverageByDate,
  getAllNotifications,
  getNotificationPreferences,
  toggleNotificationPreference,
  getSensorStatus,
  getSensorThresholds, // Still imported if used by other functions like compileSensorViewGraphData
  getLogs,
  getWaterPumpById,
  getWaterPumpWaterLevel,
  toggleAutomationStatus,
  triggerManualWatering,
  updateCurrentWaterLevel,
  updateWaterPumpThreshold,
  getWaterUsageHistory,
  getAllPlants,
  getAllPicturesByPlantId,
  getLatestPrediction
} from '../api';

function formatDate(date){
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function compileDashboardData(gardenerId) {
  const greenhouseData = await fetchGreenhouseDataByGardenerId(gardenerId);

  // Fetch latest sensor readings
  const lightSensorData = await getSensorDataLastest('light');
  const temperatureSensorData = await getSensorDataLastest('temperature');
  const humiditySensorData = await getSensorDataLastest('humidity');
  const soilMoistureSensorData = await getSensorDataLastest('soilMoisture'); // Just the reading

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
  const aiPredictionData = await getLatestPrediction();

  return {
    lightSensorData,
    temperatureSensorData,
    humiditySensorData,
    soilMoistureSensorData, // This is now just the latest reading object
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
    notificationPreferences,
    aiPredictionData
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

export async function compileWaterPumpData(pumpId = 1) {
  try {
    const waterPump = await getWaterPumpById(pumpId);
    const waterLevel = await getWaterPumpWaterLevel(pumpId);

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

export async function compileWaterUsageHistory(pumpId = 1) {
  try {
    const waterUsageHistory = await getWaterUsageHistory(pumpId);

    if (!waterUsageHistory || !Array.isArray(waterUsageHistory) || waterUsageHistory.length === 0) {
      throw new Error('No water usage history available');
    }

    const sortedHistory = [...waterUsageHistory].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    const labels = sortedHistory.map(item => {
      if (!item.date) return '';
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }).filter(label => label !== '');

    const consumption = sortedHistory.map(item => item.dailyWaterUsage || 0);

    let waterLevelPercentage = 0;
    const latestData = await getWaterPumpById(pumpId);
    if (latestData && latestData.waterLevel && latestData.waterTankCapacity) {
      waterLevelPercentage = Math.round((latestData.waterLevel / latestData.waterTankCapacity) * 100);
    }

    return {
      labels,
      consumption,
      waterLevelPercentage
    };
  } catch (error) {
    console.error('Error compiling water usage history:', error);
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
    const [historyDataRaw, thresholdValueFromAPI, latestDataRaw, statusRaw] = await Promise.all([
      getSensorData(sensorApiType, options),
      getSensorThresholds(sensorApiType, options), // Fetches only the threshold value
      getSensorDataLastest(sensorApiType, options),
      getSensorStatus(sensorApiType, options)
    ]);

    let processedHistory = [];
    if (Array.isArray(historyDataRaw) && historyDataRaw.length > 0) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);

      const recentData = historyDataRaw.filter((item) => {
        if (!item || typeof item.timeStamp === 'undefined' || item.timeStamp === null || item.value === null || typeof item.value === 'undefined') {
            return false;
        }
        const itemDate = new Date(item.timeStamp);
        const isItemDateValid = !isNaN(itemDate.getTime());
        if (!isItemDateValid) {
            return false;
        }
        return itemDate >= thirtyDaysAgo;
      });

      if (recentData.length > 0) {
        const groupedByDate = recentData.reduce((acc, item) => {
          const itemDate = new Date(item.timeStamp);
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
      }
    }

    const idealValueToUse = thresholdValueFromAPI !== null && thresholdValueFromAPI !== undefined
      ? Number(thresholdValueFromAPI)
      : sensorConfig.defaultIdeal;

    return {
      history: processedHistory,
      idealValue: idealValueToUse,
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
export async function compileGalleryPageData() {
  try {
    const allPlants = await getAllPlants();

    if (!allPlants || !Array.isArray(allPlants)) {
      console.warn('No plants returned or invalid format from getAllPlants.');
      return [];
    }
    const plantsWithPictures = await Promise.all(
      allPlants.map(async (plant) => {
        try {
          const pictures = await getAllPicturesByPlantId(plant.id);
          return {
            ...plant,
            pictures: Array.isArray(pictures) ? pictures : []
          };
        } catch (error) {
          console.error(`Error fetching pictures for plant ID ${plant.id}:`, error);
          return {
            ...plant,
            pictures: []
          };
        }
      })
    );

    return plantsWithPictures;

  } catch (error) {
    console.error('Error compiling gallery page data:', error);
    return [];
  }
}

export async function compilePlantManagementData() {
  try {
    const allPlants = await getAllPlants();

    if (!allPlants || !Array.isArray(allPlants)) {
      console.warn('No plants returned or invalid format from getAllPlants.');
      return [];
    }
    return allPlants;

  } catch (error) {
    console.error('Error compiling plant management data:', error);
    return [];
  }
}