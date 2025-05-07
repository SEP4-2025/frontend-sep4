import { useNavigate } from 'react-router-dom';
import background from '../assets/start_page_bg.jpeg';
import logo from '../assets/GrowMate_Logo_Transparent.png';

function StartPage () {
    return (
        <div className='h-screen w-screen bg-cover bg-center flex items-center justify-center' style={{ backgroundImage: `url(${background})` }}>
            <div className='opacity-50 bg-black h-1/2 w-1/5 rounded-xl justify-center'>
                <img src={logo} alt="logo" className='h-40 w-40' />
            </div>
        </div>
    )
}
export default StartPage;