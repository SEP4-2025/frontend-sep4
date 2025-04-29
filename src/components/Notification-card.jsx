import temperatureIcon from '../assets/solar--temperature-bold.svg';

function Notification_card() {

    return (
    <div className="border border-gray-400 rounded-xl p-2 bg-white w-full flex flex-col z-51 mb-2">
        <div className="flex justify_start">
            <img src={temperatureIcon} alt="temperature icon" width="23" height="2" />
                <div className='text-left pl-2'>
                    <p className="text-lg font-semibold text-black">Temperature warning</p>
                    <p className="text-sm text-gray-600">Temperature exceeded normal level</p>
                </div>
        </div>
        <div className="text-xs text-gray-400 mt-2">Today, 08:15 AM</div>
    </div>
    
    )}

export default Notification_card;

