import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await fetch('http://localhost/reachout-supply-pri/reachout-supply/backend/admin_login.php', {
            // const response = await fetch('/professional/backend/admin_login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            console.log('Fetch response status:', response.status);
            console.log('Fetch response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }

            const data = await response.json();
            console.log('Backend response:', data); // Log the response

            if (data.success) {
                localStorage.setItem('isAdminLoggedIn', 'true'); // Set a flag in local storage
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (err: any) {
            setError(`An error occurred during login: ${err.message}. Please try again later.`);
            console.error('Login error:', err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
                <h3 className="text-2xl font-bold text-center">Admin Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mt-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                type="text"
                                placeholder="Username"
                                id="username"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-4 relative">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                id="password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                                style={{ top: '60%' }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </span>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        <div className="flex items-baseline justify-end mt-4">
                            <Button
                                type="submit"
                                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                            >
                                Login
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
