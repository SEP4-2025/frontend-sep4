import { SensorOverview } from '../components/SensorOverview';
import Name_card from '../components/Name-card';
import Sensor_card from '../components/Sensor-cards'
import Notification_centre from '../components/Notification-centre'

function Dashboard() {
  return (
    <div className="p-4">
      <Name_card />
      <Sensor_card />
      <SensorOverview />
      <Notification_centre />
    </div>
  );
}

export default Dashboard;
