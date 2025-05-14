import { useDarkMode } from '../context/DarkModeContext';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';

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
  Legend,
  annotationPlugin
);


function SensorViewGraph (idealValue, inputData, status, lastMeasurement, selectedSensor) {
    const { darkMode } = useDarkMode();

    const [open, setOpen] = useState(false);

    //dummy data
    idealValue = 50;

    status = "Online"
    lastMeasurement = 20;
    selectedSensor = "Temperature";

    inputData = [
    { date: '10:00', value: 52},
    { date: '11:00', value: 55},
    { date: '12:00', value: 60},
    { date: '13:00', value: 48},
    { date: '14:00', value: 50},
    { date: '15:00', value: 45},
    { date: '16:00', value: 40},
    ];

    const data = {
    labels: inputData.map(d => d.date),
    datasets: [
        {
        label: 'Sensor value (%)',
        data: inputData.map(d => ((d.value - idealValue) / idealValue) * 100),
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.6)',
        tension: 0.4,
        }
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
        annotation: { 
            annotations: {
                safeZone: {
                type: 'box',
                yMin: -20,
                yMax: 20,
                backgroundColor: 'rgba(144, 238, 144, 0.2)', 
                },
                warningZone: {
                type: 'box',
                yMin: 20,
                yMax: 50,
                backgroundColor: 'rgba(255, 255, 0, 0.2)',
                },
                dangerZone: {
                type: 'box',
                yMin: 50,
                backgroundColor: 'rgba(255, 99, 132, 0.2)', 
                },
                bottomwarningZone: {
                type: 'box',
                yMin: -20,
                yMax: -50,
                backgroundColor: 'rgba(255, 255, 0, 0.2)',
                },
                bottomdangerZone: {
                type: 'box',
                yMin: -50,
                yMax: -100,
                backgroundColor: 'rgba(255, 99, 132, 0.2)', 
                },
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
            callback: (value) => `${value}%`,
            color: darkMode ? 'white' : 'black',
        },
        title: {
            display: true,
            text: 'Deviation (%)',
            color: darkMode ? 'white' : 'black',
        },
        },
    },
    };

    return (
        <div className={`w-full ${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-lg p-4 mb-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <div className='flex lg:flex-row flex-col'>

                        <div className="relative flex items-center h-12 mb-3">
                            <button
                                onClick={() => setOpen(!open)}
                                className={`h-full flex justify-center items-center w-full rounded-md shadow-sm px-4 py-2 ${darkMode ? 'bg-slate-700 text-white hover:slate-50' : 'bg-navbar-color, text-gray-700 hover:bg-gray-50'}`}
                            >
                                Selected sensor: {selectedSensor}
                                <svg
                                className="-mr-1 ml-2 h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                />
                                </svg>
                            </button>

                            {open && (
                                <div className={`absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${darkMode ? 'bg-slate-700 text-white' : 'bg-navbar-color text-gray-700'}`}>
                                <div className="py-1">
                                    <a href="#" className={`block px-4 py-2 text-sm ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-navbar-color text-gray-700 hover:bg-gray-100'}`}>Water</a>
                                    <a href="#" className={`block px-4 py-2 text-sm ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-navbar-color text-gray-700 hover:bg-gray-100'}`}>Air</a>
                                    <a href="#" className={`block px-4 py-2 text-sm ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-navbar-color text-gray-700 hover:bg-gray-100'}`}>Light</a>
                                </div>
                                </div>
                            )}
                            </div>


                        <div className={`flex flex-row h-full rounded-lg items-center justify-center shadow-sm mx-auto p-3 ${darkMode ? 'bg-slate-700 text-white' : 'bg-navbar-color, text-gray-700'}`}>
                            <p>Status: {status}</p>
                        </div>
                        <div className={`flex flex-row h-full items-center justify-center rounded-lg shadow-sm p-3 ${darkMode ? 'bg-slate-700 text-white' : 'bg-navbar-color, text-gray-700'}`}>
                            <p>Last measurement: {lastMeasurement}ºC</p>
                        </div>
                    </div>
                    <Line data={data} options={options} />
                </div>
            </div>
        </div>
    )
}
export default SensorViewGraph;