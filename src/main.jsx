import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FontSizeProvider } from './context/FontSizeContext';
import { DarkModeProvider } from './context/DarkModeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
    <FontSizeProvider>
      <App />
    </FontSizeProvider>
    </DarkModeProvider>
  </StrictMode>,
)
