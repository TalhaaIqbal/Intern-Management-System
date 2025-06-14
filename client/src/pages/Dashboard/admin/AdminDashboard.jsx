import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const menu = [
        { title: "🗂️ Task Management", path: "/admin/tasks" },
        { title: "🧾 Evaluate Submissions", path: "/admin/submissions" },
    ];

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow rounded-lg">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="w-full h-40 flex flex-col items-center justify-center text-center p-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
                    >
                        <span className="text-2xl mb-2">{item.title.split(' ')[0]}</span>
                        <span className="text-lg font-medium">{item.title.split(' ').slice(1).join(' ')}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;