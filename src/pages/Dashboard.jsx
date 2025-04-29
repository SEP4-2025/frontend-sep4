import { useState, useEffect } from 'react';
import { compileDashboardData } from '../utils/dataCompiler';
import Name_card             from '../components/Name-card';
import Sensor_card           from '../components/Sensor-cards';
import { SensorOverview }    from '../components/SensorOverview';
import Notification_centre   from '../components/Notification-centre';
import { AIModelPredictions } from '../components/AIModelPredictions';

const dummyMetrics = [
  { name: 'Temperature',     unit: 'ºC',  value: 23,   optimal: 25 },
  { name: 'Light Intensity', unit: 'lux', value: 15000, optimal: 20000 },
  { name: 'Humidity',        unit: '%',   value: 45,   optimal: 60 },
];

function Dashboard() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    if (false) { // Comment this line to use the real data
      setMetrics(dummyMetrics); // Comment this line to use the real data
    } else {
      compileDashboardData({ untilDate: '2025-04-29', notificationLimit: 5 })
        .then(({ metrics }) => setMetrics(metrics))
        .catch(console.error);
    }
  }, []);

  return (
    <div className="p-4">
      <Name_card />
      <Sensor_card />
      <SensorOverview />
      <div className="flex ">
      <Notification_centre />
      <AIModelPredictions metrics={metrics} />
      </div>
    </div>
  );
}

export default Dashboard;
