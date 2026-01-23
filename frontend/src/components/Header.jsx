import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaHeart, FaShoppingCart, FaQuestionCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect for sticky header
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    const isHome = location.pathname === '/';

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 h-full flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 z-50">
                    <img
                        src="/logo.png"
                        alt="Travellers Deal"
                        className="h-12 w-auto object-contain"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {/* Common Links */}
                    <Link to="/experiences" className={`font-medium text-sm transition-colors ${scrolled || !isHome ? 'text-secondary hover:text-primary' : 'text-white/90 hover:text-white'}`}>
                        Experiences
                    </Link>

                    {/* Role Based Links */}
                    {user && (user.role === 'vendor' || user.role === 'admin') && (
                        <Link to="/vendor/dashboard" className={`font-medium text-sm transition-colors ${scrolled || !isHome ? 'text-secondary hover:text-primary' : 'text-white/90 hover:text-white'}`}>
                            Vendor Dashboard
                        </Link>
                    )}
                    {user && user.role === 'admin' && (
                        <Link to="/admin" className={`font-medium text-sm transition-colors ${scrolled || !isHome ? 'text-secondary hover:text-primary' : 'text-white/90 hover:text-white'}`}>
                            Admin
                        </Link>
                    )}

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-6">
                        {/* Wishlist & Cart Icons (Placeholders for now) */}
                        <button className={`transition-colors ${scrolled || !isHome ? 'text-secondary hover:text-primary' : 'text-white/90 hover:text-white'}`}>
                            <FaHeart size={18} />
                        </button>
                        <button className={`transition-colors ${scrolled || !isHome ? 'text-secondary hover:text-primary' : 'text-white/90 hover:text-white'}`}>
                            <FaShoppingCart size={18} />
                        </button>

                        {user ? (
                            <div className="relative group">
                                <button className={`flex items-center gap-2 font-medium ${scrolled || !isHome ? 'text-secondary' : 'text-white'}`}>
                                    <FaUserCircle size={24} className={scrolled || !isHome ? 'text-primary' : 'text-white'} />
                                    <span>{user.name}</span>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 hidden group-hover:block transition-all opacity-0 group-hover:opacity-100 transform origin-top-right">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Profile</Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500">Log Out</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className={`font-medium text-sm transition-colors ${scrolled || !isHome ? 'text-secondary hover:text-primary' : 'text-white hover:text-white/80'}`}>
                                    Log in
                                </Link>
                                <Link to="/register" className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${scrolled || !isHome ? 'bg-primary text-white hover:bg-red-600' : 'bg-white text-secondary hover:bg-gray-100'}`}>
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <button className={`md:hidden z-50 ${scrolled || !isHome ? 'text-secondary' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-white z-40 pt-20 px-6 flex flex-col gap-6 md:hidden overflow-y-auto">
                    <Link to="/" className="text-xl font-medium text-secondary" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/experiences" className="text-xl font-medium text-secondary" onClick={() => setIsOpen(false)}>Experiences</Link>
                    {user && (user.role === 'vendor' || user.role === 'admin') && (
                        <Link to="/vendor/dashboard" className="text-xl font-medium text-secondary" onClick={() => setIsOpen(false)}>Vendor Dashboard</Link>
                    )}
                    <div className="border-t border-gray-100 pt-6 mt-2 flex flex-col gap-4">
                        {user ? (
                            <>
                                <Link to="/profile" className="flex items-center gap-3 text-xl font-medium text-secondary" onClick={() => setIsOpen(false)}>
                                    <FaUserCircle className="text-primary" />
                                    Profile
                                </Link>
                                <Link to="/wishlist" className="flex items-center gap-3 text-xl font-medium text-secondary relative" onClick={() => setIsOpen(false)}>
                                    <FaHeart className="text-primary" />
                                    Wishlist
                                    {user && user.wishlist && user.wishlist.length > 0 && (
                                        <span className="absolute left-6 -top-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {user.wishlist.length}
                                        </span>
                                    )}
                                </Link>
                                <button onClick={handleLogout} className="text-left text-xl font-medium text-red-500">Log Out</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="w-full py-3 text-center rounded-lg border border-gray-200 text-secondary font-bold" onClick={() => setIsOpen(false)}>Log in</Link>
                                <Link to="/register" className="w-full py-3 text-center rounded-lg bg-primary text-white font-bold" onClick={() => setIsOpen(false)}>Sign up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
