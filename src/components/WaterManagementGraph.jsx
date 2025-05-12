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
      <div className={`w-full ${darkMode ? 'darkMode' : ''}`}>
        <div className={`rounded-lg p-4 mb-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
          <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
            <div className="flex flex-row p-5">
              <p className="Manrope font-bold text-3xl">Water usage overview</p>
                <div className="ml-auto border border-black rounded-lg p-3 w-1/4">
                  <p>Water level</p>
                    <div className="w-full bg-gray-300 h-2 rounded-xl mt-2">
                      <div
                          className="bg-black h-full rounded-xl"
                          style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className='flex flex-row'>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-400'}`}>0%</p>
                      <p className={`ml-auto ${darkMode ? 'text-white' : 'text-gray-400'}`}>100%</p>
                    </div>
                </div>
            </div>
              <Line data={data} options={options} />
          </div>
            <div className=" flex flex-row justify-center p-3 gap-3">
            </div>
        </div>
      </div>
    )
}

export default WaterManagementGraph;