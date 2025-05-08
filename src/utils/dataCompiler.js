import {
  fetchGrenhouseDataByGardenerId,
  getSensorDataLastest,
  getSensorData,
  getSensorAverageByDate
} from '../api';

export async function compileDashboardData(gardenerId) {
  // Geting the data from the database
  const greenhouseData = await fetchGrenhouseDataByGardenerId(gardenerId)
  const sensorData = await getSensorData('all');

  // Filtering the data to get the light sensor data
  const lightSensorData = await getSensorDataLastest('light')
  const temperatureSensorData = await getSensorDataLastest('temperature')
  const humiditySensorData = await getSensorDataLastest('humidity')
  const soilMoistureSensorData = await getSensorDataLastest('soilMoisture')
  

  return {
    lightSensorData,
    temperatureSensorData,
    humiditySensorData,
    soilMoistureSensorData,
    greenhouseData
  };
}
