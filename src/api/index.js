const BASE_URL = import.meta.env.VITE_API_URL || 'https://webapi-service-68779328892.europe-north2.run.app'; // Override in .env for real prod URL

/*
 * 
 *   NEW API ENDPOINTS - Mariete
 * 
 */

/*
 *   GetSensorData(type)
 *   INPUT: 
 *     type (string) - type of sensor data to fetch || possible values: "all", "temperature", "humidity", "light", "soilMoisture"
 *   RETURNS:
 *   Array of sensor data objects || each object contains the following properties:
 *     id (int) - id of the sensor data
 *     date (date-time) - date of the sensor data
 *     value (int) - value of the sensor data
 *     sensorId (int) - id of the sensor
 *       1 - temperature
 *       2 - humidity
 *       3 - light
 *       4 - soilMoisture
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
  const res = await fetch(`${BASE_URL}/SensorReading/${typeIdPath}`);
  if (!res.ok) throw new Error(`Failed to load sensor data for type ${type}, which is ${typeIdPath}`);
  return res.json();
}

/*
 *   GetSensorDataLastest(type)
 *   INPUT:
 *   type (string) - type of sensor data to fetch || possible values: "all", "temperature", "humidity", "light", "soilMoisture"
 *   RETURNS:
 *   Lastest sensor data object || the object contains the following properties:
 *     id (int) - id of the sensor data
 *     date (date-time) - date of the sensor data
 *     value (int) - value of the sensor data
 *     sensorId (int) - id of the sensor
 *       1 - temperature
 *       2 - humidity
 *       3 - light
 *       4 - soilMoisture
 */

export async function getSensorDataLastest(type) {
  const allData = await getSensorData(type)

  // Get the latest data from the response's array (last element)
  const data = await allData;
  const latestData = data[data.length - 1];
  if (!latestData) throw new Error(`No data found for type ${type}`);

  return latestData;
}

/* 
 *   getSensorAverageByDate(type, date)
 *   INPUT:
 *     type (string) - type of sensor data to fetch || possible values: "all", "temperature", "humidity", "light", "soilMoisture"
 *     date (date-time) - date to fetch the data for
 *   RETURNS:
 *    Note: If type is "all", the function will return null as it is not designed to handle that case.
 *    Sensor data object from the specified date where the value is averaged || the object contains the following properties:
 *      id (int) - id of the sensor data
 *      date (date-time) - date of the sensor data
 *      value (int) - averaged value of the sensor data for the specified date
 *      sensorId (int) - id of the sensor
 *        1 - temperature
 *        2 - humidity
 *        3 - light
 *        4 - soilMoisture
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
  const res = await fetch(`${BASE_URL}/SensorReading/date/${date}`);
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

/* TODO: water level and ground moisture - Mariete
 *   getLastestPrediction()
 *   INPUT:
 *     none
 *   RETURNS:
 *   Lastest prediction object || the object contains the following properties:
 *     id (int) - id of the prediction
 *     date (date-time) - date of the prediction
 *     optimaltemp (int) - optimal temperature for the greenhouse
 *     optimalhumidity (int) - optimal humidity for the greenhouse
 *     optimallight (int) - optimal light for the greenhouse
 *     greenhouseId (int) - id of the greenhouse
 *     sensorReadingId (int) - id of the sensor reading
 *     optimalWaterLevel (int) - TODO: What is this? - Mariete
 */

export async function getLastestPrediction() {
  const res = await fetch(`${BASE_URL}/Prediction/`);
  if (!res.ok) throw new Error(`Failed to load lastest prediction`);
  const data = await res.json();
  console.log("Lastest prediction data:", data); 

  // Get the latest data from the response's array (last element)
  const latestData = data[data.length - 1];
  if (!latestData) throw new Error(`No data found for prediction`);

  return latestData;
}

/*
 *   fetchGrenhouseDataByGardenerId(gardenerId)
 *   INPUT:
 *     gardenerId (int) - id of the gardener
 *   RETURNS:
 *     Greenhose data object whith the id provided || the object contains the following properties:
 *       id (int) - id of the greenhouse
 *       name (string) - name of the greenhouse
 *       gardenerId (int) - id of the gardener
 */

export async function fetchGrenhouseDataByGardenerId(gardenerId) {
  const res = await fetch(`${BASE_URL}/Greenhouse/gardener/${gardenerId}`);
  if (!res.ok) throw new Error(`Failed to load greenhouse data for gardener ${gardenerId}`);
  const data = await res.json();
  console.log("Greenhouse data:", data); 
  return data;
}

/*
 *   updateGreenhouseData(greenhouseId, data)
 *   INPUT:
 *     greenhouseId (int) - id of the greenhouse
 *     name (string) - new name for the greenhouse
 *   RETURNS:
 *     Updates the database with the new name for the greenhouse
 *     Returns the updated greenhouse data object || the object contains the following properties:
 *       id (int) - id of the greenhouse
 *       name (string) - name of the greenhouse
 *       gardenerId (int) - id of the gardener
 */

export async function updateGreenhouseName(greenhouseId, name) {
  const res = await fetch(`${BASE_URL}/Greenhouse/update/${greenhouseId}`, {
    method: 'PUT',  // method needs to be specified
    headers: { // content type needs to be specified
      'Content-Type': 'application/json'  
    },
    body: JSON.stringify(name),
  });
  if (!res.ok) throw new Error(`Failed to update greenhouse name for ${greenhouseId}`);
  return res.json();
}

/*
 *   getLogs(sensorType, date)
 *   INPUT:
 *     type (string) - type of sensor data to fetch || possible values: "all", "temperature", "humidity", "light", "soilMoisture"
 *     date (date-time?) - date to fetch the data for || imput null for all dates
 *   RETURNS:
 *     Array of log data objects filtered by type and date || each object contains the following properties:
 *       date (date-time) - date of the log
 *       message (string) - message of the log
 *       waterpumpid (int) - id of the water pump
 *       sensorreadingid (int) - id of the sensor reading
 *       greenhouseid (int) - id of the greenhouse
 */

export async function getLogs(sensorType, date) {
  // Validate the type parameter
  if (!['all', 'temperature', 'humidity', 'light', 'soilMoisture'].includes(sensorType)) {
    throw new Error(`Invalid sensor type: ${sensorType}`);
  }

  const lowerType = sensorType.toLowerCase();
  const dateUrl = date ? `date/${date}` : '';

  // Fetch data from the API
  const res = await fetch(`${BASE_URL}/Log/${dateUrl}`);
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

/*
 *   getSensorStatus(type)
 *   INPUT:
 *     type (string) - type of sensor to check || possible values: "all", "temperature", "humidity", "light", "soilMoisture"
 *   RETURNS:
 *     boolean - true if the sensor is on, false if the sensor is off
 *       If the type is set to "all", the function will return true if all sensors are on, false otherwise.
 *       The status is based on the last log entry for each sensor: If the last log entry is older than 15 minutes, the sensor is considered off.
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

export async function getAllNotifications() { // apparently no gardenerId is needed
  const res = await fetch(`${BASE_URL}/notification/all`);
  if (!res.ok) throw new Error(`Failed to load notifications`);
  const data = await res.json();
  console.log("Notifications data:", data); 
  return data;
}

//TODO: make a detailed comment for this function

export async function getNotificationPreferences(){ // apparently no gardenerId is needed
  const res = await fetch(`${BASE_URL}/notificationpref`);
  if (!res.ok) throw new Error(`Failed to load notification preferences`);
  const data = await res.json();
  console.log("Notification preferences data:", data); 
  return data;
}

//TODO: make a detailed comment for this function

export async function toggleNotificationPreference(gardenerId, type) {
  const res = await fetch(`${BASE_URL}/notificationpref/toggle`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gardenerId: gardenerId,
      type: type
    })
  });
  
  if (!res.ok) throw new Error(`Failed to toggle notification preference for gardener ${gardenerId} and type ${type}`);
  return await res.text(); // Return the success message
}

/*
 *   getSensorThresholds(type)
 *   INPUT:
 *     type (string) - type of sensor to check || possible values: "temperature", "humidity", "light", "soilMoisture"
 *   RETURNS:
 *     threshold (int) - threshold value for the sensor
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
  const res = await fetch(`${BASE_URL}/Sensor/${typeId}`);
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
  console.log(`Threshold for ${type} is ${threshold}`);
  
  return threshold; // Return the threshold value, this is a number
  }

/*
  *   updateSensorThreshold(type, threshold)
  *   INPUT:
  *     type (string) - type of sensor to check || possible values: "temperature", "humidity", "light", "soilMoisture"
  *     threshold (int) - new threshold value for the sensor
  *   RETURNS:
  *     Updates the database with the new threshold value for the sensor
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
    headers: {
      'Content-Type': 'application/json',
    },
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