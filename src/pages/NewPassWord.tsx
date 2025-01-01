import React, { useState } from 'react';

const SetNewPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSetPassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long!');
            return;
        }

        setError('');
        console.log(`New Password Set: ${password}`);
        // Add logic to update the password in the backend
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form
                onSubmit={handleSetPassword}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Set New Password</h2>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    Enter your new password below.
                </p>
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                        {error}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        required
                        placeholder="Enter new password"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        required
                        placeholder="Confirm new password"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    Set Password
                </button>
            </form>
        </div>
    );
};

export default SetNewPasswordPage;
