import { useNavigate } from 'react-router-dom';
import background from '../assets/start_page_bg.jpeg';
import logo from '../assets/GrowMate_Logo_Transparent.png';
import x from '../assets/x_logo.png';
import linkedin from '../assets/linkedin.png';
import instagram from '../assets/Instagram-Emblem.png';
import facebook from '../assets/facebook.png';

function StartPage () {
    const navigate = useNavigate();

    function goToLogin() {
        navigate('/loginPage');
    }

    return (
        <div className="h-screen w-screen bg-cover bg-center flex flex-col justify-between" style={{ backgroundImage: `url(${background})` }}>
        <div className="flex flex-col items-center justify-center flex-grow">
            <div className="flex justify-center items-center flex-col bg-black/50 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/5 rounded-xl gap-6">
            <div className="bg-[#E7FFE3] rounded-full w-1/2 mt-8">
                <img src={logo} alt="logo" className="w-full max-w-xs h-auto" />
            </div>
            <p className="text-white Jacques-Francois sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">GrowMate</p>
            <button onClick={goToLogin} className="Manrope bg-[#E7FFE3] hover:bg-green-500 text-black py-2 px-4 rounded-xl w-2/3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                Login
            </button>
            <button className="Manrope bg-[#E7FFE3] hover:bg-green-500 text-black py-2 px-4 rounded-xl w-2/3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-8">
                Reset password
            </button>
            </div>
        </div>

        <footer className="bg-black/50 p-4 w-full h-20 text-center flex flex-row justify-center items-center">
            <img src={x} alt="logo" className="h-10 w-10 invert" />
            <img src={instagram} alt="logo" className="h-10 w-16 invert" />
            <img src={linkedin} alt="logo" className="h-15 w-15 invert" />
            <img src={facebook} alt="logo" className="h-12 w-12 invert" />
        </footer>
        </div>
    )
}

export default StartPage;