import { SensorOverview } from '../components/SensorOverview';
import Name_card from '../components/Name-card';
import Sensor_card from '../components/Sensor-cards'

function Dashboard() {
  return (
    <div className="p-4">
      <Name_card />
      <Sensor_card />
      <SensorOverview />
    </div>
  );
}

export default Dashboard;
