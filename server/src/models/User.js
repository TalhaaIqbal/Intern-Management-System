const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    phoneNumber: { type: String },
    gender: { type: String, enum: ['Male', 'Female'] },

    university: { type: String },
    degree: { type: String },

    skills: { type: [String] },
    resume: { type: String },
    linkedIn: { type: String },

    domain: {
        type: String,
        enum: ['Web Development', 'App Developement', 'Machine Learning', 'Blockchain Developement', 'Cybersecurity', 'Cloud Computing'],
        default: null,
    },

    role: {
        type: String,
        enum: ['admin', 'intern'],
        default: 'intern'
    },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;