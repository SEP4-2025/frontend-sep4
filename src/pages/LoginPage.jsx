import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import loginBackground from '../assets/login_background.jpeg';
import logo from '../assets/GrowMate_Logo_Transparent.png';

function LoginPage () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!email || !password) {
          alert("Please fill in both email and password.");
          return;
        }

        navigate('/dashboard');
};
    return (
        <div className='flex flex-row bg-[#EAF5E9]'>
            <div className="relative w-2/3 h-screen">
                <img src={loginBackground} alt="login_background" className='absolute top-0 left-0 w-full h-full object-cover' />
            </div>
            <div className='flex flex-col gap-6 w-1/3 p-6'>
                <div className='text-center flex items-center flex-col justify-center'>
                    <img src={logo} alt="logo" className='h-40 w-40' />
                    <h1 className='Jacques-Francois text-2xl'>Grow smarter, not harder</h1>
                </div>
                <div className='flex flex-col bg-white gap-3 p-6 rounded-lg'>
                    <p>Email</p>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Insert Email"
                        />
                    <p>Password</p>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Insert Password"
                        />
                        <button
                            onClick={handleLogin} //change when logic is actually working
                            className="Manrope bg-[#282828] hover:bg-gray-500 text-white py-2 px-4 rounded"
                        >
                            Login
                        </button>
                        <a href="dashboard" className="text-blue-600 underline hover:text-blue-800">
                            Forgot your password?
                        </a>
                    
                </div>
            </div>
        </div>
    )
}

export default LoginPage;