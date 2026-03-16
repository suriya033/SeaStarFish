const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const products = await Product.find({});
        console.log('--- PRODUCT REGISTRY ---');
        products.forEach(p => {
            console.log(`ID: ${p._id} | Name: ${p.name} | Price: ${p.price} | Category: ${p.category} | Stock: ${p.stock}`);
        });
        console.log('------------------------');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkProducts();
