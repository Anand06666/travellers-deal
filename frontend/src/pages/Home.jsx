import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import ExperienceCard from '../components/ExperienceCard';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [date, setDate] = useState('');
    const [featuredExperiences, setFeaturedExperiences] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                // Fetch top 4 experiences for the homepage
                const { data } = await axios.get(`${API_URL}/experiences?pageNumber=1`);
                setFeaturedExperiences(data.experiences ? data.experiences.slice(0, 8) : []);

                // Fetch top destinations
                const { data: destData } = await axios.get(`${API_URL}/experiences/destinations`);
                setDestinations(destData);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/experiences?keyword=${searchTerm}`);
    };

    return (
        <div className="pb-20 bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
                        alt="Travel Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 w-full max-w-4xl px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg leading-tight">
                        Unforgettable experiences<br />waiting for you
                    </h1>

                    <form onSubmit={handleSearch} className="bg-white p-3 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center max-w-3xl mx-auto transform transition-transform hover:scale-[1.01]">
                        <div className="flex-1 flex items-center px-4 py-3 w-full border-b md:border-b-0 md:border-r border-gray-200">
                            <FaSearch className="text-gray-400 text-xl mr-3" />
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                className="w-full outline-none text-gray-700 text-lg placeholder-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4 py-3 w-full hidden md:flex">
                            <FaCalendarAlt className="text-gray-400 text-xl mr-3" />
                            <input
                                type="date"
                                className="w-full outline-none text-gray-700 text-lg bg-transparent"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-primary hover:bg-red-600 text-white text-lg font-bold px-8 py-3 rounded-2xl md:rounded-full transition-all m-1 w-full md:w-auto shadow-md">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white py-12 border-b border-gray-100">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-primary font-bold text-lg">Free cancellation</h3>
                        <p className="text-gray-600 text-sm">Stay flexible on your trip.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-primary font-bold text-lg">Experiences for every traveler</h3>
                        <p className="text-gray-600 text-sm">Tours, day trips, and more.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-primary font-bold text-lg">Quality you can trust</h3>
                        <p className="text-gray-600 text-sm">5-star rated experiences.</p>
                    </div>
                </div>
            </div>

            {/* Popular Experiences */}
            <div className="container mx-auto px-6 mt-16">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Rated Experiences</h2>
                        <p className="text-gray-500">Unforgettable activities for your next trip</p>
                    </div>
                    <Link to="/experiences" className="text-primary font-bold hover:text-red-600 transition-colors flex items-center gap-1">
                        See all <span className="text-xl">›</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="bg-white rounded-xl h-80 animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredExperiences.length > 0 ? (
                            featuredExperiences.map(exp => (
                                <ExperienceCard key={exp._id} experience={exp} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center">
                                <p className="text-gray-500 text-lg">No experiences available at the moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Top Destinations */}
            <div className="container mx-auto px-6 mt-20 mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Destinations</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {destinations.length > 0 ? (
                        destinations.slice(0, 6).map(dest => (
                            <Link to={`/experiences?keyword=${dest.city}`} key={dest.city} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer block shadow-sm">
                                <img
                                    src={dest.image || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=400&text=${dest.city}`}
                                    alt={dest.city}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => e.target.src = 'https://placehold.co/400x300?text=City'}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                                    <h3 className="text-white font-bold text-lg">{dest.city}</h3>
                                    <span className="text-white/80 text-xs mt-1">{dest.count} Activities</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        [1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
                        ))
                    )}
                </div>
            </div>

            {/* Newsletter / CTA Section (Optional but good for GYG vibe) */}
            <div className="bg-secondary text-white py-16 mt-20">
                <div className="container mx-auto px-6 text-center max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4">Your travel journey starts here</h2>
                    <p className="text-gray-400 mb-8">Sign up for travel tips, personalized itineraries, and vacation inspiration.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input type="email" placeholder="Your email" className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none" />
                        <button className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transition-colors">Sign up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
