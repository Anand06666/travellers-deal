const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const options = {
            amount: amount, // Amount matches what frontend sends (already multiplied by 100 or checked there? Frontend sends cents/paise usually. Controller usually expects smallest unit or converts. Previous Stripe code took input. Let's assume input is in smallest unit or handle it.)
            // ExperienceDetail sends amount * 100 to frontend state. 
            // LEt's ensure consistency. Frontend Payment.jsx sends: JSON.stringify({ amount: Math.round(amount * 100), ... })
            // So logic here matches.
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            res.json({ status: 'success', message: 'Payment verified' });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Razorpay Key ID
// @route   GET /api/payments/key
// @access  Private
const getRazorpayKey = (req, res) => {
    res.json({ keyId: process.env.RAZORPAY_KEY_ID });
};

module.exports = { createOrder, verifyPayment, getRazorpayKey };
