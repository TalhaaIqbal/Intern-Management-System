import axios from 'axios';
import { useEffect, useState } from 'react';

const ViewSubmissions = () => {
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const email = localStorage.getItem('userEmail');
            if (!email) {
                setError('User not authenticated. Please log in.');
                return;
            }
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/submissions', {
                    headers: { 'Content-Type': 'application/json' },
                });
                setFormData(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching submissions:', error);
                setError('No Submissions found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCardClick = (item) => {
        setSelectedSubmission(item);
        setGrade('');
        setFeedback('');
    };

    const handleModalClose = () => {
        setSelectedSubmission(null);
    };

    const handleSubmitFeedback = async () => {
        try {
            console.log(selectedSubmission);
            await axios.post('http://localhost:5000/api/submissions/feedback', {
                email: selectedSubmission.userEmail,
                taskId: selectedSubmission.id,
                grade,
                feedback,
            });
            alert('Feedback submitted!');
            handleModalClose();
        } catch (err) {
            console.error('Error submitting feedback:', err);
            alert('Failed to submit feedback');
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-12 p-6 bg-white shadow rounded-lg">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Evaluate Submissions</h1>

            {loading && <p className="text-center text-gray-600">Loading...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {formData.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(item)}
                        className="cursor-pointer bg-gray-100 p-4 rounded-lg shadow hover:shadow-xl hover:bg-gray-200 transition duration-200"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {item.title || 'Unnamed Submission'}
                        </h2>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>Email:</strong> {item.userEmail || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>GitHub:</strong>{' '}
                            {item.GithubLink ? (
                                <a
                                    href={item.GithubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {item.GithubLink}
                                </a>
                            ) : (
                                'No GitHub link'
                            )}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>Deployment:</strong>{' '}
                            {item.DeployementLink ? (
                                <a
                                    href={item.DeployementLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {item.DeployementLink}
                                </a>
                            ) : (
                                'No Deployment link'
                            )}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Date:</strong>{' '}
                            {item.assignedAt
                                ? new Date(item.assignedAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })
                                : 'N/A'}
                        </p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
                        <button
                            className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
                            onClick={handleModalClose}
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Grade Submission</h2>
                        <p className="text-gray-700 mb-2">
                            <strong>Title:</strong> {selectedSubmission.title}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Email:</strong> {selectedSubmission.userEmail}
                        </p>
                        <label className="block mb-2 text-gray-700">
                            Grade:
                            <label className="block mb-2 text-gray-700">
                                <select
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="w-full border border-gray-300 p-2 rounded mt-1"
                                >
                                    <option value="">Select grade</option>
                                    <option value="A">A</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B">B</option>
                                    <option value="B-">B-</option>
                                    <option value="C">C</option>
                                    <option value="C-">C-</option>
                                    <option value="D">D</option>
                                    <option value="F">F</option>
                                </select>
                            </label>
                        </label>
                        <label className="block mb-4 text-gray-700">
                            Feedback:
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded mt-1"
                                rows="4"
                                placeholder="Enter feedback"
                            ></textarea>
                        </label>
                        <button
                            onClick={handleSubmitFeedback}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Submit Feedback
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewSubmissions;