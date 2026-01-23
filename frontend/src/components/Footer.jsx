import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#1a2b49] text-white pt-16 pb-8 text-sm">
            <div className="container mx-auto px-6">

                {/* Top Section: Language & Currency (Mock) */}
                <div className="flex justify-between items-center border-b border-gray-700 pb-8 mb-8">
                    <div className="flex gap-4">
                        <select className="bg-transparent border border-gray-500 rounded px-3 py-2 text-white outline-none cursor-pointer hover:border-white">
                            <option className="text-gray-900" value="en">English (US)</option>
                            <option className="text-gray-900" value="es">Español</option>
                            <option className="text-gray-900" value="fr">Français</option>
                        </select>
                        <select className="bg-transparent border border-gray-500 rounded px-3 py-2 text-white outline-none cursor-pointer hover:border-white">
                            <option className="text-gray-900" value="USD">USD ($)</option>
                            <option className="text-gray-900" value="EUR">EUR (€)</option>
                            <option className="text-gray-900" value="INR">INR (₹)</option>
                        </select>
                    </div>
                </div>

                {/* Main Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h3 className="font-bold text-white mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link></li>
                            <li><Link to="/about-us" className="hover:text-gray-300 transition-colors">About Us</Link></li>
                            <li><Link to="/supplier-privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/payment-collection-policy" className="hover:text-gray-300 transition-colors">Payment Policy</Link></li>
                            <li><Link to="#" className="hover:text-gray-300 transition-colors">Sitemap</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about-us" className="hover:text-gray-300 transition-colors">About Us</Link></li>
                            <li><Link to="#" className="hover:text-gray-300 transition-colors">Careers</Link></li>
                            <li><Link to="#" className="hover:text-gray-300 transition-colors">Blog</Link></li>
                            <li><Link to="#" className="hover:text-gray-300 transition-colors">Press</Link></li>
                            <li><Link to="#" className="hover:text-gray-300 transition-colors">Gift Cards</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Work With Us</h3>
                        <ul className="space-y-3">
                            <li><Link to="/vendor/register" className="hover:text-gray-300 transition-colors">As a Supply Partner</Link></li>
                            <li><Link to="#" className="hover:text-gray-300 transition-colors">As a Content Creator</Link></li>
                            <li><Link to="#" className="hover:text-gray-300 transition-colors">As an Affiliate Partner</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Ways to Travel</h3>
                        <ul className="space-y-3">
                            <li><Link to="#" className="hover:text-gray-300 transition-colors">Cities</Link></li>
                            <li><Link to="#" className="hover:text-gray-300 transition-colors">Magazines</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Contact Info (New Section) */}
                <div className="border-t border-gray-700 pt-8 pb-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-bold text-gray-400 mb-2">Office Address</h4>
                            <p className="text-gray-300">GF H.NO. 70, NR POLE NO 5 VILL. DHUL SIRAS Dhulsiras South West Delhi Delhi India 110077</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-400 mb-2">Contact Number</h4>
                            <p className="text-gray-300">9643052598</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-400 mb-2">Email</h4>
                            <p className="text-gray-300">Support@travellersdeal.com</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-8 gap-6">
                    <div className="text-gray-400">
                        &copy; {new Date().getFullYear()} Travellers Deal. Made for travellers.
                    </div>

                    <div className="flex gap-6">
                        <Link to="#" className="text-white hover:text-primary transition-colors text-xl"><FaFacebookF /></Link>
                        <Link to="#" className="text-white hover:text-primary transition-colors text-xl"><FaInstagram /></Link>
                        <Link to="#" className="text-white hover:text-primary transition-colors text-xl"><FaTwitter /></Link>
                        <Link to="#" className="text-white hover:text-primary transition-colors text-xl"><FaLinkedinIn /></Link>
                        <Link to="#" className="text-white hover:text-primary transition-colors text-xl"><FaYoutube /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
