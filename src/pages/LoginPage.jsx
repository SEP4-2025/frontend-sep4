import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import loginBackground from '../assets/login_background.jpeg';
import loginBackgroundDark from '../assets/greenhouse-dark.png';
import logo from '../assets/GrowMate_Logo_Transparent.png';
import PasswordResetForm from '../components/PasswordResetForm';
import { useDarkMode } from "../context/DarkModeContext";

function LoginPage({ setIsAuthenticated }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const { darkMode } = useDarkMode();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please fill in both email and password.");
            return;
        }

        try {
            const response = await fetch("https://webapi-service-68779328892.europe-north2.run.app/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password })
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem("token", data.token);
                setIsAuthenticated(true);
                navigate('/dashboard');
            } else {
                alert("Login failed. Check your credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Could not connect to the server.");
        }
    };

    const handleShowPasswordReset = (e) => {
        e.preventDefault();
        setIsResettingPassword(true);
    };

    const handleShowLogin = () => {
        setIsResettingPassword(false);
    };

    return (
        <div className={`flex flex-col md:flex-row min-h-screen ${darkMode ? 'bg-[#0D3444]' : 'bg-[#28463a]'}`}>
            <div
                className="block md:hidden absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${darkMode ? loginBackgroundDark : loginBackground})`
                }}
            ></div>
            <div className="hidden md:block w-full md:w-2/3 max-h-screen relative">
                <img
                    src={darkMode ? loginBackgroundDark : loginBackground}
                    alt="login_background"
                    className="top-0 left-0 w-full h-full object-cover"
                />
            </div>
            <div className='w-full md:w-1/3 flex flex-col justify-center items-center p-6 relative z-10'>
                <div className='text-center flex items-center flex-col justify-center mb-4'>
                    <div className={`rounded-full mb-5 ${darkMode ? 'bg-[#1b3a31]' : 'bg-[#ddefe5]'}`}>
                        <img src={logo} alt="logo" className='h-40 w-40' />
                    </div>
                    <h1 className='Jacques-Francois text-2xl text-white'>Grow smarter, not harder</h1>
                </div>

                {isResettingPassword ? (
                    <PasswordResetForm onShowLogin={handleShowLogin} />
                ) : (
                    <div className={`flex flex-col border-1 gap-3 p-6 rounded-lg w-full max-w-sm ${darkMode ? 'bg-[#1b3a31] border-[#355e4b] placeholder-[#a3bfb3] ' : 'bg-[#ddefe5] border-[#d0c7b7] placeholder-[#7a8678]'}`}>
                        <h2 className={`text-xl font-semibold text-center mb-1 ${darkMode ? 'text-white' : ''}`}>Login</h2>
                        <p className={`${darkMode ? 'text-white' : ''}`}>Username</p>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'placeholder-[#a3bfb3] text-white ' : 'placeholder-[#7a8678]'}`}
                            placeholder="Insert Username"
                        />
                        <p className={`${darkMode ? 'text-white' : ''}`}>Password</p>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'placeholder-[#a3bfb3] text-white ' : 'placeholder-[#7a8678]'}`}
                            placeholder="Insert Password"
                        />
                        <button
                            onClick={handleLogin}
                            className="Manrope bg-[#282828] hover:bg-gray-500 text-white py-2 px-4 rounded w-full"
                        >
                            Login
                        </button>
                        <a
                            href="#"
                            onClick={handleShowPasswordReset}
                            className="mt-2 text-sm text-blue-600 underline hover:text-blue-800 text-center w-full"
                        >
                            Change Password
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;
