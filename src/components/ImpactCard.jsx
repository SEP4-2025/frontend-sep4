import { useDarkMode } from '../context/DarkModeContext';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

function ImpactCard() {
    const { darkMode } = useDarkMode();
    const { ref, inView } = useInView({ triggerOnce: true });

    return (
        <div ref={ref} className={`rounded-lg p-4 mt-4 shadow-md w-1/3 mb-6 w-2/3 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
            <div className={`flex flex-col items-center p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
               <h1 className='Jacques-Francois text-2xl font-bold'>GrowMate Impact</h1>
               <div className='flex flex-row justify-between gap-6 mt-2'>
                <div className='flex flex-col items-center justify-center gap-2 p-3'>
                    <h2 className='Manrope text-2xl'>{inView && <CountUp start={0} end={1} duration={15} />}</h2>
                    <p className='Jacques-Francois'>Active Users</p>
                </div>
                <div className='flex flex-col items-center justify-center gap-2 p-3'>
                    <h2 className='Manrope text-2xl'>{inView && <CountUp start={0} end={530} duration={3} suffix="L+" />}</h2>
                    <p className='Jacques-Francois'>Water Saved</p>
                </div>
                <div className='flex flex-col items-center justify-center gap-2 p-3'>
                    <h2 className='Manrope text-2xl'>{inView && <CountUp start={0} end={230} duration={3} suffix="%" />}</h2>
                    <p className='Jacques-Francois'>Co₂ Emissions Reduced</p>
                </div>
                <div className='flex flex-col items-center justify-center gap-2 p-3'>
                    <h2 className='Manrope text-2xl'>{inView && <CountUp start={0} end={20000} duration={3} suffix="+" />}</h2>
                    <p className='Jacques-Francois'>Plants Grown</p>
                </div>
               </div>
            </div>
        </div>
    );
}

export default ImpactCard;