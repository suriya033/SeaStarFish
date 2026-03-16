const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const specimens = [
    {
        name: 'Royal Blue Tang',
        description: 'Elite Pacific specimen with vibrant electric blue coloration and yellow tail. Professionally acclimated.',
        price: 4500,
        category: 'Fish',
        subcategory: 'Marine',
        stock: 12,
        images: ['https://images.unsplash.com/photo-1524704659694-3f6e1f06f52e?auto=format&fit=crop&w=800&q=80']
    },
    {
        name: 'Neon Coral Colony',
        description: 'High-density photosynthetic coral colony. Fluorescent green under actinic lighting.',
        price: 3200,
        category: 'Coral',
        subcategory: 'LPS',
        stock: 8,
        images: ['https://images.unsplash.com/photo-1546024073-92e6da7d026c?auto=format&fit=crop&w=800&q=80']
    },
    {
        name: 'Nano Reef System 50L',
        description: 'Professional grade crystal-clear glass tank with integrated filtration and LED reef lighting.',
        price: 12500,
        category: 'Tanks',
        subcategory: 'Nano',
        stock: 5,
        images: ['https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80']
    }
];

const seedSpecimens = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔄 Connected to Registry...');

        await Product.deleteMany({});
        console.log('🗑️ Legacy Registry Cleared.');

        await Product.insertMany(specimens);
        console.log('✅ Fresh Specimens Injected Successfully.');

        process.exit(0);
    } catch (err) {
        console.error('❌ Registry Injection Failed:', err);
        process.exit(1);
    }
};

seedSpecimens();
