function LoadingScreen(){
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="loader border-t-4 border-b-4 border-green-500 rounded-full w-32 h-32 mb-4 animate-spin spin-slow"></div>
            <div className="text-green-700 font-medium flex">
                <p>Loading your greenhouse data </p>
                <span className="dots-1">.</span>
                <span className="dots-2">.</span>
                <span className="dots-3">.</span>
            </div>
        </div>
    );
}

export default LoadingScreen;