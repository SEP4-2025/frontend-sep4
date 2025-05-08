import logo from '../assets/GrowMate_Logo_Transparent.png';
import React from "react";

//dummy data
const allPlants = [
    { id: 1, name: "Basil" },
    { id: 2, name: "Mint" },
    { id: 3, name: "Rosemary" },
];

function PlantViewPopup ({ plant, onClose }) {
    if (!plant) return null;
  
    return (
      <div className="fixed inset-0 z-50 bg-opacity-50 flex justify-center items-center">
        <div className="aboslute right bg-white p-6 rounded-lg shadow-lg max-w-sm ">
            <img src={logo} alt="logo" className="w-40 max-w-xs h-auto mx-auto" /> {/*replace with the actual image */}
            <div className='flex flex-row flex-wrap md:flex-row sm:flex-col'>
                <div className='text-left w-1/3'>Date</div> {/*add functionality here */}
                <h2 className="text-xl font-bold mb-4 text-center w-1/3">{plant.name}</h2>
                <div className='text-right w-1/3'>Condition</div> {/*add functionality here */}
            </div>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col w-1/2'>
                <p>Suggestion</p>
                <div className='border border-black rounded-xl p-2'>Actual suggestion</div>
            </div>
            <div className='flex flex-col w-1/2'>
                <p>Note</p>
                <input
                    type="text"
                    id="note"
                    className="border border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Add note"
                />
            </div>
          </div>
          <div className='text-center'>
          <button
            className="mt-4 text-red-500"
            onClick={onClose}
          >
            Close
          </button>
          </div>
        </div>
      </div>
    );
  }

export default PlantViewPopup;