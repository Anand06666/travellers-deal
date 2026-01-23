const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

dotenv.config();

const importData = async () => {
    try {
        await connectDB();

        const adminExists = await User.findOne({ email: 'admin@example.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            // We can't know the password, but we know the email.
            // If the user forgot, we can update it.
            // Let's force update it to a known password for the user.
            adminExists.password = 'password123';
            adminExists.role = 'admin';
            await adminExists.save();
            console.log('Admin password reset to: password123');
        } else {
            const user = await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
            });
            console.log('Admin created: admin@example.com / password123');
        }

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
