import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FontSizeProvider } from './context/FontSizeContext';
import { DarkModeProvider } from './context/DarkModeContext.jsx';
import { NotificationProvider } from './context/NotificationHubContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
    <FontSizeProvider>
      <NotificationProvider>
      <App />
      </NotificationProvider>
    </FontSizeProvider>
    </DarkModeProvider>
  </StrictMode>,
)
