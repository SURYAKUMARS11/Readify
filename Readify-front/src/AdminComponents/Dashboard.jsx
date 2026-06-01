import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ users: 0, books: 0, orders: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [statsRes, usersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/users/stats`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/users/all`, config)
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Dashboard error:", error);
        Swal.fire('Error', 'Could not load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statsConfig = [
    { title: 'Total Users', count: stats.users, color: 'bg-[#4285F4]' },
    { title: 'Total Books', count: stats.books, color: 'bg-[#34A853]' },
    { title: 'Total Orders', count: stats.orders, color: 'bg-[#FBBC05]' },
    { title: 'Total Reviews', count: stats.reviews, color: 'bg-[#A142F4]' },
  ];

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-sans">
      {/* Navbar is now outside the loading condition so it shows immediately */}
      <AdminNav />

      <div className="p-10 max-w-[1400px] mx-auto">

        {/* Dashboard Title */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📚</span>
            <h2 className="text-4xl font-extrabold text-[#1e293b]">
              Readify Market - Admin Dashboard
            </h2>
          </div>
          <div className="h-1 w-32 bg-blue-600 mt-3 rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {statsConfig.map((stat, index) => (
            <div key={index} className={`${stat.color} text-white p-6 rounded-2xl shadow-lg h-40 flex flex-col justify-between`}>
              <h3 className="text-2xl font-medium opacity-80">{stat.title}</h3>
              {loading ? (
                <div className="text-4xl font-bold animate-pulse">...</div>
              ) : (
                <p className="text-5xl font-bold">{stat.count}</p>
              )}
            </div>
          ))}
        </div>

        {/* Section Heading */}
        <h3 className="text-2xl font-bold text-[#333] mb-6">Users List</h3>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gradient-to-r from-[#4285F4] via-[#7B61FF] to-[#A142F4] text-white">
                <th className="p-5 font-bold text-sm">Username</th>
                <th className="p-5 font-bold text-sm">Email</th>
                <th className="p-5 font-bold text-sm">Mobile Number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Local Loading State for Table
                <tr>
                  <td colSpan="3" className="p-10 text-center">
                    <div className="flex items-center justify-center gap-3 text-gray-500 font-medium">
                      <div className="w-5 h-5 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5 text-gray-700 font-medium">{user.username}</td>
                    <td className="p-5 text-gray-600">{user.email}</td>
                    <td className="p-5 text-gray-600">{user.mobileNumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-gray-400">
                    No registered users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;