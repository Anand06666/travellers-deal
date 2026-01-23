import React, { useEffect, useState } from 'react';
import {
    FaUser, FaMoneyBillWave, FaMapMarkedAlt, FaCalendarCheck,
    FaChartLine, FaStore, FaUserClock, FaCheckCircle,
    FaSignOutAlt, FaHome, FaClipboardList
} from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        userCount: 0,
        experienceCount: 0,
        bookingCount: 0,
        totalRevenue: 0
    });
    const [vendors, setVendors] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'pending', 'verified', 'content', 'bookings'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Get Stats
                const statsRes = await axios.get(`${API_URL}/admin/stats`, config);
                setStats(statsRes.data);

                // Get Vendors
                const vendorsRes = await axios.get(`${API_URL}/admin/vendors`, config);
                setVendors(vendorsRes.data);

                // Get Experiences
                const expRes = await axios.get(`${API_URL}/admin/experiences`, config);
                setExperiences(expRes.data);

                // Get Bookings
                const bookingsRes = await axios.get(`${API_URL}/admin/bookings`, config);
                setBookings(bookingsRes.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const cards = [
        { title: 'Total Revenue', value: `$${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}`, icon: <FaMoneyBillWave />, color: 'bg-green-500' },
        { title: 'Total Bookings', value: stats.bookingCount, icon: <FaCalendarCheck />, color: 'bg-blue-500' },
        { title: 'Experiences', value: stats.experienceCount, icon: <FaMapMarkedAlt />, color: 'bg-orange-500' },
        { title: 'Registered Users', value: stats.userCount, icon: <FaUser />, color: 'bg-purple-500' },
    ];

    const filteredVendors = vendors.filter(v => {
        if (activeTab === 'pending') return !v.isVerified;
        if (activeTab === 'verified') return v.isVerified;
        return true;
    });

    const pendingExperiences = experiences.filter(e => e.status === 'pending');
    const pendingVendorsCount = vendors.filter(v => !v.isVerified).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const NavItem = ({ id, icon: Icon, label, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors ${activeTab === id
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon className="text-lg" />
                <span>{label}</span>
            </div>
            {count > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {count}
                </span>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl z-10 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                        <FaMapMarkedAlt />
                        <span>AdminPanel</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Travellers Deal</p>
                </div>

                <nav className="flex-1 py-6 space-y-1">
                    <div className="px-6 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</div>
                    <NavItem id="stats" icon={FaChartLine} label="Dashboard" />

                    <div className="px-6 pb-2 pt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</div>
                    <NavItem id="bookings" icon={FaClipboardList} label="Booking Ledger" />
                    <NavItem id="content" icon={FaCheckCircle} label="Content Moderation" count={pendingExperiences.length} />

                    <div className="px-6 pb-2 pt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Partners</div>
                    <NavItem id="pending" icon={FaUserClock} label="Pending Requests" count={pendingVendorsCount} />
                    <NavItem id="verified" icon={FaStore} label="Verified Vendors" />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 text-gray-500 hover:text-blue-600 transition-colors px-4 py-2 w-full"
                    >
                        <FaHome />
                        <span className="text-sm font-medium">Back to Home</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-20 px-8 py-4 flex justify-between items-center md:hidden">
                    <div className="font-bold text-gray-800">Admin Panel</div>
                    <button className="text-gray-500"><FaClipboardList /></button>
                </header>

                <div className="p-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'stats' && 'Dashboard Overview'}
                            {activeTab === 'bookings' && 'Global Booking Ledger'}
                            {activeTab === 'content' && 'Experience Moderation'}
                            {activeTab === 'pending' && 'Vendor Approval Queue'}
                            {activeTab === 'verified' && 'Active Vendor Partners'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Welcome back, Admin. Here is what is happening today.
                        </p>
                    </div>

                    {activeTab === 'stats' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {cards.map((card, index) => (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium mb-1">{card.title}</p>
                                            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                                        </div>
                                        <div className={`p-3 rounded-lg text-white shadow-lg ${card.color}`}>
                                            {card.icon}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <h3 className="font-bold text-gray-800 mb-4">Quick Stats</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Pending Experiences</span>
                                            <span className="font-bold text-orange-500">{pendingExperiences.length}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(pendingExperiences.length * 10, 100)}%` }}></div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-gray-600">Pending Vendors</span>
                                            <span className="font-bold text-blue-500">{pendingVendorsCount}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(pendingVendorsCount * 10, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'content' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs border-b">
                                    <tr>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Vendor</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pendingExperiences.length > 0 ? pendingExperiences.map(e => (
                                        <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{e.title}</div>
                                                <div className="text-xs text-gray-500">{e.location.city}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{e.vendor?.name}</div>
                                                <div className="text-xs text-gray-500">{e.vendor?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">${e.price}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold uppercase">Pending</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <a href={`/admin/experience/${e._id}`} className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                                    Review
                                                </a>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No pending experiences.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs border-b">
                                    <tr>
                                        <th className="px-6 py-4">Booking ID</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Experience</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookings.map(b => (
                                        <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-xs font-mono text-gray-500">#{b._id.slice(-6)}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{b.user?.name}</div>
                                                <div className="text-xs text-gray-500">{b.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{b.experience?.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(b.date).toLocaleDateString()}
                                                <div className="text-xs text-gray-400">{b.timeSlot}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">${b.totalPrice}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${b.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {b.paymentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No bookings on record.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {(activeTab === 'pending' || activeTab === 'verified') && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs border-b">
                                    <tr>
                                        <th className="px-6 py-4">Vendor</th>
                                        <th className="px-6 py-4">Business</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredVendors.length > 0 ? filteredVendors.map(v => (
                                        <tr key={v._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{v.name}</div>
                                                <div className="text-xs text-gray-500">{v.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {v.vendorDetails?.brandName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                                                {v.vendorDetails?.businessType?.replace('_', ' ') || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {v.isVerified ? (
                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold uppercase">Verified</span>
                                                ) : (
                                                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold uppercase">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <a href={`/admin/id/${v._id}`} className="inline-block bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                                                    Manage
                                                </a>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No vendors found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
