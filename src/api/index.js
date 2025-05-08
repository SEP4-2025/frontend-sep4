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
  type = type.toLowerCase();

  // Translate type into int
  let typeId = '';
  if (type === 'temperature') typeId = 'sensor/1';
  else if (type === 'humidity') typeId = 'sensor/2';
  else if (type === 'light') typeId = 'sensor/3';
  else if (type === 'soilmoisture') typeId = 'sensor/4';

  // Fetch data from the API
  const res = await fetch(`${BASE_URL}/SensorReading/${typeId}`);
  if (!res.ok) throw new Error(`Failed to load sensor data for type ${type}, which is ${typeId}`);
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
 *   Sensor data object from the specified date where the value is averaged || the object contains the following properties:
 *     id (int) - id of the sensor data
 *     date (date-time) - date of the sensor data
 *     value (int) - averaged value of the sensor data for the specified date
 *     sensorId (int) - id of the sensor
 *       1 - temperature
 *       2 - humidity
 *       3 - light
 *       4 - soilMoisture
 */

export async function getSensorAverageByDate(type, date) {
  // Validate the type parameter
  if (!['all', 'temperature', 'humidity', 'light', 'soilMoisture'].includes(type)) {
    throw new Error(`Invalid sensor type: ${type}`);
  }

  // Validate if the date is in the correct format and in date-time format
  // YYYY-MM-DD format
  // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  // if (!dateRegex.test(date)) {
  //   throw new Error(`Invalid date format: ${date}. Expected format: YYYY-MM-DD`);
  // }

  // Transform type to lowercase
  type = type.toLowerCase();

  // Translate type into int
  let typeId = '';
  if (type === 'temperature') typeId = 1;
  else if (type === 'humidity') typeId = 2;
  else if (type === 'light') typeId = 3;
  else if (type === 'soilmoisture') typeId = 4;

  // Fetch data from the API
  const res = await fetch(`${BASE_URL}/SensorReading/date/${date}`);
  if (!res.ok) {
    console.error(`Failed to load sensor data average for the date ${date} [type ${type}, which is ${typeId}]`);
    return null; 
  }
  // Filter the data by typeId
  const data = await res.json();
  const filteredData = data.filter(item => item.sensorId === typeId);
  if (filteredData.length === 0) {
    console.error(`No data found for type ${type} on date ${date}`);
    return null; 
  }

  /* Construct the average data object, which is a single .json element averaging the "res" data:
   *   date (date-time) - date of the sensor data
   *   value (int) - averaged value of the sensor data for the specified date
   *   sensorId (int) - id of the sensor 
   */
  const average = {
    date: date,
    value: filteredData.reduce((acc, item) => acc + item.value, 0) / filteredData.length,
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

