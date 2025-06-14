const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    domain: { type: String, required: true },
    level: { type: Number, default: 1 },
    createdBy: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;