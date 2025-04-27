import PenLogo from '../assets/pen-icon.svg';
function NameCard() {
  return (
    <div className="border-1 border-black rounded-3xl pl-2 pb-3 pt-3 pr-2 w-2/8 mb-6 text-center flex flex-row">
      <h2 className="Jacques-Francois font-bold text-2xl">My greenhouse</h2>
      <img src={PenLogo} className="ml-auto " alt="pen logo" width="20" height="20" />
    </div>
  );
  //TODO: Make it functional
}
export default NameCard;