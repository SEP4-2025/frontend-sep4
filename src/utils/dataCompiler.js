import {
  fetchCurrentMeasurement,
  fetchSensorHistory,
  fetchNotifications,
  _fetchNotificationById,
  fetchAIPrediction
} from '../api';

const SENSOR_TYPES = ['temperature', 'humidity', 'light'];

/**
 * Fetch *all* the data the dashboard needs in one call,
 * then massage it into the shape the components expect.
 */
export async function compileDashboardData({ untilDate, notificationLimit }) {
  const sensorCurrentsP = SENSOR_TYPES.map((t) => fetchCurrentMeasurement(t));
  const sensorHistoriesP = SENSOR_TYPES.map((t) => fetchSensorHistory(t, untilDate));
  const aiPredsP = SENSOR_TYPES.map((t) => fetchAIPrediction(t));
  const notificationsP = fetchNotifications(notificationLimit);

  const [currents, histories, aiPreds, notifications] = await Promise.all([
    Promise.all(sensorCurrentsP),
    Promise.all(sensorHistoriesP),
    Promise.all(aiPredsP),
    notificationsP
  ]);

  const overviewData = SENSOR_TYPES.map((type, i) => ({
    type,
    current: currents[i], 
    history: histories[i], 
  }));

  const metrics = SENSOR_TYPES.map((type, i) => {
    const { min, max, current: aiCurrent, ideal } = aiPreds[i];
    const friendly = {
      temperature: { name: 'Temperature', unit: 'ºC' },
      humidity:    { name: 'Humidity', unit: '%'   },
      light:       { name: 'Light Intensity', unit: 'lux' }
    }[type];

    return {
      name: friendly.name,
      unit: friendly.unit,
      value: aiCurrent,
      optimal: ideal,
      min,
      max
    };
  });

  return {
    overviewData,
    metrics,
    notifications
  };
}
