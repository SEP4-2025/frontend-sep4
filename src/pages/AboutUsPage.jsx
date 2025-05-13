import LogoIcon from "../assets/GrowMate_Logo_Transparent.png";



function aboutUsPage() {
  return (
    <div className="flex flex-col items-center justify-center">
        <div className="bg-green-100 rounded-full">
      <img src={LogoIcon} alt="GrowMate Logo" className="w-1/2 mx-auto mt-4 w-46 h-46"/>
        </div>
    </div>
  );
}

export default aboutUsPage;