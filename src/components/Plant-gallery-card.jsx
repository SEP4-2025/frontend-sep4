import logo from '../assets/GrowMate_Logo_Transparent.png';


function Plant_gallery_card ({name, time, condition, suggestion}) {

    return (
        <div className="Manrope flex flex-col border border-black rounded-xl p-2">
            <img src={logo} alt="logo" className="w-30 max-w-xs h-auto block mx-auto" />
            <div className='flex flex-col'>
                <div className='flex flex-row'>
                    <div className='flex flex-col'>
                        <div>{name}</div> {/*needs real data */}
                        <div>time{time}</div> {/*needs real data */}
                    </div>
                    <div className='ml-auto'>condition{condition}</div>{/*needs real data */}
                </div>
                <div className='flex flex-col mt-3'>
                    <p className='font-bold mb-2'>Suggestion{suggestion}</p>
                    <div className='border border-black rounded-xl p-2'>Actual suggestion</div> {/*needs real data */}
                </div>
            </div>
        </div>
    )
}
export default Plant_gallery_card;