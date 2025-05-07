import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import loginBackground from '../assets/login_background.jpeg';
import logo from '../assets/GrowMate_Logo_Transparent.png';
import PasswordResetForm from '../components/PasswordResetForm'; 

function LoginPage({ setIsAuthenticated }) {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isResettingPassword, setIsResettingPassword] = useState(false); 

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
        <div className='flex flex-col md:flex-row bg-[#EAF5E9] min-h-screen'>
            <div className="w-full md:w-2/3 h-64 md:h-auto relative">
                <img src={loginBackground} alt="login_background" className='top-0 left-0 w-full h-full object-cover' />
            </div>
            <div className='w-full md:w-1/3 flex flex-col justify-center items-center p-6'>
                <div className='text-center flex items-center flex-col justify-center'>
                    <img src={logo} alt="logo" className='h-40 w-40' />
                    <h1 className='Jacques-Francois text-2xl'>Grow smarter, not harder</h1>
                </div>
                
                {isResettingPassword ? (
                    <PasswordResetForm onShowLogin={handleShowLogin} />
                ) : (
                    <div className='flex flex-col bg-white gap-3 p-6 rounded-lg w-full max-w-sm'> 
                        <p>Username</p> 
                        <input
                            type="text" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded w-full" 
                            placeholder="Insert Username"
                        />
                        <p>Password</p>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 rounded w-full" 
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
                            Forgot your password?
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;
