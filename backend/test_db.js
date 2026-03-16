const mongoose = require('mongoose');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
console.log('URI:', MONGODB_URI);
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('CONNECTED');
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR OBJECT:', Object.keys(err));
        console.error('ERROR MESSAGE:', err.message);
        console.error('ERROR CAUSE:', err.cause);
        process.exit(1);
    });
