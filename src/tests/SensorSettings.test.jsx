import { render, screen } from '@testing-library/react';
import React from 'react';
import SensorSettings from '../components/SensorSettings';
import { DarkModeContext } from '../context/DarkModeContext';

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

    expect(screen.getByText('Sensor settings')).toBeInTheDocument();
    expect(screen.getByLabelText(/Temperature bottom threshold/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temperature deviation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  test('applies correct classes in light mode', () => {
    renderWithDarkMode(false);

    const outerDiv = screen.getByText('Sensor settings').closest('div');
    expect(outerDiv).toHaveClass('bg-gray-50');
    expect(outerDiv).toHaveClass('border-gray-300');
    
    const button = screen.getByRole('button', { name: /update/i });
    expect(button).toHaveClass('bg-gray-600');
  });

  test('applies correct classes in dark mode', () => {
    renderWithDarkMode(true);

    const outerDiv = screen.getByText('Sensor settings').closest('div');
    expect(outerDiv).toHaveClass('bg-slate-600');
    expect(outerDiv).toHaveClass('border-gray-700');

    const button = screen.getByRole('button', { name: /update/i });
    expect(button).toHaveClass('bg-slate-800');
    expect(button).toHaveClass('text-white');
  });
});
