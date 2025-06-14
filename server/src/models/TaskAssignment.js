const mongoose = require('mongoose');

const TaskAssignmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    assignedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'graded', 'submitted'],
        default: 'pending',
    },
    GithubLink: {
        type: String,
        default: null,
    },
    DeploymentLink: {
        type: String,
        default: null,
    },
    feedback: {
        type: String,
        default: null,
    },
    grade: {
        type: String,
        enum: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'],
        default: null,
    }
});

const TaskAssignment = mongoose.model('TaskAssignment', TaskAssignmentSchema);

module.exports = TaskAssignment;