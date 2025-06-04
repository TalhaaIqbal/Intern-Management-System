import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
                <p className="text-gray-600">
                    Welcome to the Intern Management System Dashboard
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Interns</h2>
                    <p className="text-3xl font-bold text-primary">0</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Active Tasks</h2>
                    <p className="text-3xl font-bold text-primary">0</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Completed Tasks</h2>
                    <p className="text-3xl font-bold text-primary">0</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">No recent activity to display</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 