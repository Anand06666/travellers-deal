import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaHistory, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Retrieve token safely
                const token = user?.token || localStorage.getItem('token');
                if (!token) return;

                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const { data } = await axios.get(`${API_URL}/bookings/mybookings`, config);
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Please log in to view your profile.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar: Profile Info */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center sticky top-24">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-4xl">
                                <FaUserCircle />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-6">{user.role}</p>

                            <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 py-3 rounded-xl mb-6">
                                <FaEnvelope className="text-gray-400" />
                                <span className="text-sm font-medium">{user.email}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center border-t border-gray-100 pt-6">
                                <div>
                                    <span className="block text-2xl font-bold text-gray-900">{bookings.length}</span>
                                    <span className="text-xs text-gray-400 font-medium uppercase">Bookings</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold text-gray-900">0</span>
                                    <span className="text-xs text-gray-400 font-medium uppercase">Reviews</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Bookings */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <FaHistory className="text-primary" /> Booking History
                        </h3>

                        {loading ? (
                            <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                        ) : bookings.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                                <div className="text-gray-300 text-6xl mb-4 mx-auto w-fit"><FaCalendarAlt /></div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
                                <p className="text-gray-500 mb-6">You haven't booked any experiences yet. Start exploring today!</p>
                                <a href="/experiences" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-cyan-600 transition-colors">
                                    Browse Experiences
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bookings.map((booking) => (
                                    <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 transition-transform hover:shadow-md">
                                        <div className="w-full md:w-1/3 h-48 md:h-auto rounded-xl overflow-hidden relative">
                                            <img
                                                src={booking.experience?.images?.[0] || 'https://via.placeholder.com/300x200'}
                                                alt={booking.experience?.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold uppercase text-white shadow-sm ${booking.status === 'confirmed' ? 'bg-green-500' :
                                                booking.status === 'cancelled' ? 'bg-red-500' :
                                                    'bg-yellow-500'
                                                }`}>
                                                {booking.status}
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-xl font-bold text-gray-900 line-clamp-2">{booking.experience?.title}</h4>
                                                    <span className="text-lg font-bold text-primary whitespace-nowrap">
                                                        ${booking.totalPrice}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <FaCalendarAlt className="text-gray-400" />
                                                        <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <FaUserCircle className="text-gray-400" />
                                                        <span>{booking.slots} Guest{booking.slots > 1 ? 's' : ''}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-4 border-t border-gray-50">
                                                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold transition-colors">
                                                    View Details
                                                </button>
                                                {booking.status === 'pending' && (
                                                    <button className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 py-2 rounded-lg text-sm font-semibold transition-colors">
                                                        Cancel Booking
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
