import temperatureIcon from '../assets/solar--temperature-bold.svg';

function Notification_card({notification}) {
    return (
    <div className="border border-gray-400 rounded-xl p-2 bg-white w-full flex flex-col z-51 mb-2">
        <div className="flex justify_start">
            <img src={temperatureIcon} alt="temperature icon" width="23" height="2" />
                <div className='text-left pl-2'>
                    <p className="text-lg font-semibold text-black">{notification?.type || "No type available"}</p>
                    <p className="text-sm text-gray-600">{notification?.message || "No message available"}</p>
                </div>
        </div>
        <div className="text-xs text-gray-400 mt-2">{notification?.timeStamp || "No time available"}</div>
    </div>
    
    )}

export default Notification_card;

