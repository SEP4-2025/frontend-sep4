import { useState } from 'react';

function PasswordResetForm({ onShowLogin }) { 
    const [username, setUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(""); 
    const [isLoading, setIsLoading] = useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); 

        if (!username || !oldPassword || !newPassword || !confirmPassword) { 
            setMessage("Please fill in all fields, including your username.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("https://webapi-service-68779328892.europe-north2.run.app/auth/change-password", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    oldPassword: oldPassword, 
                    newPassword: newPassword,
                    repeatNewPassword: confirmPassword
                })
            });

            const responseText = await response.text(); 

            if (response.ok) {
                setMessage("Password changed successfully! You can now log in with your new password.");
                setUsername("");
                setOldPassword(""); 
                setNewPassword("");
                setConfirmPassword("");
            } else {
                let errorDetail = responseText;
                try {
                    const errorJson = JSON.parse(responseText);
                    errorDetail = errorJson.message || errorJson.title || responseText;
                } 
                // eslint-disable-next-line no-unused-vars
                catch (_jsonError) { 
                    // Ignore if not JSON, use text as is
                }
                setMessage(`Error: ${response.status} - ${errorDetail}`);
            }
        } catch (error) {
            console.error("Password change error:", error);
            setMessage("Could not connect to the server or an unexpected error occurred.");
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col bg-white gap-4 p-6 rounded-lg w-full max-w-sm'> 
            <h2 className="text-xl font-semibold text-center mb-4">Change Password</h2> 
            
            {message && (
                <p className={`text-sm p-3 rounded-md mb-2 ${message.startsWith('Error:') || message.startsWith('Could not connect') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </p>
            )}

            <div>
                <label htmlFor="change-username" className="block text-sm font-medium text-gray-700">Username</label> 
                <input
                    type="text"
                    id="change-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your username"
                    required
                    disabled={isLoading}
                />
            </div>

            <div>
                <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">Current Password</label> 
                <input
                    type="password"
                    id="old-password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your current password"
                    required
                    disabled={isLoading}
                />
            </div>
            
            <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                />
            </div>

            <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                />
            </div>

            <button
                type="submit"
                className="Manrope bg-[#282828] hover:bg-gray-500 text-white py-2 px-4 rounded w-full mt-2 disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? 'Changing Password...' : 'Change Password'} 
            </button>
            <button
                type="button"
                onClick={onShowLogin}
                className="mt-2 text-sm text-blue-600 underline hover:text-blue-800 text-center w-full disabled:opacity-50"
                disabled={isLoading}
            >
                Back to Login
            </button>
        </form>
    );
}

export default PasswordResetForm;
