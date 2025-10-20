import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (isLoggedIn !== 'true') {
            navigate('/admin'); // Redirect to login if not logged in
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn'); // Clear login flag
        navigate('/admin'); // Redirect to login page
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
                <p className="mt-4 text-center">Welcome to the admin dashboard!</p>
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={handleLogout}
                        className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}
