import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FontSizeProvider } from './context/FontSizeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FontSizeProvider>
      <App />
    </FontSizeProvider>
  </StrictMode>,
)
