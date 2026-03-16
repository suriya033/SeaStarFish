const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ['Fish', 'Coral', 'Equipment', 'Tanks', 'Accessory'] },
    subcategory: { type: String }, // e.g., Filter, Tank, Food, Plant, Decoration
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },
    ratings: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now }
    }],
    dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
