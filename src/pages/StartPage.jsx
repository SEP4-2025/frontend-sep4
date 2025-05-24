import { useNavigate } from 'react-router-dom';

import background from '../assets/start-page-background.jpg';
import logo from '../assets/GrowMate_Logo_Transparent.png';
import x from '../assets/twitter-icon.svg';
import linkedin from '../assets/linkedin-icon.svg';
import instagram from '../assets/instagram-icon.svg';
import facebook from '../assets/facebook-icon.svg';

function StartPage () {
    const navigate = useNavigate();

    function goToLogin() {
        navigate('/loginPage');
    }

    return (
        <div className="h-screen w-screen bg-cover bg-center flex flex-col justify-between" style={{ backgroundImage: `url(${background})` }}>
            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="flex justify-center p-3 items-center flex-col bg-black/70 backdrop-blur-md sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/5 rounded-xl gap-3">
                    <div className="bg-amber-100 rounded-full w-1/2 mt-8">
                        <img src={logo} alt="logo" className="w-full max-w-xs h-auto" />
                    </div>
                    <p className="text-white Jacques-Francois sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">GrowMate</p>
                    <button onClick={goToLogin} className="Manrope w-full bg-[#4a8c3d]/20 hover:bg-[#4a8c3d] text-white py-2 px-4 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                        Get Started
                    </button>
                    <hr className="border-t border-white/50 my-2 h-px w-full"></hr>
                    <div className='p-4 w-full h-20 text-center flex flex-row justify-center items-center gap-6'>
                        <img src={x} alt="logo" className="h-10 w-10 invert" />
                        <img src={instagram} alt="logo" className="h-10 w-10 invert" />
                        <img src={linkedin} alt="logo" className="h-10 w-10 invert" />
                        <img src={facebook} alt="logo" className="h-12 w-10 invert" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StartPage;