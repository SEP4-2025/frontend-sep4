import { SensorOverview } from '../components/SensorOverview';
import Name_card from '../components/Name-card';
import Sensor_card from '../components/Sensor-cards'
import { AIModelPredictions } from '../components/AIModelPredictions';
import Notification_centre from '../components/Notification-centre'


function Dashboard() {
  /* 
   * Input data for the AI model predictions
   * Right now, this is hardcoded
   * TODO: Fetch this data from the backend
   */
  const plantMetrics = [
    { name: 'Temperature', unit: 'ºC', value: 27, optimal: 25 },
    { name: 'Light Intensity', unit: 'lux', value: 18000, optimal: 20000 },
    { name: 'Humidity', unit: '%', value: 45, optimal: 60 },
  ];
  
  return (
    <div className="p-4">
      <Name_card />
      <Sensor_card />
      <SensorOverview />
      <div className="flex ">
      <Notification_centre />
      <AIModelPredictions metrics={plantMetrics} />
      </div>
    </div>
  );
}


export default Dashboard;
