import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUserShield, FaLock } from 'react-icons/fa';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            // The useEffect will handle the redirect once user state is updated
            // But we can also check here if we want immediate feedback before state update propagates
            // However, reliance on AuthContext state update is safer for consistency
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-900">
                        <FaUserShield size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
                    <p className="text-gray-500">Secure access for administrators only</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm font-medium border-l-4 border-red-500">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUserShield className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                                placeholder="admin@travellersdeal.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                            </div>
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Access Dashboard
                    </button>

                    <div className="text-center mt-4">
                        <a href="/" className="text-sm text-gray-500 hover:text-gray-900">Return to Website</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
