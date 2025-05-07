// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('https://webapi-service-68779328892.europe-north2.run.app/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      navigate('/dashboard'); // go to dashboard
    } else {
      alert('Login failed!');
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
      <h2 className="text-lg font-semibold mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
        Log In
      </button>
    </form>
  );
}
