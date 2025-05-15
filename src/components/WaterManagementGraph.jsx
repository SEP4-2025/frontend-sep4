import { Line } from 'react-chartjs-2';
import { useDarkMode } from '../context/DarkModeContext';
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { compileWaterUsageHistory } from '../utils/dataCompiler';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Create a chart plugin to set the background color based on theme
const chartBgPlugin = {
  id: 'chartBgPlugin',
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.fillStyle = options.backgroundColor || 'white';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

function WaterManagementGraph ({ pumpId = 1 }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usageData, setUsageData] = useState({
        labels: [],
        consumption: [],
        waterLevelPercentage: 0
    });
    
    const { darkMode } = useDarkMode();
    
    useEffect(() => {
        const fetchWaterUsageData = async () => {
            try {
                setLoading(true);
                const data = await compileWaterUsageHistory(pumpId);
                setUsageData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching water usage data:', err);
                setError('Failed to load water usage data');
            } finally {
                setLoading(false);
            }
        };
        
        fetchWaterUsageData();
        
        // Refresh every 5 minutes
        const intervalId = setInterval(fetchWaterUsageData, 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [pumpId]);
    
    const percentage = usageData.waterLevelPercentage;

    const data = {
      labels: usageData.labels,
      datasets: [
        {
          label: 'Water consumption (ml)',
          data: usageData.consumption,
          fill: false,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgba(54, 162, 235, 0.7)',
          tension: 0.4,
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        chartBgPlugin: {
          backgroundColor: darkMode ? 'rgb(71, 85, 105)' : 'white',
        },
        legend: {
          position: 'bottom',
          labels: {
            color: darkMode ? 'white' : 'black',
            font: {
              size: 12
            }
          },
        },
        tooltip: {
          backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          titleColor: darkMode ? '#fff' : '#000',
          bodyColor: darkMode ? '#e2e8f0' : '#334155',
          borderColor: darkMode ? 'rgba(226, 232, 240, 0.2)' : 'rgba(30, 41, 59, 0.2)',
          borderWidth: 1,
          padding: 10,
          caretSize: 8,
          displayColors: true,
          callbacks: {
            title: function(context) {
              return context[0].label;
            },
            label: function(context) {
              return `Water used: ${context.raw} ml`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            color: darkMode ? 'white' : 'black',
            font: {
              size: 11
            }
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            color: darkMode ? 'white' : 'black',
            font: {
              size: 11
            },
            precision: 0
          },
          title: {
            display: true,
            text: 'Water Consumption (ml)',
            color: darkMode ? 'white' : 'black'
          }
        },
      },
    };
    return (
      <div className="w-full">
        <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <h2 className="font-bold text-2xl mb-4 md:mb-0">Water Usage Overview</h2>
              <div className={`rounded-lg p-4 ${darkMode ? 'bg-slate-600 border-slate-500' : 'bg-gray-50 border border-gray-200'} w-full md:w-1/4`}>
                <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Water Level</p>
                <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} h-2 rounded-full mt-1`}>
                  <div
                    className={`${darkMode ? 'bg-blue-400' : 'bg-blue-500'} h-full rounded-full transition-all duration-300 ease-in-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className='flex justify-between mt-1'>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>0%</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>100%</p>
                </div>
              </div>
            </div>
            
            {error && (
              <div className={`p-4 mb-4 rounded-lg ${darkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-800'}`}>
                <p>{error}</p>
              </div>
            )}
            
            <div className={`${darkMode ? 'bg-slate-600' : 'bg-gray-50'} p-4 rounded-lg`}>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : usageData.labels.length > 0 ? (
                <div className="h-64">
                  <Line 
                    data={data} 
                    options={options} 
                    plugins={[chartBgPlugin]}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>No water usage data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
}

export default WaterManagementGraph;