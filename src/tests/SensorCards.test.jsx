import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('../api/index.js', () => ({
  updateSensorThreshold: jest.fn(),
}));

import SensorCard from '../components/SensorCard';
import { useDarkMode } from '../context/DarkModeContext';

jest.mock('../context/DarkModeContext', () => ({
  useDarkMode: jest.fn(),
}));

describe('SensorCard', () => {
  const mockData = {
    lightSensorData: { value: 100 },
    temperatureSensorData: { value: 22.5 },
    humiditySensorData: { value: 60 },
    soilMoistureSensorData: { value: 30 },
    waterLevelSensorData: { value: 88 },
    lightSensorDataAverageToday: { value: 110 },
    temperatureSensorDataAverageToday: { value: 23.5 },
    humiditySensorDataAverageToday: { value: 58 },
    soilMoistureSensorDataAverageToday: { value: 32 },
    waterLevelSensorDataAverageToday: { value: 74 },
    lightSensorDataAverageYesterday: { value: 90 },
    temperatureSensorDataAverageYesterday: { value: 21.0 },
    humiditySensorDataAverageYesterday: { value: 62 },
    soilMoistureSensorDataAverageYesterday: { value: 29 },
    waterLevelSensorDataAverageYesterday: { value: 76 },
  };

  const renderWithDarkMode = (ui, darkModeValue = true) => {
    useDarkMode.mockReturnValue({ darkMode: darkModeValue });
    return render(ui);
  };

  test('renders the correct sensor data', () => {
    renderWithDarkMode(
      <SensorCard
        title="Temperature"
        iconSrc="dummy-icon.svg"
        currentData={mockData.temperatureSensorData}
        averageToday={mockData.temperatureSensorDataAverageToday}
        averageYesterday={mockData.temperatureSensorDataAverageYesterday}
        unit="°C"
        precision={1}
        dataTestId="temperature-card"
      />
    );
    
    const temperatureCard = screen.getByTestId('temperature-card');
    expect(temperatureCard).toHaveClass('bg-slate-700');
    expect(temperatureCard).toHaveTextContent('22.5°C');
  });

  test('renders Light sensor card with dark mode styles and correct values', () => {
    renderWithDarkMode(
      <SensorCard
        title="Light"
        iconSrc="dummy-light-icon.svg"
        currentData={mockData.lightSensorData}
        averageToday={mockData.lightSensorDataAverageToday}
        averageYesterday={mockData.lightSensorDataAverageYesterday}
        unit="lux"
        precision={0}
        dataTestId="light-intensity-card"
      />
    );

    const lightIntensityCard = screen.getByTestId('light-intensity-card');

    expect(lightIntensityCard).toHaveClass('bg-slate-700');
    expect(lightIntensityCard).toHaveTextContent('100lux'); 

  });

  test('handles N/A if data is missing', () => {
    renderWithDarkMode(
      <SensorCard
        title="Temperature"
        iconSrc="dummy-icon.svg"
        currentData={null}
        averageToday={mockData.temperatureSensorDataAverageToday} 
        averageYesterday={mockData.temperatureSensorDataAverageYesterday}
        unit="°C"
        precision={1}
        dataTestId="temperature-card"
      />
    );
    const temperatureCard = screen.getByTestId('temperature-card');
    expect(temperatureCard).toHaveTextContent('N/A');
  });

  test('applies dark mode classes when darkMode is true', () => {
    renderWithDarkMode(
      <SensorCard
        title="Temperature"
        iconSrc="dummy-icon.svg"
        currentData={mockData.temperatureSensorData}
        averageToday={mockData.temperatureSensorDataAverageToday}
        averageYesterday={mockData.temperatureSensorDataAverageYesterday}
        unit="°C"
        precision={1}
        dataTestId="temperature-card"
      />,
      true
    );
    const temperatureCard = screen.getByTestId('temperature-card');
    expect(temperatureCard).toHaveClass('bg-slate-700');
  });
});
