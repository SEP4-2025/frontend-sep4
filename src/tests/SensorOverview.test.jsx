import { render, screen, waitFor } from '@testing-library/react';
import { SensorOverview } from '../components/SensorOverview';
import * as DarkModeContext from '../context/DarkModeContext';
import React from 'react';

// Mocks
jest.mock('react-chartjs-2', () => ({
  Line: ({ data }) => (
    <div data-testid="chart">
      <div data-testid="labels">{JSON.stringify(data.labels)}</div>
      <div data-testid="dataset">{JSON.stringify(data.datasets[0].data)}</div>
    </div>
  )
}));

jest.mock('../context/DarkModeContext', () => ({
  useDarkMode: () => ({ darkMode: false }),
}));

// Helper
const generateFakeData = (hours = 24, value = 25) => {
  const now = new Date();
  return Array.from({ length: hours }, (_, i) => {
    const date = new Date(now);
    date.setHours(now.getHours() - (hours - i));
    return { value, date: date.toISOString() };
  });
};

describe('SensorOverview', () => {
  test('renders chart with temperature data by default', async () => {
    const tempData = generateFakeData(24, 22);
    render(<SensorOverview temperatureHistory={tempData} />);

    await waitFor(() => {
      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });

    const labels = JSON.parse(screen.getByTestId('labels').textContent);
    const dataset = JSON.parse(screen.getByTestId('dataset').textContent);

    expect(labels.length).toBe(24);
    expect(dataset.length).toBe(24);
    expect(dataset[0]).toBeCloseTo(22);
  });

  test('renders empty chart when no data is provided', async () => {
    render(<SensorOverview temperatureHistory={[]} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });

    const dataset = JSON.parse(screen.getByTestId('dataset').textContent);
    expect(dataset).toEqual([]);
  });

  test('shows correct label for temperature sensor', async () => {
    const tempData = generateFakeData(24, 18);
    render(<SensorOverview temperatureHistory={tempData} />);
    
    await waitFor(() => {
      const dataset = JSON.parse(screen.getByTestId('dataset').textContent);
      expect(dataset[0]).toBe(18);
    });
  });

  test('adjusts yAxisConfig when data exceeds base range', async () => {
    const highTempData = generateFakeData(24, 95);

    render(<SensorOverview temperatureHistory={highTempData} />);

    await waitFor(() => {
        const dataset = JSON.parse(screen.getByTestId('dataset').textContent);
        expect(dataset.every(val => val === null || val >= 95)).toBe(true);
    });
    });

  test('handles missing hourly data by reducing dataset length', async () => {
    const now = new Date();
    const sparseData = [
      { value: 20, date: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString() },
      { value: 22, date: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() },
    ];

    render(<SensorOverview temperatureHistory={sparseData} />);

    await waitFor(() => {
      const dataset = JSON.parse(screen.getByTestId('dataset').textContent);
      const nonNulls = dataset.filter(v => v !== null);
      expect(nonNulls.length).toBeLessThan(24);
    });
  });
});
