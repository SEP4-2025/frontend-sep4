const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'; // Override in .env for real prod URL

/**
 * Sensors
 * [{ timestamp, value }]
 */
export async function fetchCurrentMeasurement(sensorType) {
  const res = await fetch(`${BASE_URL}/sensors/${sensorType}_current`);
  if (!res.ok) throw new Error(`Failed to load current ${sensorType}`);
  return res.json();
}

export async function fetchSensorHistory(sensorType, untilDate) {
  // untilDate in YYYY-MM-DD or ISO format
  const res = await fetch(`${BASE_URL}/sensors/${sensorType}/history?until=${encodeURIComponent(untilDate)}`);
  if (!res.ok) throw new Error(`Failed to load history for ${sensorType}`);
  return res.json();
}

/**
 * Notifications
 * { icon, title, description, timestamp, importance }
 */
export async function fetchNotifications(limit = 10) {
  const res = await fetch(`${BASE_URL}/notifications?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to load notifications');
  return res.json();
}

export async function fetchNotificationById(id) {
  const res = await fetch(`${BASE_URL}/notifications/${id}`);
  if (!res.ok) throw new Error(`Notification ${id} not found`);
  return res.json();
}

/**
 * AI Model Predictions
 * { min: number, max: number, current: number, ideal: number }
 */
export async function fetchAIPrediction(sensorType) {
  const res = await fetch(`${BASE_URL}/predictions/${sensorType}`);
  if (!res.ok) throw new Error(`Failed to load AI prediction for ${sensorType}`);
  return res.json(); 
}
