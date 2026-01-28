import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { amount = 50, experienceTitle = 'Experience', currency = 'USD', experienceId, date, slots, timeSlot } = location.state || {};

    const [loading, setLoading] = useState(false);

    // Load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);

        const res = await loadRazorpay();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // 1. Create Order
            const { data: order } = await axios.post(
                `${API_URL}/payments/create-order`,
                { amount: Math.round(amount * 100), currency }, // Amount in smallest unit
                config
            );

            // 2. Get Key
            const { data: { keyId } } = await axios.get(`${API_URL}/payments/key`, config);

            // 3. Open Razorpay
            const options = {
                key: keyId,
                amount: order.amount,
                currency: order.currency,
                name: "Travellers Deal",
                description: experienceTitle,
                image: "https://via.placeholder.com/150",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };

                        const { data } = await axios.post(`${API_URL}/payments/verify`, verifyData, config);

                        if (data.status === 'success') {
                            // Payment success, now create booking
                            try {
                                await axios.post(
                                    `${API_URL}/bookings`,
                                    {
                                        experienceId,
                                        date,
                                        slots,
                                        timeSlot,
                                        paymentStatus: 'paid',
                                        paymentId: response.razorpay_payment_id
                                    },
                                    config
                                );
                                navigate('/completion');
                            } catch (bookingError) {
                                console.error('Booking creation failed:', bookingError);
                                alert('Payment successful but booking failed. Please contact support.');
                            }
                        } else {
                            alert('Payment Verification Failed');
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                },
                theme: {
                    color: "#00C2CB",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            setLoading(false);

        } catch (error) {
            console.error(error);
            alert('Error creating order. Ensure backend is running and keys are set.');
            setLoading(false);
        }
    };

    const currencySymbol = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'AED': 'AED ', 'JPY': '¥'
    }[currency] || '$';

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-md">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Checkout</h1>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-bold text-gray-700">Booking Summary</h3>
                        <p className="text-gray-600">{experienceTitle}</p>
                        <div className="flex justify-between mt-2 font-bold text-lg">
                            <span>Total</span>
                            <span>{currencySymbol}{amount}</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50 mt-4"
                    >
                        {loading ? "Processing..." : "Pay Now with Razorpay"}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">Secure payment via Razorpay</p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
