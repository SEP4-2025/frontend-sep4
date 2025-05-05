import { useState, useEffect } from 'react';
import { compileDashboardData } from '../utils/dataCompiler';
import Name_card             from '../components/Name-card';
import Sensor_card           from '../components/Sensor-cards';
import { SensorOverview }    from '../components/SensorOverview';
import Notification_centre   from '../components/Notification-centre';
import { AIModelPredictions } from '../components/AIModelPredictions';
import ClockCard              from '../components/Clock-card';

const _dummyMetrics = [
  { name: 'Temperature',     unit: 'ºC',  value: 23,   optimal: 25 },
  { name: 'Light Intensity', unit: 'lux', value: 15000, optimal: 20000 },
  { name: 'Humidity',        unit: '%',   value: 45,   optimal: 60 },
];

function Dashboard() {
  // const [metrics, setMetrics] = useState([]);
  const [lightSensorData, setlightSensorData,] = useState([]);

  useEffect(() => {
    compileDashboardData()
      // .then(({ metrics }) => setMetrics(metrics))
      .then(({ lightSensorData }) => setlightSensorData(lightSensorData))
      .catch(console.error);
}, []);

console.log(lightSensorData);
  return (
    <div className="p-4">
      <div className='flex flex-row justify-between'>
      <Name_card />
      <ClockCard />
      </div>
      <Sensor_card lightSensorData={lightSensorData}/>
      <SensorOverview />
      <div className="flex ">
      <Notification_centre />
      <AIModelPredictions metrics={_dummyMetrics} />
      </div>
    </div>
  );
}

export default Dashboard;
