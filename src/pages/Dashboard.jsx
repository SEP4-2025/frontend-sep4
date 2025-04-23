import { SensorOverview } from '../components/SensorOverview';
import Sensor_card from '../components/Sensor-cards'

function Dashboard() {
  return (
    <div className="p-4">
      <Sensor_card />
      <SensorOverview />
    </div>
  );
}

export default Dashboard;
