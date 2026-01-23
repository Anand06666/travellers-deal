import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config/api';

const ExperienceCard = ({ experience }) => {
    const { user, refreshUser } = useContext(AuthContext);

    // Check if in wishlist (handle populated or objectId array)
    const isInWishlist = user?.wishlist?.some(item =>
        (typeof item === 'string' ? item : item._id) === experience._id
    );

    const toggleWishlist = async (e) => {
        e.preventDefault(); // Prevent link navigation
        if (!user) {
            alert("Please login to add to wishlist");
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')} ` }
            };

            if (isInWishlist) {
                await axios.delete(`${API_URL} /users/wishlist / ${experience._id} `, config);
            } else {
                await axios.post(`${API_URL} /users/wishlist / ${experience._id} `, {}, config);
            }
            refreshUser();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Link to={`/ experience / ${experience._id} `} className="block group">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col relative">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={experience.images && experience.images.length > 0 ? `${API_URL.replace('/api', '')}${experience.images[0]} ` : 'https://via.placeholder.com/400x300'}
                        alt={experience.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                        onClick={toggleWishlist}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 transition-colors z-10"
                    >
                        {isInWishlist ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    </button>
                    {experience.category && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-bold backdrop-blur-sm">
                            {experience.category}
                        </span>
                    )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-yellow-500 text-sm">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < Math.floor(experience.rating || 0) ? "text-yellow-400" : "text-gray-300"} />
                            ))}
                        </div>
                        <span className="text-gray-500 text-xs">({experience.reviewsCount || 0})</span>
                        <span className="text-gray-400 text-xs mx-1">•</span>
                        <span className="text-gray-500 text-xs">{experience.duration}</span>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {experience.title}
                    </h3>

                    <div className="mt-auto flex items-end justify-between">
                        <div className="text-gray-500 text-xs text-left">Free cancellation available</div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500">From</div>
                            <div className="font-bold text-lg text-gray-900">
                                {experience.currency === 'INR' ? '₹' : '$'}{experience.price}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ExperienceCard;
