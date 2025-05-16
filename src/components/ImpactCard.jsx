import { useDarkMode } from '../context/DarkModeContext';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ImpactCard() {
    const { darkMode } = useDarkMode();
    const { ref, inView } = useInView({ triggerOnce: true });

    const impactStats = [
        { id: 1, end: 1, duration: 15, suffix: "", label: "Active Users" },
        { id: 2, end: 530, duration: 3, suffix: "L+", label: "Water Saved" },
        { id: 3, end: 230, duration: 3, suffix: "%", label: "Co₂ Emissions Reduced" },
        { id: 4, end: 20000, duration: 3, suffix: "+", label: "Plants Grown" },
    ];

    const sliderSettings = {
        dots: false,
        arrows: false,
        speed: 500,
        // Default settings for desktop (static row)
        slidesToShow: impactStats.length,
        slidesToScroll: impactStats.length, // Scroll all at once if arrows were enabled
        infinite: false,
        autoplay: false, // No autoplay on desktop
        draggable: false,
        swipeToSlide: false,
        touchMove: false,
        centerMode: false,
        pauseOnHover: true, // Default behavior for desktop
        responsive: [
            {
                breakpoint: 768, // Apply below this width (mobile)
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    autoplay: true, // Enable autoplay on mobile
                    autoplaySpeed: 4000, // Time between slides on mobile (e.g., 4 seconds)
                    draggable: true,
                    swipeToSlide: true,
                    touchMove: true,
                    centerMode: true, // Center the single slide on mobile
                    centerPadding: '0px',
                    pauseOnHover: false, // Disable pause on hover for mobile to ensure continuous autoplay
                }
            }
        ]
    };

    return (
        <div ref={ref} className={`rounded-lg p-4 mt-4 shadow-md w-full md:w-2/3 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
            <div className={`flex flex-col items-center p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
               <h1 className='Jacques-Francois text-2xl font-bold mb-4'>GrowMate Impact</h1>
               <div className="w-full"> {/* Slider container */}
                    <Slider {...sliderSettings}>
                        {impactStats.map(stat => (
                            <div key={stat.id} className='flex flex-col items-center justify-center gap-1 p-3 text-center'>
                                <h2 className='Manrope text-2xl font-semibold'>
                                    {inView ? <CountUp start={0} end={stat.end} duration={stat.duration} suffix={stat.suffix} /> : `${stat.end}${stat.suffix || ''}`}
                                </h2>
                                <p className='Jacques-Francois text-sm'>{stat.label}</p>
                            </div>
                        ))}
                    </Slider>
               </div>
            </div>
        </div>
    );
}

export default ImpactCard;