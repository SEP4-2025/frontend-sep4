import LogoIcon from "../assets/GrowMate_Logo_Transparent.png";
import { useDarkMode } from "../context/DarkModeContext";
import InformationCard from "../components/InformationCard";
import ReasonCard from "../components/ReasonCard";
import ImpactCard from "../components/ImpactCard";
import TeamCarouselCard from "../components/TeamCarouselCard";
import LeafIcon from "../assets/leaf-icon.svg";
import ClockIcon from "../assets/clock-icon.svg";
import DatabaseIcon from "../assets/database-icon.svg";


function AboutUsPage() {

    const { darkMode } = useDarkMode();

    return (
        <div className={`flex flex-col items-center justify-center w-full min-h-full pt-6  ${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-full ${darkMode ? 'bg-slate-600' : 'bg-navbar-color'}`}>
                <img src={LogoIcon} alt="GrowMate Logo" className='mx-auto mt-4 w-46 h-46' />
            </div>
            <h1 className="Jacques-Francois pt-4 text-3xl">About GrowMate</h1>
            <h3 className="Jacques-Francois">Smart, convinient, easy to use</h3>
            <InformationCard />
            <div className={`border-b w-4/5 mx-auto my-4 ${darkMode ? 'border-gray-600' : 'border-black'}`} />
            <h2 className='text-2xl Jacques-Francois'>Why GrowMate?</h2>
            <div className="flex flex-row gap-4 justify-between items-between w-full mt-4">
                <ReasonCard
                    icon={LeafIcon}
                    title="Eco-Friendly"
                    description="GrowMate optimizes water usage and energy consumption through smart sensors and efficient systems. Our materials are sustainably sourced, and our designs minimize environmental impact while maximizing plant growth."
                />
                <ReasonCard
                    icon={ClockIcon}
                    title="Efficient"
                    description="Let GrowMate handle the complex aspects of plant care automatically. Our automated watering, climate control, and monitoring systems reduce maintenance time by up to 70%, giving you more time to enjoy your plants."
                />
                <ReasonCard
                    icon={DatabaseIcon}
                    title="Data-Driven"
                    description="Make informed decisions with GrowMate's comprehensive analytics. Our system collects real-time data on soil moisture, temperature, light, and humidity to optimize growing conditions and provide actionable insights for healthier plants."
                />
            </div>
            <ImpactCard />
            <h1 className='Jacques-Francois text-3xl font-bold mt-4'>Meet our Team</h1>
            <TeamCarouselCard />
            <div className='flex flex-col items-center justify-center w-3/5 mt-4 mb-6'>
                <h1 className='Jacques-Francois text-3xl font-bold my-4'>Contact Us!</h1>
                <p className='Manrope text-lg text-center'>Have questions about our smart greenhouse solution? Reach out to our team for support, partnership opportunities, or to learn more about how GrowMate can transform your gardening experience</p>
            </div>
        </div>
    );
}

export default AboutUsPage;