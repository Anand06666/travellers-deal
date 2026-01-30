import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { FaStar, FaMapMarkerAlt, FaClock, FaCheck, FaInfoCircle, FaCalendarAlt, FaUserFriends, FaGlobe, FaMobileAlt, FaTimes, FaUtensils } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const ExperienceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const [experience, setExperience] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [guests, setGuests] = useState(1);
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');

    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    // Availability State
    const [availability, setAvailability] = useState({});
    const [fetchingAvailability, setFetchingAvailability] = useState(false);

    useEffect(() => {
        const fetchExperienceAndReviews = async () => {
            try {
                const { data: expData } = await axios.get(`${API_URL}/experiences/${id}`);
                setExperience(expData);

                // Fetch reviews
                try {
                    const { data: reviewsData } = await axios.get(`${API_URL}/reviews/${id}`);
                    setReviews(reviewsData);
                } catch (reviewErr) {
                    console.error('Error fetching reviews:', reviewErr);
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load experience details.');
                setLoading(false);
            }
        };
        fetchExperienceAndReviews();
    }, [id]);

    useEffect(() => {
        if (date && id) {
            const fetchAvailability = async () => {
                setFetchingAvailability(true);
                try {
                    const { data } = await axios.get(`${API_URL}/experiences/${id}/availability?date=${date}`);
                    setAvailability(data.availability || {});
                } catch (err) {
                    console.error('Failed to fetch availability', err);
                } finally {
                    setFetchingAvailability(false);
                }
            };
            fetchAvailability();
        } else {
            setAvailability({});
        }
    }, [date, id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to review');

        setSubmittingReview(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post(`${API_URL}/reviews`, {
                experienceId: id,
                rating: reviewRating,
                comment: reviewComment
            }, config);

            // Refresh reviews
            const { data: reviewsData } = await axios.get(`${API_URL}/reviews/${id}`);
            setReviews(reviewsData);
            setReviewComment('');
            setSubmittingReview(false);
            alert('Review submitted successfully!');
        } catch (error) {
            console.error(error);
            setSubmittingReview(false);
            alert(error.response?.data?.message || 'Failed to submit review. Have you booked this experience?');
        }
    };

    const NavigateToCheckout = () => {
        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }

        if (!date) {
            alert('Please select a date');
            return;
        }

        if (experience.timeSlots && experience.timeSlots.length > 0 && !timeSlot) {
            alert('Please select a start time');
            return;
        }

        navigate('/checkout', {
            state: {
                amount: experience.price * guests,
                experienceTitle: experience.title,
                currency: experience.currency || 'USD',
                experienceId: experience._id,
                date: date,
                slots: guests,
                timeSlot: timeSlot
            }
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!experience) return <div className="min-h-screen flex items-center justify-center">Experience not found</div>;

    const currencySymbol = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'AED': 'AED ', 'JPY': '¥'
    }[experience.currency] || '$';

    // Calculate rating from reviews explicitly if backend doesn't sync perfectly immediately
    const displayRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : (experience.rating || 4.8);

    const displayCount = reviews.length > 0 ? reviews.length : experience.reviewsCount || 0;

    return (
        <div className="bg-white min-h-screen pb-20 font-sans text-gray-800">
            {/* Header / Breadcrumbs Area */}
            <div className="container mx-auto px-4 pt-28 pb-4">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="hover:underline cursor-pointer">Home</span> <span className="mx-2">›</span>
                    <span className="hover:underline cursor-pointer">{experience.location?.country || 'Country'}</span> <span className="mx-2">›</span>
                    <span className="hover:underline cursor-pointer">{experience.location?.city || 'City'}</span> <span className="mx-2">›</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{experience.title}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <span className="uppercase text-xs font-bold text-red-500 tracking-wider">Originals by Travellers Deal</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">{experience.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => <FaStar key={i} className={i < Math.floor(displayRating) ? "" : "text-gray-300"} />)}
                        <span className="font-bold text-gray-900 ml-1">{displayRating}</span>
                        <span className="text-gray-500 underline decoration-gray-300 underline-offset-2 ml-1 cursor-pointer">({displayCount} reviews)</span>
                    </div>
                    <span className="hidden md:inline">•</span>
                    <span>Activity provider: <span className="font-medium text-gray-900 underline cursor-pointer">Travellers Deal Verified</span></span>
                </div>
            </div>

            {/* Image Gallery Grid */}
            <div className="container mx-auto px-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[450px] rounded-2xl overflow-hidden relative group">
                    {/* Main Image */}
                    <div className="md:col-span-2 h-full relative cursor-pointer">
                        <img src={experience.images?.[0] ? (experience.images[0].startsWith('http') ? experience.images[0] : `${API_URL.replace('/api', '')}${experience.images[0]}`) : 'https://placehold.co/800x600?text=No+Image'} alt={experience.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    {/* Side Images */}
                    <div className="hidden md:block h-full cursor-pointer">
                        <img src={experience.images?.[1] ? (experience.images[1].startsWith('http') ? experience.images[1] : `${API_URL.replace('/api', '')}${experience.images[1]}`) : (experience.images?.[0] ? (experience.images[0].startsWith('http') ? experience.images[0] : `${API_URL.replace('/api', '')}${experience.images[0]}`) : 'https://placehold.co/400x300?text=Image+2')} alt="Gallery 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="hidden md:flex flex-col gap-2 h-full">
                        <div className="flex-1 overflow-hidden cursor-pointer">
                            <img src={experience.images?.[2] ? (experience.images[2].startsWith('http') ? experience.images[2] : `${API_URL.replace('/api', '')}${experience.images[2]}`) : (experience.images?.[0] ? (experience.images[0].startsWith('http') ? experience.images[0] : `${API_URL.replace('/api', '')}${experience.images[0]}`) : 'https://placehold.co/400x300?text=Image+3')} alt="Gallery 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 overflow-hidden cursor-pointer relative">
                            <img src={experience.images?.[3] ? (experience.images[3].startsWith('http') ? experience.images[3] : `${API_URL.replace('/api', '')}${experience.images[3]}`) : (experience.images?.[0] ? (experience.images[0].startsWith('http') ? experience.images[0] : `${API_URL.replace('/api', '')}${experience.images[0]}`) : 'https://placehold.co/400x300?text=Image+4')} alt="Gallery 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            <button className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <FaCalendarAlt /> View photos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-10">

                    {/* About this activity */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About this activity</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-6 mt-1 flex justify-center"><FaCheck className="text-green-600" /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Free cancellation</h4>
                                    <p className="text-sm text-gray-600">Cancel up to 24 hours in advance for a full refund</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-6 mt-1 flex justify-center"><FaCalendarAlt className="text-gray-700" /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Reserve now & pay later</h4>
                                    <p className="text-sm text-gray-600">Keep your travel plans flexible — book your spot and pay nothing today.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-6 mt-1 flex justify-center"><FaClock className="text-gray-700" /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Duration {experience.duration}</h4>
                                    <p className="text-sm text-gray-600">Check availability to see starting times.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-6 mt-1 flex justify-center"><FaUserFriends className="text-gray-700" /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Live tour guide</h4>
                                    <p className="text-sm text-gray-600">{experience.languages?.join(', ') || 'English'}</p>
                                </div>
                            </div>
                            {experience.privateGroup && (
                                <div className="flex items-start gap-4">
                                    <div className="w-6 mt-1 flex justify-center"><FaUserFriends className="text-gray-700" /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">Private group available</h4>
                                        <p className="text-sm text-gray-600">This experience can be booked for a private group.</p>
                                    </div>
                                </div>
                            )}
                            {experience.dietaryOptions?.length > 0 && (
                                <div className="flex items-start gap-4">
                                    <div className="w-6 mt-1 flex justify-center"><FaUtensils className="text-gray-700" /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">Dietary options available</h4>
                                        <p className="text-sm text-gray-600">{experience.dietaryOptions.join(', ')}. Please inform the provider of any dietary needs when booking.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Experience Description */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>

                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-3 text-lg">Highlights</h3>
                            <ul className="grid gap-2">
                                {experience.highlights?.map((highlight, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2.5 flex-shrink-0"></div>
                                        <span className="text-gray-700 leading-relaxed">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-3 text-lg">Full description</h3>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {experience.description}
                            </div>
                        </div>

                        {/* Includes */}
                        {(experience.includes?.length > 0 || experience.notSuitableFor?.length > 0) && (
                            <div className="mt-8">
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">Includes</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
                                    {experience.includes?.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700 text-sm">{item}</span>
                                        </div>
                                    ))}
                                    {experience.notSuitableFor?.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3 opacity-75">
                                            <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700 text-sm line-through decoration-gray-400">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Meeting Point */}
                    {experience.meetingPoint && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Meeting point</h2>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gray-100 rounded-lg text-gray-600"><FaMapMarkerAlt size={20} /></div>
                                <div>
                                    <p className="text-gray-700 font-medium mb-1">{experience.meetingPoint}</p>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(experience.meetingPoint)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary font-bold text-sm underline hover:no-underline flex items-center gap-1"
                                    >
                                        Open in Google Maps <FaGlobe size={12} />
                                    </a>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Reviews Section */}
                    <section className="pt-8 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Customer Reviews
                            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{reviews.length}</span>
                        </h2>

                        {/* Write Review Form - Only if logged in */}
                        {user && (
                            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4">Write a review</h3>
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="flex items-center gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`cursor-pointer text-xl ${star <= reviewRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                                onClick={() => setReviewRating(star)}
                                            />
                                        ))}
                                    </div>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Share your experience with others..."
                                        rows="3"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-primary outline-none mb-3"
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="bg-primary text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-cyan-700 transition disabled:opacity-50"
                                    >
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="space-y-6">
                            {reviews.length === 0 ? (
                                <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{review.user?.name || 'Traveler'}</h4>
                                                <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex text-yellow-500 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < review.rating ? "" : "text-gray-200"} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Important Information */}
                    {(experience.whatToBring?.length > 0 || experience.knowBeforeYouGo?.length > 0) && (
                        <section className="pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important information</h2>

                            {experience.whatToBring?.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-bold text-gray-900 text-sm mb-2">What to bring</h4>
                                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-1">
                                        {experience.whatToBring.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            )}

                            {experience.knowBeforeYouGo?.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-2">Know before you go</h4>
                                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-1">
                                        {experience.knowBeforeYouGo.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Check Availability Section (New Premium UI) */}
                    <section className="pt-8 border-t border-gray-100" id="availability-section">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Check availability</h2>

                        {/* Date Selector Row */}
                        {/* Date & Participants Selector Row */}
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            {/* Date Picker */}
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide flex-1">
                                <div className="flex-shrink-0 w-16 h-20 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors relative">
                                    <FaCalendarAlt className="text-gray-700 text-xl mb-1" />
                                    <input
                                        type="date"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setDate(e.target.value)}
                                        value={date} // Ensure value is bound
                                    />
                                </div>
                                {[...Array(7)].map((_, i) => {
                                    const d = new Date();
                                    d.setDate(d.getDate() + i);
                                    const dateString = d.toISOString().split('T')[0];
                                    const isSelected = date === dateString;
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => setDate(dateString)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center cursor-pointer border transition-all ${isSelected ? 'bg-primary text-white border-primary shadow-lg ring-2 ring-primary ring-offset-2' : 'bg-white border-gray-200 hover:border-primary text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            <span className="text-xs font-medium uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                            <span className="text-xl font-bold">{d.getDate()}</span>
                                            <span className="text-xs">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Participants Selector */}
                            <div className="flex-shrink-0 w-full md:w-48 bg-gray-50 rounded-xl border border-gray-200 p-4">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Participants</label>
                                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-2">
                                    <button
                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-colors font-bold text-lg"
                                    >-</button>
                                    <span className="font-bold text-gray-900 text-lg">{guests}</span>
                                    <button
                                        onClick={() => setGuests(guests + 1)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-colors font-bold text-lg"
                                    >+</button>
                                </div>
                            </div>
                        </div>

                        {/* Options / Time Slots List */}
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Choose from {experience.timeSlots?.length || 0} options</h3>

                        {!date ? (
                            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
                                <FaCalendarAlt className="mx-auto text-3xl mb-2 opacity-50" />
                                Please select a date to see available times.
                            </div>
                        ) : experience.timeSlots?.length > 0 ? (
                            <div className="space-y-4">
                                {experience.timeSlots.map((slot, index) => {
                                    const available = availability[slot] !== undefined ? availability[slot] : experience.capacity;
                                    const isFull = available <= 0;
                                    const isSelected = timeSlot === slot;

                                    // Create a specific checkout handler for this card
                                    const handleBookThisSlot = () => {
                                        if (!user) {
                                            navigate('/login', { state: { from: location } });
                                            return;
                                        }
                                        navigate('/checkout', {
                                            state: {
                                                amount: experience.price * guests,
                                                experienceTitle: experience.title,
                                                currency: experience.currency || 'USD',
                                                experienceId: experience._id,
                                                date: date,
                                                slots: guests,
                                                timeSlot: slot
                                            }
                                        });
                                    };

                                    return (
                                        <div
                                            key={index}
                                            className={`bg-white border rounded-2xl p-6 transition-all hover:shadow-md ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-gray-200'}`}
                                        >
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="space-y-3 flex-1">
                                                    <div>
                                                        <h4 className="text-xl font-extrabold text-gray-900 mb-1">{slot} {experience.title}</h4>
                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1.5"><FaClock /> {experience.duration}</div>
                                                            <div className="flex items-center gap-1.5"><FaUserFriends /> Guide: {experience.languages?.[0] || 'English'}</div>
                                                        </div>
                                                    </div>

                                                    {experience.meetingPoint && (
                                                        <div className="flex items-start gap-2 text-sm text-gray-600">
                                                            <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-gray-400" />
                                                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(experience.meetingPoint)}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                                                                {experience.meetingPoint}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-4 min-w-[200px]">
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500 mb-1">From</div>
                                                        <div className="text-2xl font-extrabold text-gray-900">{currencySymbol}{experience.price}</div>
                                                        <div className="text-xs text-gray-500">per person</div>
                                                    </div>

                                                    <button
                                                        onClick={handleBookThisSlot}
                                                        disabled={isFull}
                                                        className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all ${isFull ? 'bg-gray-300 cursor-not-allowed shadow-none text-white' : 'bg-primary text-white hover:bg-cyan-600 shadow-lg shadow-cyan-200 transform active:scale-95'}`}
                                                    >
                                                        {isFull ? 'Sold Out' : 'Book Now'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Footer of Card */}
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaCheck className="text-green-500" /> Free cancellation
                                                </div>
                                                {available < 10 && available > 0 && <span className="text-red-500 font-bold text-xs">{available} spots left</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">No time slots configured for this experience.</div>
                        )}
                    </section>
                </div>

                {/* Right Column: Sidebar Booking */}
                <div className="relative">
                    <div className="sticky top-24 bg-white border border-gray-200 shadow-xl rounded-xl p-6">
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded w-fit mb-3">
                            Likely to sell out
                        </div>

                        <div className="mb-6">
                            <span className="text-sm text-gray-500">From</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-gray-900">
                                    {currencySymbol}{experience.price}
                                </span>
                                <span className="text-sm text-gray-500">per person</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <button className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-left transition-colors font-medium text-gray-700">
                                <div className="flex items-center gap-2">
                                    <FaUserFriends />
                                    <span>{guests} Participant{guests > 1 ? 's' : ''}</span>
                                </div>
                                {/* In a real app, this would open a dropdown */}
                            </button>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                                    <FaCalendarAlt />
                                </div>
                                <input
                                    type="date"
                                    className="w-full bg-gray-100 hover:bg-gray-200 p-3 pl-10 rounded-lg font-medium text-gray-700 outline-none cursor-pointer"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            {experience.timeSlots && experience.timeSlots.length > 0 && (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                                        <FaClock />
                                    </div>
                                    <select
                                        className="w-full bg-gray-100 hover:bg-gray-200 p-3 pl-10 rounded-lg font-medium text-gray-700 outline-none cursor-pointer appearance-none"
                                        value={timeSlot}
                                        onChange={(e) => setTimeSlot(e.target.value)}
                                        disabled={!date || fetchingAvailability}
                                    >
                                        <option value="">{fetchingAvailability ? 'Checking availability...' : 'Select a time'}</option>
                                        {experience.timeSlots.map((slot, index) => {
                                            const available = availability[slot] !== undefined ? availability[slot] : experience.capacity;
                                            const isFull = available <= 0;
                                            return (
                                                <option key={index} value={slot} disabled={isFull}>
                                                    {slot} {date ? `(${available} spots left)` : ''} {isFull ? '(Sold Out)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-4 text-sm font-medium">
                            <span className="text-gray-900">Total</span>
                            <span className="text-primary font-bold text-xl">{currencySymbol}{experience.price * guests}</span>
                        </div>

                        {timeSlot && availability[timeSlot] !== undefined && guests > availability[timeSlot] && (
                            <div className="text-red-500 text-xs mb-2 font-bold">
                                Only {availability[timeSlot]} spots available for this time.
                            </div>
                        )}

                        <button
                            onClick={NavigateToCheckout}
                            disabled={!date || (experience.timeSlots?.length > 0 && !timeSlot) || (timeSlot && guests > (availability[timeSlot] || 0))}
                            className="w-full bg-primary hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full transition-all shadow-md active:scale-[0.98] mb-4"
                        >
                            {date && experience.timeSlots?.length > 0 && !timeSlot ? 'Select a time' : 'Book Now'}
                        </button>

                        <div className="space-y-3 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                                <FaCheck className="text-green-600" />
                                <span>Free cancellation up to 24 hours in advance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheck className="text-green-600" />
                                <span>Reserve now & pay later</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperienceDetail;
