import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import MemberIcon from "../assets/member-icon.svg";
import { useDarkMode } from "../context/DarkModeContext";

function TeamCarouselCard() {
    const { darkMode } = useDarkMode();

     const NextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} ${darkMode ? 'dark-arrow-next' : 'light-arrow-next'}`}
                style={{ ...style }}
                onClick={onClick}
            />
        );
    };
    
    const PrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} ${darkMode ? 'dark-arrow-prev' : 'light-arrow-prev'}`}
                style={{ ...style }}
                onClick={onClick}
            />
        );
    };
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "0",
        autoplay: true,
        autoplaySpeed: 10000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const teamMembers = [
        { name: "Andreea Caisim", description: "IOT team member" },
        { name: "Dario Montes", description: "Frontend warrior" },
        { name: "Darja Jefremova", description: "IOT team member" },
        { name: "Dimitar Asenov Nizamov", description: "IOT team member" },
        { name: "Jakub Abramek", description: "Frontend warrior" },
        { name: "Maciej Matuszewski", description: "Backend team member" },
        { name: "Mario Cuellar Prieto", description: "Frontend warrior" },
        { name: "Mario-Adrian Vlad", description: "Backend team member" },
        { name: "Marius Marcoci", description: "IOT team member" },
        { name: "Mateusz Samborski", description: "Frontend warrior" },
        { name: "Plamen Plamenov Michev", description: "IOT team member" },
        { name: "Romans Mihalonoks", description: "Backend team member" },
        { name: "Samuel Kacenga", description: "Backend team member" },
    ];

    return (
        <div className={`rounded-lg p-4 mt-4 shadow-md w-1/3 mb-6 w-2/3 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
            <div className={`p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <Slider {...settings}>
                        {teamMembers.map((member, index) => (
                            <div key={index} className="flex flex-col items-center justify-center text-center mt-6">
                                <img
                                    src={MemberIcon}
                                    alt={member.name}
                                    className="rounded-full w-28 h-28 mb-2 mx-auto "
                                />
                                <h3 className="Jacques-Francois text-xl">{member.name}</h3>
                                <p className="Jacques-Francois text-sm">{member.description}</p>
                            </div>
                        ))}
                    </Slider>
            </div>
        </div>
    );
}
export default TeamCarouselCard;