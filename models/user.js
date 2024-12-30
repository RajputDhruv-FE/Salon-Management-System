// Import Mongoose
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a valid email address.'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required.'],
        match: [/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 characters long.']
    },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
