import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SensorLog from '../components/SensorLog';
import { useDarkMode } from '../context/DarkModeContext';

jest.mock('../context/DarkModeContext', () => ({
  useDarkMode: jest.fn(),
}));

jest.mock('../components/Log-card', () => ({ log }) => (
  <div data-testid="log-card">{log.message}</div>
));

jest.mock('../components/log-pupup', () => ({ isOpen }) => (
  isOpen ? <div data-testid="log-popup">Modal is open</div> : null
));

describe('SensorLog', () => {
  test('renders log cards when logs are provided', () => {
    useDarkMode.mockReturnValue({ darkMode: false });

    const mockLogs = [
      { id: 1, message: 'First log' },
      { id: 2, message: 'Second log' }
    ];

    render(<SensorLog logs={mockLogs} />);
    
    const logCards = screen.getAllByTestId('log-card');
    expect(logCards).toHaveLength(2);
    expect(logCards[0]).toHaveTextContent('First log');
    expect(logCards[1]).toHaveTextContent('Second log');
  });

  test('shows fallback message when no logs are available', () => {
    useDarkMode.mockReturnValue({ darkMode: false });

    render(<SensorLog logs={[]} />);
    expect(screen.getByText(/No logs available/i)).toBeInTheDocument();
  });

  test('shows "View All Logs" button when more than 2 logs exist', () => {
    useDarkMode.mockReturnValue({ darkMode: false });

    const mockLogs = [
      { id: 1, message: 'Log 1' },
      { id: 2, message: 'Log 2' },
      { id: 3, message: 'Log 3' }
    ];

    render(<SensorLog logs={mockLogs} />);
    expect(screen.getByText(/View All Logs/i)).toBeInTheDocument();
  });

  test('opens modal when "View All Logs" button is clicked', () => {
    useDarkMode.mockReturnValue({ darkMode: false });

    const mockLogs = [
      { id: 1, message: 'Log 1' },
      { id: 2, message: 'Log 2' },
      { id: 3, message: 'Log 3' }
    ];

    render(<SensorLog logs={mockLogs} />);
    fireEvent.click(screen.getByText(/View All Logs/i));
    expect(screen.getByTestId('log-popup')).toBeInTheDocument();
  });

  test('applies dark mode classes when darkMode is true', () => {
    useDarkMode.mockReturnValue({ darkMode: true });

    render(<SensorLog logs={[]} />);
    const noLogsMessage = screen.getByTestId('no-logs-message');
    expect(noLogsMessage).toHaveClass('text-gray-300');
  });

});