const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    experience: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Experience',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String, // e.g., "10:00 AM"
    },
    slots: {
        type: Number,
        required: true,
        default: 1,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    paymentId: {
        type: String,
    },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
