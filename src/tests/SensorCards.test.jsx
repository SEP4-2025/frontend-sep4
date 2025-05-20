import { render, screen } from '@testing-library/react';
import React from 'react';
import SensorCard from '../components/Sensor-cards';
import { DarkModeContext } from '../context/DarkModeContext';

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
    return render(
      <DarkModeContext.Provider value={{ darkMode: darkModeValue, setDarkMode: jest.fn() }}>
        {ui}
      </DarkModeContext.Provider>
    );
  };

  test('renders the correct sensor data', () => {
    renderWithDarkMode(<SensorCard {...mockData} />);
    const temperatureCard = screen.getByTestId('temperature-card');
    expect(temperatureCard).toHaveClass('bg-slate-700');
  });

  test('renders all sensor cards with dark mode styles and correct values', () => {
    renderWithDarkMode(<SensorCard {...mockData} />);

    const temperatureCard = screen.getByTestId('temperature-card');
    const humidityCard = screen.getByTestId('humidity-card');
    const soilMoistureCard = screen.getByTestId('soil-moisture-card');
    const waterLevelCard = screen.getByTestId('water-level-card');
    const lightIntensityCard = screen.getByTestId('light-intensity-card');

    expect(temperatureCard).toHaveClass('bg-slate-700');
    expect(humidityCard).toHaveClass('bg-slate-700');
    expect(soilMoistureCard).toHaveClass('bg-slate-700');
    expect(waterLevelCard).toHaveClass('bg-slate-700');
    expect(lightIntensityCard).toHaveClass('bg-slate-700');

    expect(temperatureCard).toHaveTextContent('22.5');
    expect(humidityCard).toHaveTextContent('60');
    expect(soilMoistureCard).toHaveTextContent('30');
    expect(waterLevelCard).toHaveTextContent('88');
    expect(lightIntensityCard).toHaveTextContent('100');

    if (mockData.waterLevelSensorData?.value != null) {
    expect(waterLevelCard).toHaveTextContent(String(mockData.waterLevelSensorData.value));
    } else {
      expect(waterLevelCard).toHaveTextContent('N/A');
    }
  });

  test('handles N/A if data is missing', () => {
    renderWithDarkMode(<SensorCard {...{ ...mockData, temperatureSensorData: null }} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
