import { useDarkMode } from '../context/DarkModeContext';
import informationCardPicture from '../assets/information-card-picture.svg';

function InformationCard() {
    const { darkMode } = useDarkMode();

    return (
        <div className={`rounded-lg p-4 mt-4 shadow-md w-full md:w-2/3 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
            <div className={`flex flex-col md:flex-row items-center justify-between p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                <div className="flex flex-col gap-6 p-3 md:w-2/3">
                    <h1 className='Jacques-Francois text-3xl font-bold '>Who are we? </h1>
                    <p className='Manrope text-base'>At GrowMate, we are passionate innovators dedicated to revolutionizing home gardening through smart technology. 
                    Our team of engineers, developers, and plant enthusiasts has created a comprehensive smart greenhouse solution 
                    that makes growing plants at home effortless and sustainable. We combine cutting-edge IoT sensors, intuitive 
                    software, and ecological principles to help you nurture thriving plants while conserving resources. Our mission 
                    is to bring the joy of gardening to everyone, regardless of experience level or living space, while promoting 
                    sustainable practices for a greener future.</p>
                </div>
                <div className="flex justify-center items-center md:w-1/3 p-4">
                    <img 
                        src={informationCardPicture} 
                        alt="GrowMate information" 
                        className={`object-contain max-h-[250px] ${darkMode ? 'filter brightness-90' : ''}`} 
                    />
                </div>
            </div>
        </div>
    );
}

export default InformationCard;