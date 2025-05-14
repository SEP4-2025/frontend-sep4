import {
  fetchGrenhouseDataByGardenerId,
  getSensorDataLastest

} from '../api';

export async function compileDashboardData(gardenerId) {
  // Geting the data from the database
  const greenhouseData = await fetchGrenhouseDataByGardenerId(gardenerId)

  // Filtering the data to get the light sensor data
  let lightSensorData = await getSensorDataLastest('light')
  

  return {
    lightSensorData,
    greenhouseData
  };
}
