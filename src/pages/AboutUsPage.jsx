import MobileHeader from '../components/MobileHeader';
import LogoIcon from "../assets/GrowMate_Logo_Transparent.png";
import { useDarkMode } from "../context/DarkModeContext";
import InformationCard from "../components/InformationCard";
import ReasonCard from "../components/ReasonCard";
import ImpactCard from "../components/ImpactCard";
import TeamCarouselCard from "../components/TeamCarouselCard";
import LeafIcon from "../assets/leaf-icon.svg";
import ClockIcon from "../assets/clock-icon.svg";
import DatabaseIcon from "../assets/database-icon.svg";

function AboutUsPage({ toggleMobileNav }) {
    const { darkMode } = useDarkMode();

    return (
        <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Mobile Header */}
            <MobileHeader toggleMobileNav={toggleMobileNav} title="About Us" />

            <main className="flex-grow overflow-y-auto flex flex-col items-center px-4 py-6">
                {/* Logo Section */}
                <div className={`rounded-full p-4 ${darkMode ? 'bg-slate-600' : 'bg-navbar-color'} flex items-center justify-center`}>
                    <img src={LogoIcon} alt="GrowMate Logo" className="w-32 h-32" />
                </div>

                {/* Title Section */}
                <h1 className="Jacques-Francois pt-4 text-3xl text-center">About GrowMate</h1>
                <h3 className="Jacques-Francois text-center">Smart, convenient, easy to use</h3>

                {/* Information Section */}
                <InformationCard />
                <div className={`border-b w-4/5 mx-auto my-4 ${darkMode ? 'border-gray-600' : 'border-black'}`} />

                {/* Why GrowMate Section */}
                <h2 className="text-2xl Jacques-Francois text-center">Why GrowMate?</h2>
                <div className="flex flex-col lg:flex-row gap-4 justify-center items-center w-full mt-4">
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

                {/* Impact Section */}
                <ImpactCard />

                {/* Team Section */}
                <h1 className="Jacques-Francois text-3xl font-bold mt-4 text-center">Meet our Team</h1>
                <TeamCarouselCard />

                {/* Contact Section */}
                <div className="flex flex-col items-center justify-center w-full lg:w-3/5 mt-4 mb-6">
                    <h1 className="Jacques-Francois text-3xl font-bold my-4 text-center">Contact Us!</h1>
                    <p className="Manrope text-lg text-center">
                        Have questions about our smart greenhouse solution? Reach out to our team for support, partnership opportunities, or to learn more about how GrowMate can transform your gardening experience.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default AboutUsPage;