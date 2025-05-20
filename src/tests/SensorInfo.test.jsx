import { render, screen } from '@testing-library/react';
import SensorInfo from '../components/SensorInfo';
import { DarkModeContext } from '../context/DarkModeContext';
import React from 'react';

const renderWithContext = (ui, { darkMode = false } = {}) => {
    return render(
        <DarkModeContext.Provider value={{ darkMode }}>
            {ui}
        </DarkModeContext.Provider>
    );
};

describe('SensorInfo component', () => {
    it('renders sensor name and value correctly', () => {
        renderWithContext(
            <SensorInfo
                lastMeasurementValue={24.5}
                idealValue={25}
                unit="°C"
                sensorName="Temperature"
                sensorKey="temperature"
            />
        );

        expect(screen.getByText(/Temperature:/i)).toBeInTheDocument();
        expect(screen.getByText(/24\.5°C/)).toBeInTheDocument();
    });

    it('displays correct deviation and recommended action (near optimal)', () => {
        renderWithContext(
            <SensorInfo
                lastMeasurementValue={24.5}
                idealValue={25}
                unit="°C"
                sensorName="Temperature"
                sensorKey="temperature"
            />
        );

        expect(screen.getByText(/Current deviation: -2.0%/)).toBeInTheDocument();
        expect(screen.getByText(/Recommended action: Conditions are near optimal./)).toBeInTheDocument();
    });

    it('shows "Cool the greenhouse" if temperature is too high', () => {
        renderWithContext(
            <SensorInfo
                lastMeasurementValue={30}
                idealValue={25}
                unit="°C"
                sensorName="Temperature"
                sensorKey="temperature"
            />
        );

        expect(screen.getByText(/Current deviation: 20.0%/)).toBeInTheDocument();
        expect(screen.getByText(/Recommended action: Cool the greenhouse/)).toBeInTheDocument();
    });

    it('renders correctly in dark mode', () => {
        renderWithContext(
            <SensorInfo
                lastMeasurementValue={24.5}
                idealValue={25}
                unit="°C"
                sensorName="Temperature"
                sensorKey="temperature"
            />,
            { darkMode: true }
        );

        const darkText = screen.getByText(/Temperature:/);
        expect(darkText).toHaveClass('text-white');
    });

    it('displays N/A when values are missing', () => {
        renderWithContext(
            <SensorInfo
                lastMeasurementValue={null}
                idealValue={null}
                unit="°C"
                sensorName="Temperature"
                sensorKey="temperature"
            />
        );

        expect(screen.getByText(/Temperature: N\/A/)).toBeInTheDocument();
        expect(screen.getByText(/Current deviation: N\/A/)).toBeInTheDocument();
    });
});
