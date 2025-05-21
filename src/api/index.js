const BASE_URL = import.meta.env.VITE_API_URL || 'https://webapi-service-68779328892.europe-north2.run.app'; // Override in .env for real prod URL

const getAuthToken = () => {
  return sessionStorage.getItem('token');
};

const createAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Confirms a user's password for secure actions
 * 
 * @param {string} password - Current user password
 * @returns {Promise<boolean>} - Returns true if password is confirmed
 */
export async function confirmPassword(password) {
  if (!password) {
    throw new Error('Password is required');
  }

  try {
    // Use the correct route to the Auth controller (no /api prefix)
    // Include both Password and ConfirmPassword fields as required by the DTO
    const response = await fetch(`${BASE_URL}/Auth/confirm-password`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify({
        Password: password,
        ConfirmPassword: password // Both fields must match per the [Compare] attribute
      })
    });

    if (!response.ok) {
      // Handle different error cases
      if (response.status === 401) {
        throw new Error('Invalid password');
      } else if (response.status === 404) {
        throw new Error('Password confirmation endpoint not found. Please check API configuration.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Password confirmation failed: ${response.status}`);
      }
    }

    return true;
  } catch (error) {
    console.error('Error confirming password:', error);
    throw error;
  }
}

/**
 * Fetches sensor data based on the specified sensor type.
 * If "all" is specified, it fetches data for all sensor types (implicitly, as the backend endpoint without a specific sensor ID does this).
 * If a specific type is given, it fetches data only for that sensor.
 * @param {string} type - The type of sensor data to fetch. Possible values: "all", "temperature", "humidity", "light", "soilMoisture".
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of sensor reading objects.
 * Each sensor reading object (SensorReadingDto) contains:
 * @property {number} id - The ID of the sensor reading.
 * @property {string} date - The ISO 8601 date-time string when the reading was taken.
 * @property {number} value - The value of the sensor reading.
 * @property {number} sensorId - The ID of the sensor (1: temperature, 2: humidity, 3: light, 4: soilMoisture).
 * @throws {Error} If the sensor type is invalid or if the API request fails.
 */
export async function getSensorData(type) {
  // Validate the type parameter
  if (!['all', 'temperature', 'humidity', 'light', 'soilMoisture'].includes(type)) {
    throw new Error(`Invalid sensor type: ${type}`);
  }

  // Transform type to lowercase
  const lowerType = type.toLowerCase();

  // Translate type into int
  let typeIdPath = '';
  if (lowerType === 'temperature') typeIdPath = 'sensor/1';
  else if (lowerType === 'humidity') typeIdPath = 'sensor/2';
  else if (lowerType === 'light') typeIdPath = 'sensor/3';
  else if (lowerType === 'soilmoisture') typeIdPath = 'sensor/4';

  // Fetch data from the API
  const res = await fetch(`${BASE_URL}/SensorReading/${typeIdPath}`, {
    headers: createAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to load sensor data for type ${type}, which is ${typeIdPath}`);
  return res.json();
}

/**
 * Fetches the latest sensor data for a specified sensor type.
 * @param {string} type - The type of sensor data to fetch. Possible values: "all", "temperature", "humidity", "light", "soilMoisture".
 * @returns {Promise<Object>} A promise that resolves to the latest sensor reading object.
 * The sensor reading object (SensorReadingDto) contains:
 * @property {number} id - The ID of the sensor reading.
 * @property {string} date - The ISO 8601 date-time string when the reading was taken.
 * @property {number} value - The value of the sensor reading.
 * @property {number} sensorId - The ID of the sensor (1: temperature, 2: humidity, 3: light, 4: soilMoisture).
 * @throws {Error} If no data is found for the specified type or if the API request fails.
 */
export async function getSensorDataLastest(type) {
  const allData = await getSensorData(type)

  // Get the latest data from the response's array (last element)
  const data = await allData;
  const latestData = data[data.length - 1];
  if (!latestData) throw new Error(`No data found for type ${type}`);

  return latestData;
}
/**
 * Fetches all sensor readings for a specific date, filters them by sensor type, and calculates the average value.
 * @param {string} type - The type of sensor data to average. Possible values: "temperature", "humidity", "light", "soilMoisture".
 *                      The function returns `null` if type is "all".
 * @param {string} date - The date for which to fetch and average data (e.g., "YYYY-MM-DD").
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the averaged sensor data, or `null` if no data is found,
 *                                 the type is "all", or an error occurs.
 * The returned object contains:
 * @property {string} date - The date for which the average was calculated.
 * @property {number} value - The calculated average sensor value, formatted to two decimal places.
 * @property {number} sensorId - The ID of the sensor type for which the average was calculated.
 */
export async function getSensorAverageByDate(type, date) {
  // Validate the type parameter
  if (!['all', 'temperature', 'humidity', 'light', 'soilMoisture'].includes(type)) {
    console.error(`Invalid sensor type: ${type}`); // Log error instead of throwing to allow graceful handling
    return null;
  }

  // Date format validation (optional, but good practice if you expect a specific format)
  // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  // if (!dateRegex.test(date)) {
  //   console.error(`Invalid date format: ${date}. Expected format: YYYY-MM-DD`);
  //   return null;
  // }

  // Transform type to lowercase
  const lowerType = type.toLowerCase(); // Use a new variable

  // Translate type into int for filtering
  let typeId = -1; // Default to an invalid ID
  if (lowerType === 'temperature') typeId = 1;
  else if (lowerType === 'humidity') typeId = 2;
  else if (lowerType === 'light') typeId = 3;
  else if (lowerType === 'soilmoisture') typeId = 4;
  else if (lowerType === 'all') {
    console.warn("getSensorAverageByDate called with type 'all'. This function is designed to average a specific sensor type. Returning null.");
    return null;
  }


  // Fetch data from the API for the given date
  // This endpoint is expected to return an array of all sensor readings for that date
  const res = await fetch(`${BASE_URL}/SensorReading/date/${date}`, {
    headers: createAuthHeaders()
  });
  if (!res.ok) {
    console.error(`Failed to load sensor data average for the date ${date} [type ${type}, which is ${typeId}]`);
    return null;
  }
  // Filter the data by typeId
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    console.warn(`No data returned from API for date ${date}`);
    return null;
  }

  // Filter the data by the specific sensorId
  const filteredData = data.filter(item => item.sensorId === typeId);
  if (filteredData.length === 0) {
    console.error(`No data found for type ${type} on date ${date}`);
    return null;
  }

  const sum = filteredData.reduce((total, item) => total + item.value, 0);
  const averageValue = sum / filteredData.length;

  /* Construct the average data object, which is a single .json element averaging the "res" data:
   *   date (date-time) - date of the sensor data
   *   value (int) - averaged value of the sensor data for the specified date
   *   sensorId (int) - id of the sensor 
   */
  const average = {
    date: date, // The date requested
    value: parseFloat(averageValue.toFixed(2)), // Keep value as a number, format to 2 decimal places
    sensorId: typeId
  };

  return average;
}

// TODO: water level and ground moisture - Mariete
/**
 * Fetches the latest prediction data.
 * @returns {Promise<Object>} A promise that resolves to the latest prediction object.
 * The prediction object (PredictionDto) contains:
 * @property {number} id - The ID of the prediction.
 * @property {string} date - The ISO 8601 date-time string of the prediction.
 * @property {number} optimalTemp - The predicted optimal temperature.
 * @property {number} optimalHumidity - The predicted optimal humidity.
 * @property {number} optimalLight - The predicted optimal light level.
 * @property {number} greenhouseId - The ID of the greenhouse for which the prediction is made.
 * @property {number} sensorReadingId - The ID of the single sensor reading used for this prediction.
 * @throws {Error} If no prediction data is found or if the API request fails.
 */
export async function getLatestPrediction() {
  const res = await fetch(`${BASE_URL}/Prediction/`, {
    headers: createAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to load lastest prediction`);
  const data = await res.json();

  // Get the latest data from the response's array (last element)
  const latestData = data[data.length - 1];
  if (!latestData) throw new Error(`No data found for prediction`);

  return latestData;
}

/**
 * Fetches greenhouse data for a specific gardener.
 * @param {number} gardenerId - The ID of the gardener.
 * @returns {Promise<Object>} A promise that resolves to the greenhouse data object.
 * The greenhouse object (GreenhouseDto) contains:
 * @property {number} id - The ID of the greenhouse.
 * @property {string} name - The name of the greenhouse.
 * @property {number} gardenerId - The ID of the gardener who owns the greenhouse.
 * @throws {Error} If the API request fails.
 */
export async function fetchGreenhouseDataByGardenerId(gardenerId) {
  const res = await fetch(`${BASE_URL}/Greenhouse/gardener/${gardenerId}`, {
    headers: createAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to load greenhouse data for gardener ${gardenerId}`);
  const data = await res.json();
  return data;
}

/**
 * Updates the name of a specific greenhouse.
 * @param {number} greenhouseId - The ID of the greenhouse to update.
 * @param {string} name - The new name for the greenhouse.
 * @returns {Promise<Object>} A promise that resolves to the updated greenhouse data object.
 * The greenhouse object (GreenhouseDto) contains:
 * @property {number} id - The ID of the greenhouse.
 * @property {string} name - The updated name of the greenhouse.
 * @property {number} gardenerId - The ID of the gardener who owns the greenhouse.
 * @throws {Error} If the API request fails.
 */
export async function updateGreenhouseName(greenhouseId, name) {
  const res = await fetch(`${BASE_URL}/Greenhouse/update/${greenhouseId}`, {
    method: 'PUT',  // method needs to be specified
    headers: createAuthHeaders(),
    body: JSON.stringify(name),
  });
  if (!res.ok) throw new Error(`Failed to update greenhouse name for ${greenhouseId}`);
  return res.json();
}

/**
 * Fetches logs, optionally filtered by sensor type and/or date.
 * @param {string} sensorType - The type of sensor to filter logs by.
 *                              Possible values: "all", "temperature", "humidity", "light", "soilMoisture".
 *                              If "all", logs are not filtered by sensor type but may still be filtered by date.
 * @param {string|null} date - The specific date (e.g., "YYYY-MM-DD") to fetch logs for. If `null`, logs for all dates (matching other criteria) are fetched.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of log objects.
 *                                   Returns an empty array if no logs match or if data is not in the expected format.
 * Each log object (LogDto) contains:
 * @property {number} id - The ID of the log entry.
 * @property {string} date - The ISO 8601 date-time string of the log entry.
 * @property {string} message - The log message.
 * @property {number|null} waterPumpId - The ID of the water pump related to this log, or `null`.
 * @property {number|null} sensorReadingId - The ID of the sensor reading related to this log (typically the sensor ID like 1 for temp), or `null`.
 * @property {number} greenhouseId - The ID of the greenhouse this log pertains to.
 * @throws {Error} If an invalid sensor type is provided or if the API request fails.
 */
export async function getLogs(sensorType, date) {
  // Validate the type parameter
  if (!['all', 'temperature', 'humidity', 'light', 'soilMoisture'].includes(sensorType)) {
    throw new Error(`Invalid sensor type: ${sensorType}`);
  }

  const lowerType = sensorType.toLowerCase();
  const dateUrl = date ? `date/${date}` : '';

  // Fetch data from the API
  const res = await fetch(`${BASE_URL}/Log/${dateUrl}`, {
    headers: createAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to load logs (url: ${BASE_URL}/Log/${dateUrl})`);

  const allLogsForPeriod = await res.json();

  if (!Array.isArray(allLogsForPeriod)) {
    console.warn(`Expected an array of logs from ${BASE_URL}/Log/${dateUrl}, but received:`, allLogsForPeriod);
    return []; // Return empty array if data is not as expected
  }

  if (lowerType === 'all') {
    return allLogsForPeriod; // Return all logs fetched for the period if 'all' is requested
  }

  // Specific sensor type requested, so filter
  let typeId = -1;
  if (lowerType === 'temperature') typeId = 1;
  else if (lowerType === 'humidity') typeId = 2;
  else if (lowerType === 'light') typeId = 3;
  else if (lowerType === 'soilmoisture') typeId = 4;

  // Filter by specific sensorId. Also include logs where sensorReadingId is null or undefined.
  const filteredData = allLogsForPeriod.filter(item => item.sensorReadingId === typeId || item.sensorReadingId == null);

  if (filteredData.length === 0) {
    // console.warn(`No logs found matching type ${lowerType} (ID: ${typeId}) or untagged logs. Total logs for period: ${allLogsForPeriod.length}`);
  }
  return filteredData; // Can be an empty array if no matches
}

/**
 * Checks the operational status of a sensor or all sensors based on recent log activity.
 * A sensor is considered "on" if its last log entry is within the last 60 minutes.
 * @param {string} type - The type of sensor to check. Possible values: "all", "temperature", "humidity", "light", "soilMoisture".
 *                      If "all", checks the status of all individual sensor types; returns `true` only if all are "on".
 * @returns {Promise<boolean>} A promise that resolves to `true` if the sensor (or all sensors, if type is "all") is considered "on", `false` otherwise.
 *                             Returns `false` if errors occur during log fetching or processing for any sensor.
 * @throws {Error} If an invalid sensor type is provided (but not for "all" if an individual check fails, which returns false).
 */
export async function getSensorStatus(type) {
  // Validate the type parameter
  const validTypes = ['all', 'temperature', 'humidity', 'light', 'soilMoisture'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid sensor type: ${type}. Must be one of ${validTypes.join(', ')}`);
  }

  const lowerType = type.toLowerCase();

  if (lowerType === 'all') {
    const individualSensorTypes = ['temperature', 'humidity', 'light', 'soilMoisture'];
    for (const singleType of individualSensorTypes) {
      let status;
      try {
        // Recursively call getSensorStatus for each specific sensor type
        status = await getSensorStatus(singleType);
      } catch (error) {
        // If an error occurs trying to get status for a specific sensor
        console.error(`Error encountered while checking status for ${singleType} as part of 'all' check: ${error.message}. Considering this sensor off.`);
        return false; // If any sensor check errors out, 'all' cannot be true.
      }

      if (!status) { // If any sensor is off (status is false, or evaluates to false like null/undefined)
        return false; // Then not all sensors are on
      }
    }
    return true; // All individual sensors reported 'on' status
  } else {
    // Logic for a specific sensor type
    // Note: getLogs function handles translation of lowerType to typeId and initial fetching/filtering.
    // It returns null if the type is 'all', but this 'else' block is only for specific types.

    let sensorLogs;
    try {
      // Call getLogs to retrieve logs for the specific sensor type, for all dates.
      // getLogs will return null if no logs are found or if an error occurs during its execution.
      sensorLogs = await getLogs(lowerType, null);
    } catch (error) {
      // Catch errors from getLogs if it throws, though it's designed to return null on fetch/parse errors.
      console.error(`Error calling getLogs for sensor status (type: '${lowerType}'): ${error.message}. Sensor considered off.`);
      return false;
    }

    // Check if getLogs returned null (no logs found, or an error occurred within getLogs)
    if (sensorLogs === null || !Array.isArray(sensorLogs) || sensorLogs.length === 0) {
      // No logs found for this sensor type, or getLogs indicated an issue.
      // getLogs would have logged a warning if no logs were found for the type.
      // If sensorLogs is not an array or is empty, it means no relevant logs.
      console.warn(`No logs returned from getLogs for type '${lowerType}' or logs were empty. Sensor considered off.`);
      return false;
    }

    // getLogs should already return logs filtered by sensor type.
    // It also sorts them by date, but we sort again here to be absolutely sure for picking the lastLog.
    // If getLogs guarantees sorted order, this sort can be removed.
    // For now, keeping it for safety.
    sensorLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

    const lastLog = sensorLogs[sensorLogs.length - 1];

    // Validate that the last log entry and its date property are present
    if (!lastLog || typeof lastLog.date === 'undefined') {
      console.warn(`Invalid last log entry or missing date for type '${lowerType}' after processing getLogs. Sensor considered off.`);
      return false;
    }

    const lastLogDate = new Date(lastLog.date);
    // Validate the parsed date
    if (isNaN(lastLogDate.getTime())) {
      console.warn(`Invalid date format in last log for type '${lowerType}': "${lastLog.date}". Sensor considered off.`);
      return false;
    }

    const currentDate = new Date();
    // Calculate the time difference in milliseconds. Math.abs handles potential minor clock skews.
    const timeDifferenceMs = Math.abs(currentDate - lastLogDate);
    const minutesDifference = Math.floor(timeDifferenceMs / (1000 * 60));

    // Sensor is on if the last log entry is not older than 60 minutes
    return minutesDifference <= 60; // Modify this value to change the threshold (minutes)
  }
}

//TODO: make a detailed comment for this function
/**
 * Fetches all notifications for the authenticated gardener.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of notification objects.
 * Each notification object (NotificationDto) contains:
 * @property {number} id - The ID of the notification.
 * @property {string} message - The content of the notification message.
 * @property {string} date - The ISO 8601 date-time string when the notification was created.
 * @property {number} gardenerId - The ID of the gardener to whom the notification belongs.
 * @property {boolean} isRead - Indicates whether the notification has been read.
 * @throws {Error} If the API request fails.
 */
export async function getAllNotifications() { // apparently no gardenerId is needed
  const res = await fetch(`${BASE_URL}/notification/all`, {
    headers: createAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to load notifications`);
  const data = await res.json();
  return data;
}

//TODO: make a detailed comment for this function
/**
 * Fetches the notification preferences for the authenticated gardener.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of notification preference objects.
 * Each notification preference object (NotificationPreferenceDto) contains:
 * @property {number} id - The ID of the notification preference.
 * @property {number} gardenerId - The ID of the gardener.
 * @property {string} type - The type of notification. Possible values: "Soil Moisture", "Light", "Temperature", "Watering", "Humidity".
 * @property {boolean} isEnabled - Indicates whether notifications of this type are enabled.
 * @throws {Error} If the API request fails.
 */
export async function getNotificationPreferences() { // apparently no gardenerId is needed
  const res = await fetch(`${BASE_URL}/notificationpref`, {
    headers: createAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to load notification preferences`);
  const data = await res.json();
  return data;
}

//TODO: make a detailed comment for this function
/**
 * Toggles a specific notification preference for a gardener.
 * @param {number} gardenerId - The ID of the gardener whose preference is to be toggled.
 * @param {string} type - The type of notification preference to toggle. Possible values: "Soil Moisture", "Light", "Temperature", "Watering", "Humidity".
 * @returns {Promise<string>} A promise that resolves to a success message string from the API.
 * @throws {Error} If the API request fails.
 */
export async function toggleNotificationPreference(gardenerId, type) {
  const res = await fetch(`${BASE_URL}/notificationpref/toggle`, {
    method: 'PATCH',
    headers: createAuthHeaders(),
    body: JSON.stringify({
      gardenerId: gardenerId,
      type: type
    })
  });

  if (!res.ok) throw new Error(`Failed to toggle notification preference for gardener ${gardenerId} and type ${type}`);
  return await res.text(); // Return the success message
}

/**
 * Fetches the current threshold value for a specific sensor type.
 * @param {string} type - The type of sensor. Possible values: "temperature", "humidity", "light", "soilMoisture".
 * @returns {Promise<number|null>} A promise that resolves to the threshold value (a number) for the sensor,
 *                                 or `null` if no threshold data is found or an error occurs.
 * @throws {Error} If an invalid sensor type is provided or if the API request fails before data parsing.
 */
export async function getSensorThresholds(type) {
  // Validate the type parameter
  if (!['temperature', 'humidity', 'light', 'soilMoisture'].includes(type)) {
    throw new Error(`Invalid sensor type: ${type}`);
  }

  // Transform type to lowercase
  const lowerType = type.toLowerCase();

  // Translate type into int for filtering
  let typeId = -1; // Default to an invalid ID
  if (lowerType === 'temperature') typeId = 1;
  else if (lowerType === 'humidity') typeId = 2;
  else if (lowerType === 'light') typeId = 3;
  else if (lowerType === 'soilmoisture') typeId = 4;

  // Fetch data from the API for the given date
  const res = await fetch(`${BASE_URL}/Sensor/${typeId}`, {
    headers: createAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to load sensor thresholds for type ${type}`);

  const data = await res.json();

  // Retrieve the threshold value from the response, which is a json object originally
  // The response is a single object, not an array
  if (!data || typeof data.thresholdValue === 'undefined') {
    console.error(`No threshold data found for type ${type}`);
    return null;
  }
  // Return the threshold value
  const threshold = data.thresholdValue;

  return threshold; // Return the threshold value, this is a number
}

/**
 * Updates the threshold value for a specific sensor type.
 * @param {string} type - The type of sensor. Possible values: "temperature", "humidity", "light", "soilMoisture".
 * @param {number} threshold - The new threshold value to set for the sensor.
 * @returns {Promise<Object>} A promise that resolves to the updated sensor data object.
 * The sensor object (SensorDto) contains:
 * @property {number} id - The ID of the sensor.
 * @property {string} type - The type of the sensor (e.g., "Temperature").
 * @property {number} thresholdValue - The updated threshold value.
 * @throws {Error} If an invalid sensor type is provided or if the API request fails.
 */
export async function updateSensorThreshold(type, threshold) {
  // Validate the type parameter
  if (!['temperature', 'humidity', 'light', 'soilMoisture'].includes(type)) {
    throw new Error(`Invalid sensor type: ${type}`);
  }

  // Transform type to lowercase
  const lowerType = type.toLowerCase();

  // Translate type into int for filtering
  let typeId = -1; // Default to an invalid ID
  if (lowerType === 'temperature') typeId = 1;
  else if (lowerType === 'humidity') typeId = 2;
  else if (lowerType === 'light') typeId = 3;
  else if (lowerType === 'soilmoisture') typeId = 4;

  // Fetch data from the API for the given date
  const res = await fetch(`${BASE_URL}/Sensor/update/${typeId}`, {
    method: 'PATCH', // Changed from PUT to PATCH
    headers: createAuthHeaders(),
    body: JSON.stringify({ thresholdValue: threshold }),
  });

  if (!res.ok) {
    let errorBody = 'Could not retrieve error body.';
    try {
      errorBody = await res.text(); // Try to get more info from the response
    } catch (e) {
      console.error("Error trying to read error response body:", e);
    }
    console.error(`Backend error details for type ${type}: ${res.status} - ${res.statusText}. Body: ${errorBody}`);
    throw new Error(`Failed to update sensor thresholds for type ${type}. Status: ${res.status}`);
  }

  return res.json(); // Return the updated sensor data object
}

/**
 * Get all water pumps associated with the authenticated gardener's greenhouse(s).
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of water pump objects.
 * Each water pump object (WaterPumpDto) contains:
 * @property {number} id - The ID of the water pump.
 * @property {number} greenhouseId - The ID of the greenhouse the water pump belongs to.
 * @property {number} currentWaterLevel - The current water level in the pump's tank, in milliliters (ml).
 * @property {number} capacity - The total capacity of the water pump's tank, in milliliters (ml).
 * @property {number} threshold - The water level threshold (in ml) for triggering actions (e.g., notifications or auto-watering).
 * @property {boolean} autoWatering - Indicates if automatic watering is enabled for this pump.
 */
export async function getAllWaterPumps() {
  try {
    const res = await fetch(`${BASE_URL}/WaterPump`, {
      headers: createAuthHeaders()
    });
    if (!res.ok) {
      throw new Error(`Failed to load water pumps. Status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching all water pumps:', error);
    throw error;
  }
}

/**
 * Get a specific water pump by its ID.
 * @param {number} id - The unique identifier of the water pump to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to a water pump object (WaterPumpDto).
 * The water pump object contains:
 * @property {number} id - The ID of the water pump.
 * @property {number} greenhouseId - The ID of the greenhouse the water pump belongs to.
 * @property {number} currentWaterLevel - The current water level in the pump's tank, in milliliters (ml).
 * @property {number} capacity - The total capacity of the water pump's tank, in milliliters (ml).
 * @property {number} threshold - The water level threshold (in ml) for triggering actions.
 * @property {boolean} autoWatering - Indicates if automatic watering is enabled for this pump.
 */
export async function getWaterPumpById(id) {
  try {
    const res = await fetch(`${BASE_URL}/WaterPump/${id}`, {
      headers: createAuthHeaders()
    });
    if (!res.ok) {
      throw new Error(`Failed to load water pump with ID ${id}. Status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching water pump with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get the current water level of a specific water pump.
 * @param {number} id - The unique identifier of the water pump.
 * @returns {Promise<number>} - A promise that resolves to a number representing the current water level in milliliters (ml).
 */
export async function getWaterPumpWaterLevel(id) {
  try {
    const res = await fetch(`${BASE_URL}/WaterPump/${id}/water-level`, {
      headers: createAuthHeaders()
    });
    if (!res.ok) {
      throw new Error(`Failed to load water level for pump with ID ${id}. Status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching water level for pump with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new water pump.
 * @param {Object} waterPumpData - Data for the new water pump.
 * @param {number} waterPumpData.greenhouseId - The ID of the greenhouse this water pump will belong to.
 * @param {number} waterPumpData.currentWaterLevel - The initial water level, in milliliters (ml).
 * @param {number} waterPumpData.capacity - The tank capacity, in milliliters (ml).
 * @param {number} waterPumpData.threshold - The water level threshold, in milliliters (ml).
 * @param {boolean} waterPumpData.autoWatering - Whether auto-watering is enabled.
 * @returns {Promise<Object>} - A promise that resolves to the created water pump object (WaterPumpDto).
 * The water pump object contains:
 * @property {number} id - The ID of the newly created water pump.
 * @property {number} greenhouseId - The ID of the greenhouse.
 * @property {number} currentWaterLevel - The current water level (ml).
 * @property {number} capacity - The tank capacity (ml).
 * @property {number} threshold - The water level threshold (ml).
 * @property {boolean} autoWatering - Auto-watering status.
 */
export async function createWaterPump(waterPumpData) {
  try {
    const res = await fetch(`${BASE_URL}/WaterPump`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(waterPumpData),
    });

    if (!res.ok) {
      throw new Error(`Failed to create water pump. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error creating water pump:', error);
    throw error;
  }
}

/**
 * Toggle the automation (auto-watering) status for a specific water pump.
 * @param {number} id - The ID of the water pump.
 * @param {boolean} autoWatering - The new automation status (true for enabled, false for disabled). The request body is this boolean.
 * @returns {Promise<Object>} - A promise that resolves to the updated water pump object (WaterPumpDto).
 * The water pump object contains:
 * @property {number} id - The ID of the water pump.
 * @property {number} greenhouseId - The ID of the greenhouse.
 * @property {number} currentWaterLevel - The current water level (ml).
 * @property {number} capacity - The tank capacity (ml).
 * @property {number} threshold - The water level threshold (ml).
 * @property {boolean} autoWatering - The updated auto-watering status.
 */
export async function toggleAutomationStatus(id, autoWatering) {
  try {
    const res = await fetch(`${BASE_URL}/WaterPump/${id}/toggle-automation`, {
      method: 'PATCH',
      headers: createAuthHeaders(),
      body: JSON.stringify(autoWatering),
    });

    if (!res.ok) {
      throw new Error(`Failed to toggle automation status for pump with ID ${id}. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error toggling automation status for pump with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Trigger manual watering for a specific water pump.
 * @param {number} id - The ID of the water pump to trigger manual watering for.
 * @returns {Promise<Object>} - A promise that resolves to the updated water pump object (WaterPumpDto) after the manual watering action.
 * The water pump object contains:
 * @property {number} id - The ID of the water pump.
 * @property {number} greenhouseId - The ID of the greenhouse.
 * @property {number} currentWaterLevel - The updated current water level (ml).
 * @property {number} capacity - The tank capacity (ml).
 * @property {number} threshold - The water level threshold (ml).
 * @property {boolean} autoWatering - The auto-watering status.
 */
export async function triggerManualWatering(id) {
  try {
    const res = await fetch(`${BASE_URL}/WaterPump/${id}/manual-watering`, {
      method: 'PATCH',
      headers: createAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to trigger manual watering for pump with ID ${id}. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error triggering manual watering for pump with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Update the current water level for a water pump, typically after adding water.
 * @param {number} id - The ID of the water pump.
 * @param {number} addedWaterAmount - The amount of water added to the tank, in milliliters (ml). This value is sent as the request body.
 * @returns {Promise<Object>} - A promise that resolves to the updated water pump object (WaterPumpDto).
 * The water pump object contains:
 * @property {number} id - The ID of the water pump.
 * @property {number} greenhouseId - The ID of the greenhouse.
 * @property {number} currentWaterLevel - The new current water level (ml).
 * @property {number} capacity - The tank capacity (ml).
 * @property {number} threshold - The water level threshold (ml).
 * @property {boolean} autoWatering - The auto-watering status.
 */
export async function updateCurrentWaterLevel(id, addedWaterAmount) {
  try {
    const res = await fetch(`${BASE_URL}/WaterPump/${id}/add-water`, {
      method: 'PATCH',
      headers: createAuthHeaders(),
      body: JSON.stringify(addedWaterAmount),
    });

    if (!res.ok) {
      throw new Error(`Failed to update water level for pump with ID ${id}. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error updating water level for pump with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Update the threshold value for a specific water pump.
 * @param {number} id - The ID of the water pump.
 * @param {number} newThresholdValue - The new threshold value for the water pump, in milliliters (ml). This value is sent as the request body.
 * @returns {Promise<Object>} - A promise that resolves to the updated water pump object (WaterPumpDto).
 * The water pump object contains:
 * @property {number} id - The ID of the water pump.
 * @property {number} greenhouseId - The ID of the greenhouse.
 * @property {number} currentWaterLevel - The current water level (ml).
 * @property {number} capacity - The tank capacity (ml).
 * @property {number} threshold - The updated threshold value (ml).
 * @property {boolean} autoWatering - The auto-watering status.
 */
export async function updateWaterPumpThreshold(id, newThresholdValue) {
  try {
    const res = await fetch(`${BASE_URL}/WaterPump/${id}/threshold`, {
      method: 'PATCH',
      headers: createAuthHeaders(),
      body: JSON.stringify(newThresholdValue),
    });

    if (!res.ok) {
      throw new Error(`Failed to update threshold for pump with ID ${id}. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error updating threshold for pump with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Update water tank capacity for a specific water pump.
 * @param {number} id - The ID of the water pump.
 * @param {number} newCapacityValue - The new capacity value for the water pump's tank, in milliliters (ml). This value is sent as the request body.
 * @returns {Promise<Object>} - A promise that resolves to the updated water pump object (WaterPumpDto).
 * The water pump object contains:
 * @property {number} id - The ID of the water pump.
 * @property {number} greenhouseId - The ID of the greenhouse.
 * @property {number} currentWaterLevel - The current water level (ml).
 * @property {number} capacity - The updated tank capacity (ml).
 * @property {number} threshold - The water level threshold (ml).
 * @property {boolean} autoWatering - The auto-watering status.
 */
export async function updateWaterTankCapacity(id, newCapacityValue) {
  try {
    const res = await fetch(`${BASE_URL}/WaterPump/${id}/capacity`, {
      method: 'PATCH',
      headers: createAuthHeaders(),
      body: JSON.stringify(newCapacityValue),
    });

    if (!res.ok) {
      throw new Error(`Failed to update water tank capacity for pump with ID ${id}. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error updating water tank capacity for pump with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a water pump by its ID.
 * @param {number} id - The ID of the water pump to delete.
 * @returns {Promise<void>} - A promise that resolves when the deletion is successful (API returns 204 No Content).
 */
export async function deleteWaterPump(id) {
  try {
    const res = await fetch(`${BASE_URL}/WaterPump/${id}`, {
      method: 'DELETE',
      headers: createAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to delete water pump with ID ${id}. Status: ${res.status}`);
    }

    return;
  } catch (error) {
    console.error(`Error deleting water pump with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get water usage history for a specific water pump.
 * Retrieves logs detailing daily water usage and water levels for the pump.
 * @param {number} id - The ID of the water pump.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of water usage log objects (WaterUsageLogDto).
 * Each object contains:
 * @property {string} date - The ISO 8601 date-time string for the log entry.
 * @property {number} dailyWaterUsage - The amount of water used on that day, in milliliters (ml).
 * @property {number} waterLevel - The water level at the time of the log, in milliliters (ml).
 */
export async function getWaterUsageHistory(id) {
  try {
    const res = await fetch(`${BASE_URL}/Log/${id}/water-usage`, {
      headers: createAuthHeaders()
    });

    if (!res.ok) {
      throw new Error(`Failed to load water usage history for pump with ID ${id}. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error fetching water usage history for pump with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetches all plants associated with the authenticated gardener's greenhouse(s).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of plant objects (PlantDto).
 * Each plant object includes:
 * @property {number} id - The unique identifier for the plant.
 * @property {string} name - The name of the plant.
 * @property {string} species - The species of the plant.
 * @property {Array<Object>} pictures - An array of picture objects (PictureDto) associated with the plant.
 *   Each picture object contains:
 *   @property {number} id - Picture ID.
 *   @property {string} url - Picture URL.
 *   @property {string} note - Picture note.
 *   @property {string} timeStamp - ISO 8601 date-time string of picture upload.
 *   @property {number} plantId - ID of the plant this picture belongs to.
 * @property {number} greenhouseId - The ID of the greenhouse where the plant is located.
 */
export async function getAllPlants() {
  try {
    const res = await fetch(`${BASE_URL}/Plant`, {
      headers: createAuthHeaders()
    });
    if (!res.ok) {
      throw new Error(`Failed to get all plants. Status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching all plants:`, error);
    throw error;
  }
}

/**
 * Fetches all pictures associated with a specific plant ID.
 * @param {number} plantId - The unique identifier of the plant for which to retrieve pictures.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of picture objects (PictureDto).
 * Each picture object includes:
 * @property {number} id - The unique identifier for the picture.
 * @property {string} url - The URL where the picture is stored.
 * @property {string} [note] - An optional note or description for the picture.
 * @property {string} timeStamp - The ISO 8601 date-time string when the picture was uploaded/recorded.
 * @property {number} plantId - The ID of the plant this picture belongs to.
 */
export async function getAllPicturesByPlantId(plantId) {
  try {
    const res = await fetch(`${BASE_URL}/Picture/${plantId}`, {
      headers: createAuthHeaders()
    });
    if (!res.ok) {
      throw new Error(`Failed to get all pictures for plant id: ${plantId}. Status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching all pictures for plant id: ${plantId}:`, error);
    throw error;
  }
}

/**
 * Upload a picture for a specific plant.
 * The picture can be provided as a File object or as a URL string (though backend expects a file upload).
 * @param {number} plantId - The ID of the plant to associate the picture with.
 * @param {File|string} pictureFile - The picture file (File object). If a string is passed, it's assumed to be handled by FormData correctly, but `File` is typical.
 * @param {string} [note] - An optional note or description to save with the picture.
 * @returns {Promise<Object>} A promise that resolves to an object representing the uploaded picture data (PictureDto).
 * The returned object includes:
 * @property {number} id - The unique identifier for the uploaded picture.
 * @property {string} url - The URL of the stored picture.
 * @property {string} [note] - The note associated with the picture, if provided.
 * @property {string} timeStamp - The ISO 8601 date-time string of when the picture was uploaded.
 * @property {number} plantId - The ID of the plant.
 */
export async function uploadPicture(plantId, pictureFile, note) {
  try {
    const formData = new FormData();
    formData.append('PlantId', plantId);


    if (pictureFile instanceof File) {
      formData.append('File', pictureFile);
    }

    else if (typeof pictureFile === 'string') {
      formData.append('File', pictureFile);
    }


    if (note) {
      formData.append('Note', note);
    }

    const res = await fetch(`${BASE_URL}/Picture/UploadPicture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      credentials: 'include',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Failed to upload picture. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error uploading picture:', error);
    throw error;
  }
}

/**
 * Deletes a picture by its unique identifier.
 * @param {number} pictureId - The ID of the picture to delete.
 * @returns {Promise<Object>} A promise that resolves to an object indicating success, e.g., { success: true } (client-side convention, API returns 204 No Content).
 * @throws {Error} If the deletion fails (e.g., picture not found, server error).
 */
export async function deletePicture(pictureId) {
  try {
    const res = await fetch(`${BASE_URL}/Picture/${pictureId}`, {
      method: 'DELETE',
      headers: createAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to delete picture with ID ${pictureId}. Status: ${res.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`Error deleting picture with ID ${pictureId}:`, error);
    throw error;
  }
}

/**
 * Edits the note associated with an existing picture.
 * @param {number} pictureId - The ID of the picture whose note is to be edited.
 * @param {string} note - The new note text for the picture.
 * @returns {Promise<Object>} A promise that resolves to the updated picture data object (PictureDto).
 * The returned object includes:
 * @property {number} id - The ID of the picture.
 * @property {string} url - The URL of the picture.
 * @property {string} note - The updated note.
 * @property {string} timeStamp - The ISO 8601 date-time string of the original upload; this timestamp does not update when the note is edited.
 * @property {number} plantId - The ID of the plant this picture belongs to.
 */
export async function editPictureNote(pictureId, note) {
  try {
    const res = await fetch(`${BASE_URL}/Picture?id=${pictureId}&note=${encodeURIComponent(note)}`, { // id and note should be passed as querry parameter in url. Dont ask me why
      method: 'PUT',
      credentials: 'include',
      headers: createAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to edit picture note for ID ${pictureId}. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error editing picture note for ID ${pictureId}:`, error);
    throw error;
  }
}



// Plant management functions
/**
 * Adds a new plant to a greenhouse.
 * @param {string} name - The name of the new plant.
 * @param {string} species - The species of the new plant.
 * @param {number} greenhouseId - The ID of the greenhouse where the plant will be added.
 * @returns {Promise<Object>} A promise that resolves to the newly created plant object (PlantDto).
 * The plant object includes:
 * @property {number} id - The unique identifier for the new plant.
 * @property {string} name - The name of the plant.
 * @property {string} species - The species of the plant.
 * @property {Array<Object>} pictures - An array of picture objects (PictureDto), initially empty.
 * @property {number} greenhouseId - The ID of the greenhouse.
 */
export async function addPlant(name, species, greenhouseId) {
  try {
    const res = await fetch(`${BASE_URL}/Plant`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify({
        name: name,
        species: species,
        greenhouseId: greenhouseId
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to add plant. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error adding plant:', error);
    throw error;
  }
}

/**
 * Edits the name and species of an existing plant.
 * This function makes two separate API calls: one to update the name and one for the species.
 * @param {number} plantId - The ID of the plant to edit.
 * @param {string} name - The new name for the plant.
 * @param {string} species - The new species for the plant.
 * @returns {Promise<Object>} A promise that resolves to the updated plant object (PlantDto) from the species update call.
 * The plant object includes:
 * @property {number} id - The ID of the plant.
 * @property {string} name - The updated name.
 * @property {string} species - The updated species.
 * @property {Array<Object>} pictures - The existing pictures associated with the plant.
 * @property {number} greenhouseId - The ID of the greenhouse.
 */
export async function editPlant(plantId, name, species) {
  try {
    // Update plant name first
    const nameRes = await fetch(`${BASE_URL}/Plant/${plantId}/name?plantName=${encodeURIComponent(name)}`, {
      method: 'PUT',
      headers: createAuthHeaders(),
    });

    if (!nameRes.ok) {
      throw new Error(`Failed to update plant name for ID ${plantId}. Status: ${nameRes.status}`);
    }

    // Update plant species
    const speciesRes = await fetch(`${BASE_URL}/Plant/${plantId}/species?species=${encodeURIComponent(species)}`,{
      method: 'PUT',
      headers: createAuthHeaders(),
    });

    if (!speciesRes.ok) {
      throw new Error(`Failed to update plant species for ID ${plantId}. Status: ${speciesRes.status}`);
    }

    return speciesRes.json(); 
  } catch (error) {
    console.error(`Error updating plant with ID ${plantId}:`, error);
    throw error;
  }

}
/**
 * Deletes a plant by its unique identifier.
 * @param {number} plantId - The ID of the plant to delete.
 * @returns {Promise<Object>} A promise that resolves to an object indicating success, e.g., { success: true } (client-side convention, API returns 204 No Content).
 * @throws {Error} If the deletion fails (e.g., plant not found, server error).
 */
export async function deletePlant(plantId) {
  try {
    const res = await fetch(`${BASE_URL}/Plant/${plantId}`, {
      method: 'DELETE',
      headers: createAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to delete plant with ID ${plantId}. Status: ${res.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`Error deleting plant with ID ${plantId}:`, error);
    throw error;
  }
}

