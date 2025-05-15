import { Line } from 'react-chartjs-2';
import { useDarkMode } from '../context/DarkModeContext';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);


function WaterManagementGraph () {
    
    //dummy data
    const percentage = 30;
    const dummyData= [
    { date: '2025-01-01', consumption: 30, level: 50 },
    { date: '2025-01-02', consumption: 45, level: 25 },
    { date: '2025-01-03', consumption: 28, level: 78 },
    { date: '2025-01-04', consumption: 60, level: 10 },
    { date: '2025-01-05', consumption: 50, level: 20 },
    ];

    const { darkMode } = useDarkMode();

    const data = {
    labels: dummyData.map(d => d.date),
    datasets: [
        {
        label: 'Water consumption',
        data: dummyData.map(d => d.consumption),
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        },
        {
        label: 'Water level',
        data: dummyData.map(d => d.level),
        fill: false,
        backgroundColor: 'rgb(235, 54, 54)',
        borderColor: 'rgba(235, 54, 54, 0.2)',
        tension: 0.4,
      },
    ],
    };

    const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        position: 'bottom',
        labels: {
                    color: darkMode ? 'white' : 'black',
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: darkMode ? 'white' : 'black', 
                },
            },
            y: {
                ticks: {
                    color: darkMode ? 'white' : 'black',
                },
            },
        },
    };
    return (
      <div className="w-full">
        <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
          <div className="p-6 h-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <h2 className="font-bold text-2xl mb-4 md:mb-0">Water Usage Overview</h2>
              <div className={`rounded-lg p-4 ${darkMode ? 'bg-slate-600 border-slate-500' : 'bg-gray-50 border border-gray-200'} w-full md:w-1/4`}>
                <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Water Level</p>
                <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} h-2 rounded-full mt-1`}>
                  <div
                    className={`${darkMode ? 'bg-blue-400' : 'bg-blue-500'} h-full rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className='flex justify-between mt-1'>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>0%</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>100%</p>
                </div>
              </div>
            </div>
            <div className={`${darkMode ? 'bg-slate-600' : 'bg-gray-50'} p-4 rounded-lg h-full`}>
              <Line data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    )
}

export default WaterManagementGraph;