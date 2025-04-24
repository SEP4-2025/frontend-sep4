import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Components
import Navbar from './components/Navbar'

// Pages
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <div className="flex">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/water-management" element={<div className="p-4"><h1>Water Managment</h1><p>Water managment page coming soon</p></div>} />
            <Route path="/sensor-view" element={<div className="p-4"><h1>Sensor View</h1><p>Sensor view page coming soon</p></div>} />
            <Route path="/gallery" element={<div className="p-4"><h1>Gallery</h1><p>Gallery page coming soon</p></div>} />
            <Route path="/settings" element={<div className="p-4"><h1>Settings</h1><p>Settings page coming soon</p></div>} />
            <Route path="/about" element={<div className="p-4"><h1>About Us</h1><p>About us page coming soon</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
