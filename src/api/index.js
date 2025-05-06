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

