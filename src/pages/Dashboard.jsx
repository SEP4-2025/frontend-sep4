import { useState, useEffect } from 'react';
import { compileDashboardData } from '../utils/dataCompiler';
import Name_card             from '../components/Name-card';
import Sensor_card           from '../components/Sensor-cards';
import { SensorOverview }    from '../components/SensorOverview';
import Notification_centre   from '../components/Notification-centre';
import { AIModelPredictions } from '../components/AIModelPredictions';

//icons for dummy data
import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import waterIcon from '../assets/lets-icons--water.svg';

const _dummyMetrics = [
  { name: 'Temperature',     unit: 'ºC',  value: 23,   optimal: 25 },
  { name: 'Light Intensity', unit: 'lux', value: 15000, optimal: 20000 },
  { name: 'Humidity',        unit: '%',   value: 45,   optimal: 60 },
];
const dummyNotifications = [
            {
              icon: temperatureIcon,
              title: 'High Temperature',
              description: 'The temperature is above the safe range.',
              time: 'Today, 09:12 AM',
              importance: 3
            },
            {
              icon: humidityIcon,
              title: 'Low Humidity',
              description: 'Humidity is below the optimal level.',
              time: 'Today, 07:45 AM',
              importance: 2
            },
            {
              icon: lightIntensityIcon,
              title: 'Light Level Normal',
              description: 'Light level is within the desired range.',
              time: 'Yesterday, 08:00 PM',
              importance: 1
            }
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

console.log(lightSensorData);
  return (
    <div className="p-4">
      <Name_card />
      <Sensor_card lightSensorData={lightSensorData}/>
      <SensorOverview />
      <div className="flex ">
      <Notification_centre />
      <AIModelPredictions metrics={metrics} />
      </div>
    </div>
  );
}

export default Dashboard;
