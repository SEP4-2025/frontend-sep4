import {
  fetchGreenhouseDataByGardenerId,
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

export async function compileWaterPumpData(pumpId = 1) {
  try {
    const waterPump = await getWaterPumpById(pumpId);

    // Ensure waterPump and its properties exist, using new property names
    const currentWaterLevel = waterPump?.waterLevel ?? 0; // Changed from currentWaterLevel
    const capacity = waterPump?.waterTankCapacity ?? 1000; // Changed from capacity
    const autoWateringStatus = waterPump?.autoWateringEnabled ?? false; // Changed from autoWatering
    const threshold = waterPump?.thresholdValue ?? 50; // Changed from threshold
    const lastWateredTime = waterPump?.lastWateredTime || new Date().toISOString();


    return {
      pumpData: waterPump || {},
      waterLevel: currentWaterLevel,
      lastWatered: lastWateredTime,
      autoWatering: autoWateringStatus,
      thresholdValue: threshold,
      waterTankCapacity: capacity
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


export async function compileDashboardData(gardenerId) {
  const greenhouseData = await fetchGreenhouseDataByGardenerId(gardenerId);

  // Fetch latest sensor readings
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

  // Fetch and process water pump data for the sensor card
  const waterPumpInfo = await compileWaterPumpData(); // Uses default pumpId 1
  let waterLevelCardDisplayData = null;
  // waterPumpInfo directly provides waterLevel and waterTankCapacity correctly from the updated compileWaterPumpData
  if (waterPumpInfo && typeof waterPumpInfo.waterLevel === 'number' && typeof waterPumpInfo.waterTankCapacity === 'number' && waterPumpInfo.waterTankCapacity > 0) {
    waterLevelCardDisplayData = {
        value: (waterPumpInfo.waterLevel / waterPumpInfo.waterTankCapacity) * 100, // Percentage
        currentWaterLevel: waterPumpInfo.waterLevel, // Changed from currentLevelMl
        capacity: waterPumpInfo.waterTankCapacity // Changed from capacityMl
    };
  }


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
    notificationPreferences,
    aiPredictionData,
    waterLevelCardData: waterLevelCardDisplayData
  };
}

export async function getNotificationPreferencesData() {
  try {
    return await getNotificationPreferences();
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
}

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
    // 1. Fetch activity logs
    const rawActivityLogs = await getLogs(requestedApiType === 'all' ? 'all' : requestedApiType, null, signal ? { signal } : undefined);
    let processedActivityLogs = [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    if (rawActivityLogs && Array.isArray(rawActivityLogs)) {
      processedActivityLogs = rawActivityLogs
        .filter(log => {
          // API for getLogs returns 'timestamp'
          if (!log || !log.timestamp) {
            return false;
          }
          const logDate = new Date(log.timestamp);
          const isValidDate = !isNaN(logDate.getTime());
          if (!isValidDate) {
            return false;
          }
          const isWithinRange = logDate >= thirtyDaysAgo;
          return isWithinRange;
        })
        .map(log => ({
          id: `activity-${log.id}`,
          type: "Log Entry",
          message: log.message,
          timeStamp: log.timestamp, // Use log.timestamp from API
          sensorType: mapSensorIdToText(log.sensorReadingId),
          originalLogDate: new Date(log.timestamp), // Use log.timestamp for sorting
          waterPumpId: log.waterPumpId,
          sensorReadingId: log.sensorReadingId,
        }));
    }

    function mapSensorIdToText(sensorId) {
        if (sensorId === 1) return 'Temperature';
        if (sensorId === 2) return 'Humidity';
        if (sensorId === 3) return 'Light';
        if (sensorId === 4) return 'Soil Moisture';
        if (sensorId == null) return 'General';
        return 'Unknown';
    }

    // 2. Fetch sensor readings and transform them into log objects
    let sensorReadingLogs = [];
    const sensorTypesToFetch = ['temperature', 'humidity', 'light', 'soilMoisture'];
    const sensorTypeMappings = {
        temperature: { name: 'Temperature', unit: '°C', apiType: 'temperature' },
        humidity: { name: 'Humidity', unit: '%', apiType: 'humidity' },
        light: { name: 'Light', unit: 'lux', apiType: 'light' },
        soilMoisture: { name: 'Soil Moisture', unit: '%', apiType: 'soilMoisture' }
    };

    const fetchPromises = [];
    for (const typeKey of sensorTypesToFetch) {
        const apiType = sensorTypeMappings[typeKey]?.apiType;
        if (!apiType) {
            continue;
        }

        if (requestedApiType === 'all' || requestedApiType === apiType) {
            fetchPromises.push(
                getSensorData(apiType, signal ? { signal } : undefined)
                    .then(data => {
                        return { typeKey, data: Array.isArray(data) ? data : [] };
                    })
                    .catch(err => {
                        if (err.name === 'AbortError') throw err;
                        console.error(`[compileSensorLogs] Failed to fetch sensor data for ${apiType}:`, err); // Kept console.error as per typical best practice, can be removed if strictly no console output is desired.
                        return { typeKey, data: [] };
                    })
            );
        }
    }

    const sensorDataResults = await Promise.all(fetchPromises);

    for (const result of sensorDataResults) {
        const mapping = sensorTypeMappings[result.typeKey];
        if (!mapping) {
            continue;
        }
        if (result.data && Array.isArray(result.data)) {
            const readingsAsLogs = result.data
                .filter(reading => {
                    // API for getSensorData also returns 'timeStamp'
                    if (!reading || !reading.timeStamp || reading.value === undefined || reading.value === null) {
                        return false;
                    }
                    const readingDate = new Date(reading.timeStamp);
                    const isValidDate = !isNaN(readingDate.getTime());
                    if (!isValidDate) {
                        return false;
                    }
                    const isWithinRange = readingDate >= thirtyDaysAgo;
                    return isWithinRange;
                })
                .map(reading => ({
                    id: `sensor-${reading.sensorId}-${reading.id}`,
                    type: "Sensor Reading",
                    message: undefined, // Sensor readings don't have a direct "recommended action" message
                    timeStamp: reading.timeStamp, // Use reading.timeStamp from API
                    sensorType: mapping.name,
                    value: reading.value,
                    unit: mapping.unit,
                    originalLogDate: new Date(reading.timeStamp), // Use reading.timeStamp for sorting
                    deviation: null,
                }));
            sensorReadingLogs.push(...readingsAsLogs);
        }
    }

    // 3. Combine and sort all logs
    const combinedLogs = [...processedActivityLogs, ...sensorReadingLogs];

    combinedLogs.sort((a, b) => {
        const dateA = a.originalLogDate;
        const dateB = b.originalLogDate;
        if (!dateA || !dateB || isNaN(dateA.getTime()) || isNaN(dateB.getTime())) { // Added check for valid Date objects
            // Decide how to handle: sort invalid dates to beginning or end, or treat as equal
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1; // Sort logs with no dateA to the end
            if (!dateB) return -1; // Sort logs with no dateB to the end
            if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
            if (isNaN(dateA.getTime())) return 1;
            if (isNaN(dateB.getTime())) return -1;
        }
        return dateB - dateA;
    });

    return combinedLogs;

  } catch (error) {
    if (error.name === 'AbortError' && signal && signal.aborted) {
      // Re-throwing AbortError is often important for upstream handling.
      throw error;
    }
    console.error(`[compileSensorLogs] Error compiling sensor logs for ${requestedApiType}:`, error); // Kept console.error
    return [];
  }
}


export async function compileWaterUsageHistory(pumpId = 1) {
  try {
    const waterUsageHistory = await getWaterUsageHistory(pumpId);

    if (!waterUsageHistory || !Array.isArray(waterUsageHistory) || waterUsageHistory.length === 0) {
      console.warn('No water usage history available or invalid format.');
      return {
        labels: [],
        consumption: [],
        waterLevelPercentage: 0 
      };
    }

    const sortedHistory = [...waterUsageHistory].sort((a, b) => {
      return new Date(a.date) - new Date(b.date); 
    });

    const labels = sortedHistory.map(item => {
      if (!item.date) return ''; 
      const date = new Date(item.date);
      if (isNaN(date.getTime())) return ''; 
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }).filter(label => label !== ''); 

    const consumption = sortedHistory.map(item => item.dailyWaterUsage || 0);

    let waterLevelPercentage = 0;
    const latestPumpData = await getWaterPumpById(pumpId); 
    // Use new property names from getWaterPumpById
    if (latestPumpData && typeof latestPumpData.waterLevel === 'number' && typeof latestPumpData.waterTankCapacity === 'number' && latestPumpData.waterTankCapacity > 0) {
      waterLevelPercentage = Math.round((latestPumpData.waterLevel / latestPumpData.waterTankCapacity) * 100); // Changed currentWaterLevel to waterLevel, capacity to waterTankCapacity
    }


    return {
      labels,
      consumption,
      waterLevelPercentage
    };
  } catch (error) {
    console.error('Error compiling water usage history:', error);
    return {
      labels: ['Error'], 
      consumption: [0],
      waterLevelPercentage: 0
    };
  }
}

export async function compileSensorViewGraphData(sensorApiType, sensorConfig, signal) {
  const options = signal ? { signal } : {};

  try {
    const [historyDataRaw, thresholdValueFromAPI, latestDataRaw, statusRaw] = await Promise.all([
      getSensorData(sensorApiType, options), 
      getSensorThresholds(sensorApiType), 
      getSensorDataLastest(sensorApiType), 
      getSensorStatus(sensorApiType) 
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
          .sort((a,b) => new Date(a) - new Date(b)) 
          .map(dateKey => {
            const group = groupedByDate[dateKey];
            return {
              date: group.dayDate.toLocaleDateString([], { day: '2-digit', month: '2-digit' }), 
              value: parseFloat((group.sum / group.count).toFixed(sensorConfig.precision !== undefined ? sensorConfig.precision : 2)) 
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