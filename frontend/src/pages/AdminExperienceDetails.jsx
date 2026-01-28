import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaClock, FaTag, FaLanguage } from 'react-icons/fa';

const AdminExperienceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchExperience = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${API_URL}/experiences/${id}`, config);
            setExperience(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            alert('Error fetching experience');
            navigate('/admin');
        }
    };

    useEffect(() => {
        fetchExperience();
    }, [id]);

    const handleModeration = async (status) => {
        if (!window.confirm(`Are you sure you want to ${status} this experience?`)) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_URL}/admin/experiences/${id}/verify`, { status }, config);
            alert(`Experience ${status} successfully!`);
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert('Action failed');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 p-8 font-sans">
            <div className="container mx-auto max-w-4xl">
                <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium">
                    <FaArrowLeft /> Back to Dashboard
                </button>

                {/* Moderation Actions Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 sticky top-4 z-10 flex justify-between items-center">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Status</p>
                        <div className="flex items-center gap-2">
                            {experience.status === 'approved' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold uppercase flex items-center gap-2"><FaCheckCircle /> Approved</span>}
                            {experience.status === 'rejected' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold uppercase flex items-center gap-2"><FaTimesCircle /> Rejected</span>}
                            {experience.status === 'pending' && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold uppercase flex items-center gap-2">Pending Review</span>}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {experience.status !== 'rejected' && (
                            <button
                                onClick={() => handleModeration('rejected')}
                                className="px-6 py-3 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                            >
                                Reject
                            </button>
                        )}
                        {experience.status !== 'approved' && (
                            <button
                                onClick={() => handleModeration('approved')}
                                className="px-6 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
                            >
                                Approve & Publish
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Preview */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Image */}
                    <div className="h-64 w-full bg-gray-200 relative">
                        {experience.images && experience.images[0] ? (
                            <img src={experience.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg font-bold shadow-sm">
                            ${experience.price}
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><FaMapMarkerAlt className="text-primary" /> {experience.location?.city}, {experience.location?.country}</span>
                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><FaClock className="text-primary" /> {experience.duration}</span>
                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><FaTag className="text-primary" /> {experience.category}</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="text-xs font-bold text-blue-500 uppercase mb-1">Uploaded By</p>
                                <p className="font-bold text-gray-900">{experience.vendor?.name}</p>
                                <p className="text-sm text-gray-600">{experience.vendor?.email}</p>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-600 mb-8 pb-8 border-b border-gray-100">
                            <h3 className="text-gray-900 font-bold text-lg mb-2">Description</h3>
                            <p>{experience.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">Highlights</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                    {experience.highlights?.map((h, i) => <li key={i}>{h}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">Itinerary</h3>
                                <div className="space-y-4">
                                    {experience.itinerary?.map((stop, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-primary mt-1.5"></div>
                                                {i !== experience.itinerary.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1"></div>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{stop.title}</p>
                                                <p className="text-sm text-gray-600">{stop.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminExperienceDetails;
