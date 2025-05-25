# GrowMate Frontend

## What is this repository

This repository contains the frontend application for the SEP4 project at VIA. It's a modern web application built with React, Vite, and Tailwind CSS that serves as the user interface for the GrowMate plant monitoring system. The frontend communicates with the backend services to display data collected from IoT sensors and provides user interaction capabilities.

## How to navigate

### React + Vite Application

The project follows a standard React + Vite application structure:

- `src/` - Contains the source code for the application
  - `src/App.jsx` - The main application component that includes the navbar
  - `src/assets/` - Contains static assets like images and icons
  - `src/index.css` - Contains global CSS and theme definitions
- `public/` - Contains static files that will be served directly
- `vite.config.js` - Configuration for the Vite build tool with tailwind integration
### Styling

The application uses Tailwind CSS for styling with:
- Custom theme values defined in the global CSS file
- Utility classes for responsive design

## How to run

### Prerequisites

- Node.js (preferably the latest LTS version)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

This will start a local development server, typically at http://localhost:5173

### Building for production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory and can be deployed to any static hosting service.

### Preview production build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
frontend-sep4/
├── public/             # Static files
├── src/                # Source files
│   ├── api/            # API
│   ├── assets/         # Images, icons, etc.
│   ├── components/     # Components used by the pages
│   ├── context/        # Context files (Dark Mode, Font Size...)
│   ├── pages/          # Pages
│   ├── tests/          # Component tessting files
│   ├── utils/          # Data compiler
│   ├── App.css         # Component-specific styles
│   ├── App.jsx         # Main application component
│   ├── index.css       # Global styles and Tailwind directives
│   ├── setupTests.js   # Setup for the test eviroment
│   └── main.jsx        # Application entry point
├── Dockerfile          # Docker image building
├── .eslint.config.js   # ESLint configuration
├── index.html          # Entry point of the app
├── jest.config.cjs     # JEST configuration
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration with tailwind
```

## Connecting to Backend

The frontend communicates with the backend services trough endpoints. Ensure the backend services are running when developing or testing the full application stack.

## Github Pages

This repository is hosted on GitHub pages. Visit it at any time at https://sep4-2025.github.io/frontend-sep4/
