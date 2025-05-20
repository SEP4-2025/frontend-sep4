import { render, screen } from '@testing-library/react';
import React from 'react';
import SensorSettings from '../components/SensorSettings';
import { DarkModeContext } from '../context/DarkModeContext';

jest.mock('../api/index.js', () => ({
  updateSensorThreshold: jest.fn(),
}));

describe('SensorSettings', () => {
  const renderWithDarkMode = (darkModeValue) => {
    return render(
      <DarkModeContext.Provider value={{ darkMode: darkModeValue }}>
        <SensorSettings />
      </DarkModeContext.Provider>
    );
  };

  test('renders all UI elements correctly', () => {
    renderWithDarkMode(false);

    expect(screen.getByTestId('sensor-settings-container')).toBeInTheDocument();
    expect(screen.getByTestId('sensor-name-label')).toHaveTextContent('Threshold');
    expect(screen.getByPlaceholderText(/Enter threshold value/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update threshold/i })).toBeInTheDocument();
  });

  test('applies correct classes in light mode', () => {
    renderWithDarkMode(false);

    const outerDiv = screen.getByTestId('sensor-settings-container');
    expect(outerDiv).toHaveClass('bg-white');
    
    const button = screen.getByRole('button', { name: /update/i });
    expect(button).toHaveClass('bg-gray-400');
  });

  test('applies correct classes in dark mode', () => {
    renderWithDarkMode(true);

    const outerDiv = screen.getByTestId('sensor-settings-container');
    expect(outerDiv).toHaveClass('bg-slate-700');

    const button = screen.getByRole('button', { name: /update/i });
    expect(button).toHaveClass('bg-gray-400');
    expect(button).toHaveClass('text-white');
  });
});
