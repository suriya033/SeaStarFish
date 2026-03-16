const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const products = [
    {
        name: "Premium Rimless Aquarium",
        description: "Ultra-clear glass tank with minimalist aesthetics. Perfect for professional aquascaping.",
        price: 12500,
        category: "Accessory",
        subcategory: "Tank",
        stock: 10,
        images: ["https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80"]
    },
    {
        name: "Red Discus Fish",
        description: "Exotic Symphysodon discus, known as the king of the aquarium. Vibrant red coloration.",
        price: 2500,
        category: "Fish",
        subcategory: "Exotic",
        stock: 25,
        images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"]
    },
    {
        name: "External Canister Filter",
        description: "High-performance multi-stage filtration system for crystal clear water.",
        price: 8500,
        category: "Accessory",
        subcategory: "Filter",
        stock: 15,
        images: ["https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80"]
    },
    {
        name: "Anubias Nana Plant",
        description: "Easy-to-care-for aquatic plant that thrives in low light. Attached to driftwood.",
        price: 450,
        category: "Accessory",
        subcategory: "Plant",
        stock: 50,
        images: ["https://images.unsplash.com/photo-1506452305024-9d3f02d1c9b3?auto=format&fit=crop&w=800&q=80"]
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Seeding products...');
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Products seeded successfully!');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
