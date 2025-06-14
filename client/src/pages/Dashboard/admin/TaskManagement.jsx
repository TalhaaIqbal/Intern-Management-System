import { useState } from 'react';
import axios from 'axios';

const domainOptions = [
    { id: 'web', title: '🌐 Web Development', description: 'Frontend, Backend, Full Stack Development' },
    { id: 'ai', title: '🤖 AI/ML', description: 'Machine Learning, Artificial Intelligence, Data Science' },
    { id: 'mobile', title: '📱 Mobile/App Development', description: 'iOS, Android, Cross-platform Development' },
    { id: 'cybersecurity', title: '🔐 Cybersecurity', description: 'Ethical Hacking, Network Security, Information Security' },
    { id: 'cloud', title: '☁️ Cloud Computing', description: 'Cloud Architecture, DevOps, Infrastructure as Code' },
    { id: 'blockchain', title: '⛓️ Blockchain Development', description: 'Smart Contracts, dApps, Web3' }
];

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        domain: '',
        level: '',
        createdBy: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'level' ? (parseInt(value, 10) || '') : value,
        }));

        console.log(formData);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        formData.createdBy = localStorage.getItem('userEmail');

        if (!formData.title || !formData.domain || !formData.level) {
            setError('Title, Domain, and Difficulty Level are required');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add-task`, formData);
            setTasks(prev => [...prev, response.data.task]);
            setFormData({ title: '', description: '', domain: '', level: '', createdBy: '' });
            setMessage('✅ Task added successfully!');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || '❌ Failed to add task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard - Manage Tasks</h1>

            {/* Add New Task */}
            <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

                <form onSubmit={handleAddTask} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field w-full border rounded px-3 py-2"
                            placeholder="Task title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field w-full border rounded px-3 py-2"
                            placeholder="Task description (optional)"
                            rows={3}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className='w-1/2'>
                            <label className="block font-medium mb-1">Domain *</label>
                            <select
                                name="domain"
                                value={formData.domain}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            >
                                <option value="">-- Select a domain --</option>
                                {domainOptions.map((domain) => (
                                    <option key={domain.id} value={domain.id}>
                                        {domain.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='w-1/2'>
                            <label className="block font-medium mb-1">Difficulty Level (1-6) *</label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            >
                                <option value="">-- Select difficulty level --</option>
                                {["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐⭐"].map((stars, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {stars}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading && <p className="text-blue-500">Adding task...</p>}
                    {message && <p className="text-green-600">{message}</p>}
                    {error && <p className="text-red-600">{error}</p>}

                    <button
                        type="submit"
                        className={`btn-primary px-4 py-2 rounded ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Task'}
                    </button>
                </form>
            </section>

            {/* Task List */}
            <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Tasks Added</h2>
                {tasks.length === 0 ? (
                    <p className="text-gray-600">No tasks added yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {tasks.map(task => (
                            <li key={task._id || task.id} className="border rounded p-3">
                                <h3 className="font-semibold text-lg">{task.title}</h3>
                                <p className="text-gray-700">{task.description || 'No description'}</p>
                                <p className="text-sm italic text-gray-500">Domain: {task.domain}</p>
                                <p className="text-sm italic text-gray-500">Difficulty Level: {task.level} ⭐</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default TaskManagement;