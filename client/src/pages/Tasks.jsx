import axios from 'axios';
import { useEffect, useState } from 'react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const domainTitles = {
    web: '🌐 Web Development',
    ai: '🤖 AI/ML',
    mobile: '📱 Mobile/App Development',
    cybersecurity: '🔐 Cybersecurity',
    cloud: '☁️ Cloud Computing',
    blockchain: '⛓️ Blockchain Development',
  };

  const role = localStorage.getItem('role') || 'intern';

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const domain = task.domain || 'others';
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(task);
    return acc;
  }, {});

  const submitTask = async () => {
    if (!selectedTask) return;

    const githubLink = document.querySelector('#githubLink')?.value || '';
    const deploymentLink = document.querySelector('#deploymentLink')?.value || '';

    if (!githubLink) {
      alert('Please enter your GitHub link.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/submit-task', {
        taskId: selectedTask._id || selectedTask.id,
        userId: localStorage.getItem('userId'),
        githubLink,
        deploymentLink: deploymentLink || null,
      });
      if (res.status === 200) {
        alert('Task submitted successfully!');
        setSelectedTask(null);
      } else {
        console.error('Failed to submit task:', res.statusText);
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Failed to submit task. Please try again.');
    }
  };

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/all-tasks');
        if (res.status === 200) {
          setTasks(res.data);
        } else {
          console.error('Failed to fetch tasks:', res.statusText);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchDomainTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/domain-tasks', {
          params: { email: localStorage.getItem('userEmail') },
        });
        if (res.status === 200) {
          setTasks(res.data);
        } else {
          console.error('Failed to fetch domain tasks:', res.statusText);
        }
      } catch (error) {
        console.error('Error fetching domain tasks:', error);
      }
    };

    if (role === 'admin') {
      fetchAllTasks();
    } else {
      fetchDomainTasks();
    }
  }, [role]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
      </div>

      {/* Task Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="input-field max-w-xs w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-md">
        {filteredTasks.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No matching tasks found.
          </div>
        ) : role === 'admin' ? (
          <div className="divide-y divide-gray-200">
            {Object.entries(groupedTasks).map(([domain, domainTasks]) => (
              <div key={domain} className="bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold px-6 py-4 border-b bg-gray-100">
                  {domainTitles[domain] || domain}
                </h2>
                <div className="divide-y divide-gray-200">
                  {[...domainTasks]
                    .sort((a, b) => a.level - b.level)
                    .map((task) => (
                      <div key={task.id || task._id} className="p-6 w-full transform transition-transform duration-200 hover:scale-105 hover:bg-gray-50 cursor-pointer">
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
                              {task.status?.[0] && (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${task.status[0] === 'submitted'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                  {task.status[0] === 'submitted' ? 'Submitted' : 'Pending'}
                                </span>
                              )}
                            </div>
                          </div>
                            <span
                              className={`text-sm font-semibold text-indigo-600 ${task.level <= 2
                                  ? 'bg-green-100'
                                  : task.level <= 4
                                    ? 'bg-yellow-100'
                                    : 'bg-red-100'
                                } px-2 py-1 rounded-full`}
                            >
                              {Array.from({ length: task.level }, () => '⭐').join('')}
                            </span>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 5v.01M12 12v.01M12 19v.01"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {selectedTask && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={() => setSelectedTask(null)}
                  >
                    ✖
                  </button>
                  <h2 className="text-xl font-bold mb-2">{selectedTask.title}</h2>
                  <p className="text-sm text-gray-600 mb-4">{selectedTask.description}</p>
                  <div className="text-sm text-indigo-600">
                    Level: {Array.from({ length: selectedTask.level }, () => '⭐').join('')}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Submit Your Work</h3>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700">GitHub Link</label>
                        <input
                          id="githubLink"
                          type="url"
                          placeholder="Enter your GitHub link"
                          className="input-field w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="deploymentLink" className="block text-sm font-medium text-gray-700">Deployment Link (optional)</label>
                        <input
                          id="deploymentLink"
                          type="url"
                          placeholder="Enter your Deployment link (if any)"
                          className="input-field w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <button
                        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          submitTask();
                          setSelectedTask(null);
                        }}
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
            <div className="divide-y divide-gray-200">
              {Object.entries(groupedTasks).map(([domain, domainTasks]) => (
                <div key={domain} className="bg-white rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold px-6 py-4 border-b bg-gray-100">
                    {domainTitles[domain] || domain}
                  </h2>
                  <div className="divide-y divide-gray-200">
                    {[...domainTasks]
                      .sort((a, b) => a.level - b.level)
                      .map((task) => (
                        <div
                          key={task.id || task._id}
                          onClick={() => setSelectedTask(task)}
                          className={`${task.status === 'submitted' ? 'bg-green-200 hover:bg-green-100' : task.status === 'graded' ? 'bg-blue-200 hover:bg-blue-100' : 'bg-white hover:bg-gray-50'} p-6 w-full cursor-pointer transform transition-transform duration-200 hover:scale-105`}
                        >
                          <div className="flex flex-col space-y-2">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
                              <div className="flex justify-between items-center">
                                {task.status && (
                                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${task.status === 'submitted'
                                      ? 'bg-green-100 text-green-700'
                                      : task.status === 'graded'
                                      ? 'bg-blue-100 text-blue-700' 
                                      : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {task.status === 'submitted' ? 'Submitted' : task.status === 'graded' ? 'Graded' : 'Pending'}
                                  </span>
                                )}

                                <span
                                  className={`text-sm font-semibold text-indigo-600 ${task.level <= 2
                                      ? 'bg-green-100'
                                      : task.level <= 4
                                        ? 'bg-yellow-100'
                                        : 'bg-red-100'
                                    } px-2 py-1 rounded-full`}
                                >
                                  {Array.from({ length: task.level }, () => '⭐').join('')}
                                </span>
                              </div>
                            </div>
                            { task.status === 'graded' && task.grade && (
                              <p className="text-sm text-gray-600"><strong>Grade: </strong>{task.grade}</p>
                            )}
                            { task.status === 'graded' && task.feedback && (
                              <p className="text-sm text-gray-600"><strong>Feedback: </strong>{task.feedback}</p>
                            )}
                            {
                              task.description &&
                            <p className="text-sm text-gray-600">{task.description}</p>
                            }
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tasks;