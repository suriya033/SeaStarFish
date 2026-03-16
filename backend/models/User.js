const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: { type: String, default: 'India' }
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    dateJoined: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
