const BASE_URL = import.meta.env.VITE_API_URL || 'https://webapi-service-68779328892.europe-north2.run.app'; // Override in .env for real prod URL


// Greenhouse Data - used by name-card
export async function fetchGrenhouseDataByGardenerId(gardenerId) {
  const res = await fetch(`${BASE_URL}/Greenhouse/gardener/${gardenerId}`);
  if (!res.ok) throw new Error(`Failed to load greenhouse data for gardener ${gardenerId}`);
  const data = await res.json();
  console.log("Greenhouse data:", data); 
  return data;
}
// Update Greenhouse Data - used by name-card
export async function updateGreenhouseData(greenhouseId, data) {
  const res = await fetch(`${BASE_URL}/Greenhouse/update/${greenhouseId}`, {
    method: 'PUT',  // method needs to be specified
    headers: { // content type needs to be specified
      'Content-Type': 'application/json'  
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update greenhouse data for ${greenhouseId}`);
  return res.json();
}

// Sensor Data - used by sensor-card
export async function fetchSensorsData(){
  const res = await fetch(`${BASE_URL}/SensorReading`);
  if (!res.ok) throw new Error(`Failed to load sensors data`);
  return res.json();
}

/*
* 
*   NEW API ENDPOINTS - Mariete
* 
*/

/*
*   GetSensorData(type)
*   INPUT: 
*   type (string) - type of sensor data to fetch || possible values: "all", "temperature", "humidity", "light", "soilMoisture"
*   RETURNS:
*   Array of sensor data objects || each object contains the following properties:
*     id (int) - id of the sensor data
*     date (string) - date of the sensor data
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
*     date (string) - date of the sensor data
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

