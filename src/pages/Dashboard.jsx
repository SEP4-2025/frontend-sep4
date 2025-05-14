import { useState, useEffect } from 'react';
import { compileDashboardData } from '../utils/dataCompiler';
import Name_card             from '../components/Name-card';
import Sensor_card           from '../components/Sensor-cards';
import { SensorOverview }    from '../components/SensorOverview';
import Notification_centre   from '../components/Notification-centre';
import { AIModelPredictions } from '../components/AIModelPredictions';
import ClockCard              from '../components/Clock-card';
import LoadingScreen from '../components/Loading-screen';

const _dummyMetrics = [
  { name: 'Temperature',     unit: 'ºC',  value: 23,   optimal: 25 },
  { name: 'Light Intensity', unit: 'lux', value: 15000, optimal: 20000 },
  { name: 'Humidity',        unit: '%',   value: 45,   optimal: 60 },
];

function Dashboard() {
  const [lightSensorData, setlightSensorData,] = useState([]);
  const [greenhouseData, setGreenhouseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const gardenerId = 1; // TODO: We will need to pass the information about the gardenerId from the login page to the dashboard page, for now it is hardcoded
    compileDashboardData(gardenerId)
      .then((data) => {
        setlightSensorData(data.lightSensorData);
        setGreenhouseData(data.greenhouseData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      });
}, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className="p-4">
      <div className='flex flex-row justify-between'>
      <Name_card greenhouseData= {greenhouseData}/>
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
