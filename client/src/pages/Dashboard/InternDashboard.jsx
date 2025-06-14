import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';

const InternDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const email = localStorage.getItem('userEmail');
        const token = localStorage.getItem('token');

        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/domain-tasks`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          params: {
            email: email || '',
          },
        });

        setTasks(res.data);
        console.log('Fetched tasks:', res.data);
      } catch (err) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status !== 'pending').length;
  const pendingTasks = totalTasks - completedTasks;

  const chartData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
  ];

  const pieColors = ['#10B981', '#EF4444'];
  const recentTasks = tasks.slice(-5).reverse();

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gray-100">
      {loading && <p className="text-center text-blue-600 font-medium">Loading your dashboard...</p>}
      {error && <p className="text-center text-red-500 font-medium">{error}</p>}

      {!loading && !error && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Intern Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your progress overview.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-800">Total Tasks</h2>
              <p className="text-3xl font-bold text-blue-600">{totalTasks}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-800">Completed</h2>
              <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-800">Pending</h2>
              <p className="text-3xl font-bold text-red-500">{pendingTasks}</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Status Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Completion Rate</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            {recentTasks.length > 0 ? (
              <ul className="space-y-2">
                {recentTasks.map((task, index) => (
                  <li key={index} className="text-gray-700">
                    • {task.title} — <span className="text-sm italic text-gray-500">{task.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No recent activity available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InternDashboard;
