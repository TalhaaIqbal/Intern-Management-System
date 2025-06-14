const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const User = require('../models/User');
const Task = require('../models/Task');
const TaskAssignment = require('../models/TaskAssignment');

const JWT_SECRET = process.env.JWT_SECRET;

// Set up storage for resume uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Register a new user
router.post('/register', upload.single('resume'), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            gender,
            university,
            degree,
            skills,
            linkedIn,
            yearOfStudy,
            dob
        } = req.body;

        const resumePath = req.file ? req.file.path : null;

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            gender,
            university,
            degree,
            yearOfStudy,
            dob,
            skills: JSON.parse(skills),
            resume: resumePath,
            linkedIn
        });

        const returnedFields = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
        };

        await newUser.save();
        res.status(200).json({ message: 'Registration successful', user: returnedFields });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Domain Selection Right After Registration
router.patch('/select-domain', async (req, res) => {
    try {
        const { email, domain } = req.body;

        if (!email || !domain) {
            return res.status(400).json({ message: 'Email and domain are required' });
        }

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.updateOne({ _id: user._id }, { domain });

        res.status(200).json({ message: 'Domain updated successfully', userEmail: normalizedEmail });
    } catch (error) {
        console.error('Error selecting domain:', error);
        res.status(500).json({ message: 'Server error during domain selection' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            domain: user.domain || null,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        const { password: _, ...userData } = user.toObject();
        console.log('User logged in:', userData);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userData,
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user by email
router.get('/get-user', async (req, res) => {
    try {
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { password, ...userData } = user.toObject();
        res.status(200).json(userData);

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error while fetching user' });
    }
});

//Add Task
router.post('/add-task', async (req, res) => {
    try {
        const { title, description, domain, level, createdBy } = req.body;

        if (!title || !domain) {
            return res.status(400).json({ message: 'Title and domain are required' });
        }

        const task = new Task({
            title,
            description,
            domain,
            level: level ? parseInt(level, 10) : 1,
            createdBy: createdBy ? createdBy.toLowerCase() : 'admin',
        });
        await task.save();

        res.status(200).json({ message: 'Task added successfully', task });
    }
    catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Server error while adding task' });
    }
});

//Show All Tasks
router.get('/all-tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 })
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found' });
        }

        res.status(200).json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server error while fetching tasks' });
    }
});

//Specific Domain Tasks using id and TaskAssignment
router.get('/domain-tasks', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const id = user._id;
        const tasks = await TaskAssignment.find({ userId: id })
            .populate('taskId')
            .sort({ assignedAt: -1 });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        const domainTasks = tasks.map(task => ({
            id: task.taskId._id,
            title: task.taskId.title,
            description: task.taskId.description,
            domain: task.taskId.domain,
            level: task.taskId.level,
            status: task.status,
            assignedAt: task.assignedAt,
            GithubLink: task.GithubLink,
            DeploymentLink: task.DeploymentLink,
            feedback: task.feedback,
            grade: task.grade,
            createdBy: task.taskId.createdBy,
        }));

        res.status(200).json(domainTasks);
    } catch (error) {
        console.error('Error fetching domain tasks:', error);
        res.status(500).json({ message: 'Server error while fetching domain tasks' });
    }
});

//Assign Task to User
router.post('/assign-tasks', async (req, res) => {
    try {
        const { email, domain } = req.body;

        if (!email || !domain) {
            return res.status(400).json({ message: 'Email and domain are required' });
        }

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user already has task assignments
        const existingAssignments = await TaskAssignment.find({ userId: user._id });
        if (existingAssignments.length > 0) {
            return res.status(200).json({ message: 'Tasks already assigned', assignments: existingAssignments });
        }

        // Fetch tasks from selected domain
        const tasks = await Task.find({ domain }).sort({ createdAt: 1 });
        console.log('Tasks fetched for domain:', domain, tasks);

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for the selected domain' });
        }

        // Assign tasks to the user
        const assignments = tasks.map(task => ({
            userId: user._id,
            taskId: task._id,
            assignedAt: new Date(),
            status: 'pending',
            GithubLink: null,
            DeploymentLink: null,
            feedback: null,
            grade: null,
        }));

        await TaskAssignment.insertMany(assignments);

        res.status(200).json({
            message: `Assigned ${assignments.length} task(s) successfully`,
            assignments,
        });

    } catch (error) {
        console.error('Error assigning tasks:', error);
        res.status(500).json({ message: 'Server error while assigning tasks' });
    }
});

//Delete Tasks
router.delete('/delete-task/:id', async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.deleteOne({ _id: taskId });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server error while deleting task' });
    }
});

//Submit Task
router.post('/submit-task', async (req, res) => {
    try {
        const { taskId, userId, githubLink, deploymentLink } = req.body;
        console.log("TaskId:", taskId , "UserId:", userId, "GithubLink:", githubLink, "DeploymentLink:", deploymentLink);

        if (!taskId || !userId) {
            return res.status(400).json({ message: 'Task ID and User ID are required' });
        }

        const assignment = await TaskAssignment.findOne({ taskId, userId });
        if (!assignment) {
            return res.status(404).json({ message: 'Task assignment not found' });
        }

        assignment.GithubLink = githubLink || assignment.GithubLink;
        assignment.DeploymentLink = deploymentLink || assignment.DeploymentLink || '';
        assignment.status = 'submitted';

        await assignment.save();

        res.status(200).json({ message: 'Task submitted successfully', assignment });
    } catch (error) {
        console.error('Error submitting task:', error);
        res.status(500).json({ message: 'Server error while submitting task' });
    }
});

//Get Submitted Tasks
router.get('/submissions', async (req, res) => {
    try {
        const assignments = await TaskAssignment.find({ status: 'submitted' })
            .populate('taskId')
            .sort({ assignedAt: -1 });

        if (!assignments || assignments.length === 0) {
            return res.status(403).json({ message: 'No submitted tasks yet' });
        }

        // now find email of the user from the user id
        const userIds = assignments.map(assignment => assignment.userId);
        const users = await User.find({ _id: { $in: userIds } }).select('email');
        
        //now put the id in submitted tasks json
        const submittedTasks = assignments.map(assignment => {
            const user = users.find(u => u._id.toString() === assignment.userId.toString());
            return {
                id: assignment.taskId._id,
                title: assignment.taskId.title,
                description: assignment.taskId.description,
                domain: assignment.taskId.domain,
                level: assignment.taskId.level,
                status: assignment.status,
                assignedAt: assignment.assignedAt,
                GithubLink: assignment.GithubLink,
                DeploymentLink: assignment.DeploymentLink,
                feedback: assignment.feedback,
                grade: assignment.grade,
                createdBy: assignment.taskId.createdBy,
                userEmail: user ? user.email : 'Unknown',
            };
        });
        console.log('Submitted Tasks:', submittedTasks);

        res.status(200).json(submittedTasks);
    } catch (error) {
        console.error('Error fetching submitted tasks:', error);
        res.status(500).json({ message: 'Server error while fetching submitted tasks' });
    }
});

//Submit Feedback
router.post('/submissions/feedback', async (req, res) => {
    try {
        const { email, taskId, grade, feedback } = req.body;
        console.log("Email:", email, "TaskId:", taskId, "Grade:", grade, "Feedback:", feedback);

        if (!email || !taskId || !grade || !feedback) {
            return res.status(400).json({ message: 'Submission ID, grade, and feedback are required' });
        }

        //from users, find the userId with email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //find the task assignment with userId
        const userId = user._id;
        const assignment = await TaskAssignment.findOne({ taskId ,userId, status: 'submitted' });
        if (!assignment) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        assignment.grade = grade;
        assignment.feedback = feedback;
        assignment.status = 'graded';

        await assignment.save();

        res.status(200).json({ message: 'Feedback submitted successfully', assignment });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server error while submitting feedback' });
    }
});

module.exports = router;