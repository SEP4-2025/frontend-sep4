import {
  fetchSensorsData,
  fetchGrenhouseDataByGardenerId

} from '../api';

export async function compileDashboardData(gardenerId) {
  // Geting the data from the database
  const greenhouseData = await fetchGrenhouseDataByGardenerId(gardenerId)
  const sensorData = await fetchSensorsData();

  // Filtering the data to get the light sensor data
  let lightSensorData = sensorData.filter(item => item.sensorId == 1); 
  lightSensorData  = lightSensorData [0];
  

  return {
    lightSensorData,
    greenhouseData
  };
}
