import { SensorOverview } from '../components/SensorOverview';

function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <SensorOverview />
    </div>
  );
}

export default Dashboard;
