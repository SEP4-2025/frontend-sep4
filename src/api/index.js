const BASE_URL = import.meta.env.VITE_API_URL || 'https://webapi-service-68779328892.europe-north2.run.app';

/**
 * Retrieves the authentication token from sessionStorage.
 * @returns {string|null} The authentication token if it exists, otherwise null.
 */
const getAuthToken = () => sessionStorage.getItem('token');


/**
 * Creates the Authorization header if a token exists.
 * @returns {Object} An object containing the Authorization header if a token exists, otherwise an empty object.
 */
const createAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Handles unauthorized responses by clearing the token and dispatching an event.
 */
const handleUnauthorized = () => {
  sessionStorage.removeItem('token');
  window.dispatchEvent(new CustomEvent('auth-expired'));
};

/**
 * Wrapper for fetch calls to handle authentication and 401 errors.
 * It automatically adds the Authorization header and a default 'Content-Type: application/json'
 * unless options.body is FormData or Content-Type is already specified in options.headers.
 * @param {string} url - The URL to fetch.
 * @param {Object} [options={}] - The options for the fetch request.
 * @returns {Promise<Response>} The fetch response.
 * @throws {Error} If the response status is 401 ('Unauthorized') or another network/fetch error occurs.
 */
async function fetchWithAuthHandling(url, options = {}) {
  const authHeaders = createAuthHeaders();

  let defaultContentType = {};
  if (!(options.body instanceof FormData) && !(options.headers && options.headers['Content-Type'])) {
    defaultContentType = { 'Content-Type': 'application/json' };
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...defaultContentType,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized'); // This error will be caught by the calling function's try-catch
  }
  return response;
}

/**
 * Confirms a user's password for secure actions
 * @param {string} password - Current user password
 * @returns {Promise<boolean>} - Returns true if password is confirmed
 * @throws {Error} If the password is required but not provided, if the password confirmation fails (e.g. invalid password, API error), or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function confirmPassword(password) {
  if (!password) {
    throw new Error('Password is required');
  }

  const token = getAuthToken();
  if (!token) {
    // If there's no token, this action requires authentication.
    // Trigger the standard unauthorized handling which should lead to logout.
    handleUnauthorized();
    throw new Error('Authentication required to confirm password.');
  }

  const apiHeaders = createAuthHeaders();
  apiHeaders['Content-Type'] = 'application/json';

  try {
    const response = await fetch(`${BASE_URL}/Auth/confirm-password`, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify({
        Password: password,
        ConfirmPassword: password // Assuming this is the expected body structure
      })
    });

    if (response.status === 401) {
      // Special handling for 401 from /Auth/confirm-password:
      // Assume it means incorrect password to prevent immediate logout.
      // If the token was genuinely invalid, other API calls would trigger logout.
      let errorData = { message: 'Incorrect password. Please try again.' };
      try {
        const jsonData = await response.json();
        if (jsonData && jsonData.message) {
          errorData.message = jsonData.message;
        }
      } catch (e) {
        // Ignore if response is not JSON or JSON parsing fails
      }
      throw new Error(errorData.message);
    }

    if (!response.ok) {
      // Handle other non-successful statuses (e.g., 400, 403, 500)
      let errorData = { message: `Password confirmation failed with status: ${response.status}` };
      try {
        const jsonData = await response.json();
        if (jsonData && jsonData.message) {
          errorData.message = jsonData.message;
        }
      } catch (e) {
        // Ignore
      }
      throw new Error(errorData.message);
    }

    return true; // Password confirmed successfully
  } catch (error) {
    // Log unexpected errors, but not the ones we crafted for UI display
    if (!(error.message.includes('Incorrect password') ||
          error.message.includes('Password confirmation failed') ||
          error.message.includes('Authentication required'))) {
      console.error('Network or unexpected error during password confirmation:', error);
    }
    throw error; // Re-throw for the UI (e.g., PasswordConfirmPopup) to handle
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
 * @throws {Error} If the sensor type is invalid, if the API request fails (e.g. network error, non-2xx response other than 401), or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getSensorData(type) {
  if (!['all', 'temperature', 'humidity', 'light', 'soilMoisture'].includes(type)) {
    throw new Error(`Invalid sensor type: ${type}`);
  }

  const lowerType = type.toLowerCase();
  let typeIdPath = '';
  if (lowerType === 'temperature') typeIdPath = 'sensor/1';
  else if (lowerType === 'humidity') typeIdPath = 'sensor/2';
  else if (lowerType === 'light') typeIdPath = 'sensor/3';
  else if (lowerType === 'soilmoisture') typeIdPath = 'sensor/4';

  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/SensorReading/${typeIdPath}`);
    if (!res.ok) throw new Error(`Failed to load sensor data for type ${type}, path ${typeIdPath}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error(`Error in getSensorData for type ${type}:`, error);
    }
    throw error;
  }
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
 * @throws {Error} If no data is found for the specified type, if the API request fails, or if an 'Unauthorized' error is propagated from getSensorData.
 */
export async function getSensorDataLastest(type) {
  try {
    const allData = await getSensorData(type); // This will use fetchWithAuthHandling
    const latestData = allData[allData.length - 1];
    if (!latestData) throw new Error(`No data found for type ${type}`);
    return latestData;
  } catch (error) {
    // Error logging is handled in getSensorData or fetchWithAuthHandling for 'Unauthorized'
    // Only log here if it's a new error specific to this function's logic
    if (error.message === `No data found for type ${type}`) {
        console.warn(error.message);
    } else if (error.message !== 'Unauthorized' && !error.message.startsWith('Failed to load sensor data')) {
        // Avoid re-logging errors from getSensorData if they are already specific
        console.error(`Error in getSensorDataLastest for type ${type}:`, error);
    }
    throw error;
  }
}

/**
 * Fetches all sensor readings for a specific date, filters them by sensor type, and calculates the average value.
 * @param {string} type - The type of sensor data to average. Possible values: "temperature", "humidity", "light", "soilMoisture".
 *                      The function returns `null` if type is "all".
 * @param {string} date - The date for which to fetch and average data (e.g., "YYYY-MM-DD").
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the averaged sensor data, or `null` if no data is found,
 *                                 the type is "all", or an error occurs (including 'Unauthorized').
 * The returned object contains:
 * @property {string} date - The date for which the average was calculated.
 * @property {number} value - The calculated average sensor value, formatted to two decimal places.
 * @property {number} sensorId - The ID of the sensor type for which the average was calculated.
 */
export async function getSensorAverageByDate(type, date) {
  if (!['temperature', 'humidity', 'light', 'soilMoisture'].includes(type)) { // 'all' is handled below
    console.error(`Invalid sensor type for average: ${type}`);
    return null;
  }

  const lowerType = type.toLowerCase();
  if (lowerType === 'all') {
    console.warn("getSensorAverageByDate called with type 'all'. This function is designed to average a specific sensor type. Returning null.");
    return null;
  }

  let typeId = -1;
  if (lowerType === 'temperature') typeId = 1;
  else if (lowerType === 'humidity') typeId = 2;
  else if (lowerType === 'light') typeId = 3;
  else if (lowerType === 'soilmoisture') typeId = 4;

  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/SensorReading/date/${date}`);
    if (!res.ok) {
      console.error(`Failed to load sensor data average for date ${date} [type ${type}, ID ${typeId}]. Status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`No data returned from API for date ${date} to calculate average.`);
      return null;
    }

    const filteredData = data.filter(item => item.sensorId === typeId);
    if (filteredData.length === 0) {
      console.warn(`No data found for type ${type} (ID: ${typeId}) on date ${date} to calculate average.`);
      return null;
    }

    const sum = filteredData.reduce((total, item) => total + item.value, 0);
    const averageValue = sum / filteredData.length;

    return {
      date: date,
      value: parseFloat(averageValue.toFixed(2)),
      sensorId: typeId
    };
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error(`Error in getSensorAverageByDate for type ${type}, date ${date}:`, error);
    }
    // Propagate 'Unauthorized' or other errors, but the function signature implies returning null for errors.
    // For consistency with original behavior on error (other than 401), return null.
    // If 'Unauthorized', the error will propagate and logout will occur.
    // If we want to suppress other errors and return null:
    // if (error.message === 'Unauthorized') throw error; else return null;
    // For now, let's allow errors to propagate if they are not handled by !res.ok
    if (error.message === 'Unauthorized') throw error;
    return null; // Return null for other fetch/processing errors as per original logic
  }
}

/**
 * Fetches the latest prediction data by re-evaluating with the latest sensor readings.
 * @returns {Promise<Object>} A promise that resolves to the latest prediction object.
 * The prediction object contains:
 * @property {number} prediction - The prediction class or value.
 * @property {Array<number>} prediction_proba - An array of prediction probabilities.
 * @property {Object} input_received - The input data used for the prediction.
 * @property {number} input_received.temperature - Temperature reading.
 * @property {number} input_received.light - Light reading.
 * @property {number} input_received.airHumidity - Air humidity reading.
 * @property {number} input_received.soilHumidity - Soil humidity reading.
 * @property {string} input_received.date - ISO 8601 date-time string of the sensor readings.
 * @property {number} input_received.greenhouseId - The ID of the greenhouse.
 * @property {number} input_received.sensorReadingId - The ID of the sensor reading used.
 * @throws {Error} If no prediction data is found, if the API request fails, or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getLatestPrediction() {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Prediction/repredict/latest`, { method: 'POST' });
    if (!res.ok) {
      const errorText = await res.text().catch(() => `Status: ${res.status}`);
      throw new Error(`Failed to load latest prediction. ${errorText}`);
    }
    const data = await res.json();
    if (!data) {
      throw new Error(`No data found for prediction`);
    }
    return data;
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error('Error in getLatestPrediction:', error);
    }
    throw error;
  }
}

/**
 * Fetches greenhouse data for a specific gardener.
 * @param {number} gardenerId - The ID of the gardener.
 * @returns {Promise<Object>} A promise that resolves to the greenhouse data object.
 * The greenhouse object (GreenhouseDto) contains:
 * @property {number} id - The ID of the greenhouse.
 * @property {string} name - The name of the greenhouse.
 * @property {number} gardenerId - The ID of the gardener who owns the greenhouse.
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function fetchGreenhouseDataByGardenerId(gardenerId) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Greenhouse/gardener/${gardenerId}`);
    if (!res.ok) throw new Error(`Failed to load greenhouse data for gardener ${gardenerId}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error(`Error in fetchGreenhouseDataByGardenerId for gardener ${gardenerId}:`, error);
    }
    throw error;
  }
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function updateGreenhouseName(greenhouseId, name) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Greenhouse/update/${greenhouseId}`, {
      method: 'PUT',
      body: JSON.stringify(name),
    });
    if (!res.ok) throw new Error(`Failed to update greenhouse name for ${greenhouseId}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error(`Error in updateGreenhouseName for ID ${greenhouseId}:`, error);
    }
    throw error;
  }
}

/**
 * Fetches logs, optionally filtered by sensor type and/or date.
 * @param {string} sensorType - The type of sensor to filter logs by.
 *                              Possible values: "all", "temperature", "humidity", "light", "soilMoisture".
 *                              If "all", logs are not filtered by sensor type but may still be filtered by date.
 * @param {string|null} date - The specific date (e.g., "YYYY-MM-DD") to fetch logs for. If `null`, logs for all dates (matching other criteria) are fetched.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of log objects.
 *                                   Returns an empty array if no logs match or if data is not in the expected format (unless an 'Unauthorized' or other fetch error occurs).
 * Each log object (LogDto) contains:
 * @property {number} id - The ID of the log entry.
 * @property {string} date - The ISO 8601 date-time string of the log entry.
 * @property {string} message - The log message.
 * @property {number|null} waterPumpId - The ID of the water pump related to this log, or `null`.
 * @property {number|null} sensorReadingId - The ID of the sensor reading related to this log (typically the sensor ID like 1 for temp), or `null`.
 * @property {number} greenhouseId - The ID of the greenhouse this log pertains to.
 * @throws {Error} If an invalid sensor type is provided, if the API request fails, or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getLogs(sensorType, date) {
  if (!['all', 'temperature', 'humidity', 'light', 'soilMoisture'].includes(sensorType)) {
    throw new Error(`Invalid sensor type: ${sensorType}`);
  }

  const lowerType = sensorType.toLowerCase();
  const dateUrl = date ? `date/${date}` : '';

  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Log/${dateUrl}`);
    if (!res.ok) throw new Error(`Failed to load logs (url: ${BASE_URL}/Log/${dateUrl}). Status: ${res.status}`);

    const allLogsForPeriod = await res.json();
    if (!Array.isArray(allLogsForPeriod)) {
      console.warn(`Expected an array of logs from ${BASE_URL}/Log/${dateUrl}, but received:`, allLogsForPeriod);
      return [];
    }

    if (lowerType === 'all') {
      return allLogsForPeriod;
    }

    let typeId = -1;
    if (lowerType === 'temperature') typeId = 1;
    else if (lowerType === 'humidity') typeId = 2;
    else if (lowerType === 'light') typeId = 3;
    else if (lowerType === 'soilmoisture') typeId = 4;

    const filteredData = allLogsForPeriod.filter(item => item.sensorReadingId === typeId || item.sensorReadingId == null);
    // if (filteredData.length === 0) {
    //   console.warn(`No logs found matching type ${lowerType} (ID: ${typeId}) or untagged logs. Total logs for period: ${allLogsForPeriod.length}`);
    // }
    return filteredData;
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error(`Error in getLogs for sensorType ${sensorType}, date ${date}:`, error);
    }
    throw error;
  }
}

/**
 * Checks the operational status of a sensor or all sensors based on recent log activity.
 * A sensor is considered "on" if its last log entry is within the last 60 minutes.
 * @param {string} type - The type of sensor to check. Possible values: "all", "temperature", "humidity", "light", "soilMoisture".
 *                      If "all", checks the status of all individual sensor types; returns `true` only if all are "on".
 * @returns {Promise<boolean>} A promise that resolves to `true` if the sensor (or all sensors, if type is "all") is considered "on", `false` otherwise.
 *                             Returns `false` if errors occur during log fetching or processing for any sensor (unless it's an 'Unauthorized' error, which will propagate).
 * @throws {Error} If an invalid sensor type is provided (but not for "all" if an individual check fails, which returns false, unless the error is 'Unauthorized').
 */
export async function getSensorStatus(type) {
  const validTypes = ['all', 'temperature', 'humidity', 'light', 'soilMoisture'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid sensor type: ${type}. Must be one of ${validTypes.join(', ')}`);
  }

  const lowerType = type.toLowerCase();

  try {
    if (lowerType === 'all') {
      const individualSensorTypes = ['temperature', 'humidity', 'light', 'soilMoisture'];
      for (const singleType of individualSensorTypes) {
        const status = await getSensorStatus(singleType); // Recursive call
        if (!status) return false;
      }
      return true;
    } else {
      const sensorLogs = await getLogs(lowerType, null); // Uses fetchWithAuthHandling

      if (sensorLogs === null || !Array.isArray(sensorLogs) || sensorLogs.length === 0) {
        console.warn(`No logs returned from getLogs for type '${lowerType}' or logs were empty. Sensor considered off.`);
        return false;
      }

      sensorLogs.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending to get latest first
      const lastLog = sensorLogs[0];

      if (!lastLog || typeof lastLog.date === 'undefined') {
        console.warn(`Invalid last log entry or missing date for type '${lowerType}'. Sensor considered off.`);
        return false;
      }

      const lastLogDate = new Date(lastLog.date);
      if (isNaN(lastLogDate.getTime())) {
        console.warn(`Invalid date format in last log for type '${lowerType}': "${lastLog.date}". Sensor considered off.`);
        return false;
      }

      const timeDifferenceMs = Math.abs(new Date() - lastLogDate);
      return Math.floor(timeDifferenceMs / (1000 * 60)) <= 60;
    }
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error(`Error in getSensorStatus for type ${type}:`, error);
      // For 'all' type, if an individual check throws 'Unauthorized', it will propagate here.
      // Otherwise, for other errors, we might want to return false as per original logic.
      if (lowerType === 'all' && error.message !== 'Unauthorized') return false; // If part of 'all' check fails with non-auth error
    }
    throw error; // Propagate 'Unauthorized' or other critical errors
  }
}

/**
 * Fetches all notifications for the authenticated gardener.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of notification objects.
 * Each notification object (NotificationDto) contains:
 * @property {number} id - The ID of the notification.
 * @property {string} message - The content of the notification message.
 * @property {string} date - The ISO 8601 date-time string when the notification was created.
 * @property {number} gardenerId - The ID of the gardener to whom the notification belongs.
 * @property {boolean} isRead - Indicates whether the notification has been read.
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getAllNotifications() {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/notification/all`);
    if (!res.ok) throw new Error(`Failed to load notifications. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error('Error in getAllNotifications:', error);
    }
    throw error;
  }
}

/**
 * Fetches the notification preferences for the authenticated gardener.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of notification preference objects.
 * Each notification preference object (NotificationPreferenceDto) contains:
 * @property {number} id - The ID of the notification preference.
 * @property {number} gardenerId - The ID of the gardener.
 * @property {string} type - The type of notification. Possible values: "Soil Moisture", "Light", "Temperature", "Watering", "Humidity".
 * @property {boolean} isEnabled - Indicates whether notifications of this type are enabled.
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getNotificationPreferences() {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/notificationpref`);
    if (!res.ok) throw new Error(`Failed to load notification preferences. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error('Error in getNotificationPreferences:', error);
    }
    throw error;
  }
}

/**
 * Toggles a specific notification preference for a gardener.
 * @param {number} gardenerId - The ID of the gardener whose preference is to be toggled.
 * @param {string} type - The type of notification preference to toggle. Possible values: "Soil Moisture", "Light", "Temperature", "Watering", "Humidity".
 * @returns {Promise<string>} A promise that resolves to a success message string from the API.
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function toggleNotificationPreference(gardenerId, type) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/notificationpref/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ gardenerId: gardenerId, type: type }),
    });
    if (!res.ok) throw new Error(`Failed to toggle notification preference for gardener ${gardenerId}, type ${type}. Status: ${res.status}`);
    return res.text();
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error(`Error in toggleNotificationPreference for gardener ${gardenerId}, type ${type}:`, error);
    }
    throw error;
  }
}

/**
 * Fetches the current threshold value for a specific sensor type.
 * @param {string} type - The type of sensor. Possible values: "temperature", "humidity", "light", "soilMoisture".
 * @returns {Promise<number|null>} A promise that resolves to the threshold value (a number) for the sensor,
 *                                 or `null` if no threshold data is found or an error occurs (other than 'Unauthorized').
 * @throws {Error} If an invalid sensor type is provided, if the API request fails before data parsing, or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getSensorThresholds(type) {
  if (!['temperature', 'humidity', 'light', 'soilMoisture'].includes(type)) {
    throw new Error(`Invalid sensor type: ${type}`);
  }
  const lowerType = type.toLowerCase();
  let typeId = -1;
  if (lowerType === 'temperature') typeId = 1;
  else if (lowerType === 'humidity') typeId = 2;
  else if (lowerType === 'light') typeId = 3;
  else if (lowerType === 'soilmoisture') typeId = 4;

  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Sensor/${typeId}`);
    if (!res.ok) {
        console.error(`Failed to load sensor thresholds for type ${type} (ID: ${typeId}). Status: ${res.status}`);
        return null; // As per original logic for non-401 errors
    }
    const data = await res.json();
    if (!data || typeof data.thresholdValue === 'undefined') {
      console.warn(`No threshold data found for type ${type} (ID: ${typeId})`);
      return null;
    }
    return data.thresholdValue;
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error(`Error in getSensorThresholds for type ${type}:`, error);
    }
    if (error.message === 'Unauthorized') throw error;
    return null; // Return null for other fetch/processing errors
  }
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
 * @throws {Error} If an invalid sensor type is provided, if the API request fails, or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function updateSensorThreshold(type, threshold) {
  if (!['temperature', 'humidity', 'light', 'soilMoisture'].includes(type)) {
    throw new Error(`Invalid sensor type: ${type}`);
  }
  const lowerType = type.toLowerCase();
  let typeId = -1;
  if (lowerType === 'temperature') typeId = 1;
  else if (lowerType === 'humidity') typeId = 2;
  else if (lowerType === 'light') typeId = 3;
  else if (lowerType === 'soilmoisture') typeId = 4;

  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Sensor/update/${typeId}`, {
      method: 'PATCH',
      body: JSON.stringify({ thresholdValue: threshold }),
    });
    if (!res.ok) {
      const errorBody = await res.text().catch(() => `Status: ${res.status}`);
      throw new Error(`Failed to update sensor thresholds for type ${type}. ${errorBody}`);
    }
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error(`Error in updateSensorThreshold for type ${type}:`, error);
    }
    throw error;
  }
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getAllWaterPumps() {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/WaterPump`);
    if (!res.ok) throw new Error(`Failed to load water pumps. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error('Error fetching all water pumps:', error);
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
 * @property {number} waterLevel - The current water level in the pump's tank, in milliliters (ml).
 * @property {number} waterTankCapacity - The total capacity of the water pump's tank, in milliliters (ml).
 * @property {number} thresholdValue - The water level threshold (in ml) for triggering actions.
 * @property {boolean} autoWateringEnabled - Indicates if automatic watering is enabled for this pump.
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getWaterPumpById(id) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/WaterPump/${id}`);
    if (!res.ok) throw new Error(`Failed to load water pump with ID ${id}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error fetching water pump with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get the current water level of a specific water pump.
 * @param {number} id - The unique identifier of the water pump.
 * @returns {Promise<number>} - A promise that resolves to a number representing the current water level in milliliters (ml).
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getWaterPumpWaterLevel(id) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/WaterPump/${id}/water-level`);
    if (!res.ok) throw new Error(`Failed to load water level for pump with ID ${id}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error fetching water level for pump with ID ${id}:`, error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function createWaterPump(waterPumpData) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/WaterPump`, {
      method: 'POST',
      body: JSON.stringify(waterPumpData),
    });
    if (!res.ok) throw new Error(`Failed to create water pump. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error('Error creating water pump:', error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function toggleAutomationStatus(id, autoWatering) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/WaterPump/${id}/toggle-automation`, {
      method: 'PATCH',
      body: JSON.stringify(autoWatering),
    });
    if (!res.ok) throw new Error(`Failed to toggle automation status for pump with ID ${id}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error toggling automation status for pump with ID ${id}:`, error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function triggerManualWatering(id) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/WaterPump/${id}/manual-watering`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error(`Failed to trigger manual watering for pump with ID ${id}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error triggering manual watering for pump with ID ${id}:`, error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function updateCurrentWaterLevel(id, addedWaterAmount) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/WaterPump/${id}/add-water`, {
      method: 'PATCH',
      body: JSON.stringify(addedWaterAmount),
    });
    if (!res.ok) throw new Error(`Failed to update water level for pump with ID ${id}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error updating water level for pump with ID ${id}:`, error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function updateWaterPumpThreshold(id, newThresholdValue) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/WaterPump/${id}/threshold`, {
      method: 'PATCH',
      body: JSON.stringify(newThresholdValue),
    });
    if (!res.ok) throw new Error(`Failed to update threshold for pump with ID ${id}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error updating threshold for pump with ID ${id}:`, error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function updateWaterTankCapacity(id, newCapacityValue) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/WaterPump/${id}/capacity`, {
      method: 'PATCH',
      body: JSON.stringify(newCapacityValue),
    });
    if (!res.ok) throw new Error(`Failed to update water tank capacity for pump with ID ${id}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error updating water tank capacity for pump with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a water pump by its ID.
 * @param {number} id - The ID of the water pump to delete.
 * @returns {Promise<void>} - A promise that resolves when the deletion is successful (API returns 204 No Content).
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function deleteWaterPump(id) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/WaterPump/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete water pump with ID ${id}. Status: ${res.status}`);
    // For DELETE 204 No Content, there's no JSON body to return
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error deleting water pump with ID ${id}:`, error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getWaterUsageHistory(id) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Log/${id}/water-usage`);
    if (!res.ok) throw new Error(`Failed to load water usage history for pump with ID ${id}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error fetching water usage history for pump with ID ${id}:`, error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getAllPlants() {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Plant`);
    if (!res.ok) throw new Error(`Failed to get all plants. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error fetching all plants:`, error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function getAllPicturesByPlantId(plantId) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Picture/${plantId}`);
    if (!res.ok) throw new Error(`Failed to get all pictures for plant id: ${plantId}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error fetching all pictures for plant id: ${plantId}:`, error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function uploadPicture(plantId, pictureFile, note) {
  try {
    const formData = new FormData();
    formData.append('PlantId', String(plantId)); // Ensure PlantId is a string for FormData
    if (pictureFile instanceof File) {
      formData.append('File', pictureFile);
    } else if (typeof pictureFile === 'string') {
      // This case might be problematic if the backend strictly expects a file upload.
      // Assuming backend can handle a string as 'File' if it's a URL or base64, etc.
      formData.append('File', pictureFile);
    } else {
        throw new Error("pictureFile must be a File object or a string URL.");
    }
    if (note) {
      formData.append('Note', note);
    }

    // For FormData, Content-Type is set automatically by the browser, so don't set it in headers.
    // fetchWithAuthHandling is designed to skip 'Content-Type: application/json' for FormData.
    const res = await fetchWithAuthHandling(`${BASE_URL}/Picture/UploadPicture`, {
      method: 'POST',
      body: formData,
      // `credentials: 'include'` was in original, but typically not needed with token-based auth.
      // If your backend specifically requires cookies even with Bearer tokens, you can add it.
      // For now, relying on Authorization header.
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => `Status: ${res.status}`);
      throw new Error(`Failed to upload picture. ${errorText}`);
    }
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error('Error uploading picture:', error);
    throw error;
  }
}

/**
 * Deletes a picture by its unique identifier.
 * @param {number} pictureId - The ID of the picture to delete.
 * @returns {Promise<Object>} A promise that resolves to an object indicating success, e.g., { success: true } (client-side convention, API returns 204 No Content).
 * @throws {Error} If the deletion fails (e.g., picture not found, server error), or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function deletePicture(pictureId) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Picture/${pictureId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete picture with ID ${pictureId}. Status: ${res.status}`);
    return { success: true }; // API returns 204, so no JSON body
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error deleting picture with ID ${pictureId}:`, error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function editPictureNote(pictureId, note) {
  try {
    // The endpoint seems to expect id and note as query parameters for a PUT request.
    const res = await fetchWithAuthHandling(`${BASE_URL}/Picture?id=${pictureId}&note=${encodeURIComponent(note)}`, {
      method: 'PUT',
      // `credentials: 'include'` was in original. See comment in uploadPicture.
    });
    if (!res.ok) throw new Error(`Failed to edit picture note for ID ${pictureId}. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error editing picture note for ID ${pictureId}:`, error);
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
 * @throws {Error} If the API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function addPlant(name, species, greenhouseId) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Plant`, {
      method: 'POST',
      body: JSON.stringify({ name: name, species: species, greenhouseId: greenhouseId }),
    });
    if (!res.ok) throw new Error(`Failed to add plant. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error('Error adding plant:', error);
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
 * @throws {Error} If any API request fails or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function editPlant(plantId, name, species) {
  try {
    const nameRes = await fetchWithAuthHandling(`${BASE_URL}/Plant/${plantId}/name?plantName=${encodeURIComponent(name)}`, {
      method: 'PUT',
    });
    if (!nameRes.ok) throw new Error(`Failed to update plant name for ID ${plantId}. Status: ${nameRes.status}`);

    const speciesRes = await fetchWithAuthHandling(`${BASE_URL}/Plant/${plantId}/species?species=${encodeURIComponent(species)}`, {
      method: 'PUT',
    });
    if (!speciesRes.ok) throw new Error(`Failed to update plant species for ID ${plantId}. Status: ${speciesRes.status}`);
    return speciesRes.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error updating plant with ID ${plantId}:`, error);
    throw error;
  }
}

/**
 * Deletes a plant by its unique identifier.
 * @param {number} plantId - The ID of the plant to delete.
 * @returns {Promise<Object>} A promise that resolves to an object indicating success, e.g., { success: true } (client-side convention, API returns 204 No Content).
 * @throws {Error} If the deletion fails (e.g., plant not found, server error), or if an 'Unauthorized' error is thrown by fetchWithAuthHandling.
 */
export async function deletePlant(plantId) {
  try {
    const res = await fetchWithAuthHandling(`${BASE_URL}/Plant/${plantId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete plant with ID ${plantId}. Status: ${res.status}`);
    return { success: true }; // API returns 204
  } catch (error) {
    if (error.message !== 'Unauthorized') console.error(`Error deleting plant with ID ${plantId}:`, error);
    throw error;
  }
}

/**
 * Parses the JWT from sessionStorage and extracts the Gardener ID.
 * @returns {string|null} The Gardener ID if found and successfully parsed, otherwise null.
 */
export const getGardenerIdFromToken = () => {
  const token = getAuthToken();
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        console.error("Invalid token: Missing payload.");
        return null;
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      const decodedToken = JSON.parse(jsonPayload);
      const gardenerId = decodedToken.nameid; // Standard claim for NameIdentifier in .NET JWTs

      if (!gardenerId) {
        console.warn("Gardener ID (nameid claim) not found in token or is empty. Token payload:", decodedToken);
        return null;
      }
      return String(gardenerId);
    } catch (error) {
      console.error("Failed to decode token or extract gardenerId:", error);
      return null;
    }
  }
  // console.warn("No token found in sessionStorage for getGardenerIdFromToken."); // Can be noisy
  return null;
};