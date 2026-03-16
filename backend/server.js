const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Serve uploaded product images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Models
const User = require('./models/User');
const Enquiry = require('./models/Enquiry');

// Routes
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

// Middeleware to check DB status before login
app.use('/api/auth/login', (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database connection in progress. Please try again in 5 seconds.',
            error: 'DB_NOT_READY'
        });
    }
    next();
});

app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Shared Admin Seeding Function
const seedAdmin = async () => {
    try {
        const adminEmail = 'seastarfish@gmail.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('seastarfish123', 10);
            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Admin user seeded successfully');
        }
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
    }
};

// Routes that were accidentally removed
app.post('/api/enquiry', async (req, res) => {
    try {
        const { name, phone, interest } = req.body;
        const newEnquiry = new Enquiry({ name, phone, interest });
        await newEnquiry.save();
        res.status(201).json({ message: 'Enquiry submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting enquiry' });
    }
});

const { auth, admin } = require('./middleware/auth');
app.get('/api/admin/enquiries', auth, admin, async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ date: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enquiries' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
    res.json({
        status: 'OK',
        database: states[mongoose.connection.readyState]
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});

// Robust Connection Logic
const connectDB = async () => {
    try {
        console.log('🔄 Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 20000,
            family: 4 // Use IPv4
        });
        console.log('✅ MongoDB Connected!');
        await seedAdmin();
    } catch (err) {
        console.error('❌ DB CONNECTION ERROR:', err.message);
        console.log('💡 TIP: Ensure your IP is whitelisted in MongoDB Atlas (Network Access -> Add IP -> Allow Access From Anywhere)');
    }
};

connectDB();
