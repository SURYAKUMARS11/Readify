import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';

const AdminViewReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // States for Modals
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  const BASE_URL = process.env.BASE_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = `${import.meta.env.VITE_API_URL}/reviews/getAllReviews`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(rev =>
    (rev.book?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rev.reviewText || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Sort the filtered results by date
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-emerald-50 pb-20">
      {/* Navbar is always visible */}
      <AdminNav />

      <div className="max-w-5xl mx-auto p-10 text-center">
        <h2 className="text-4xl font-bold text-indigo-900 mb-10">View Reviews</h2>

        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-center">
          {/* Search Input */}
          <input
            className="flex-1 border-2 p-3 rounded-xl shadow-sm focus:outline-none focus:border-indigo-300 w-full"
            placeholder="Search reviews by book or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-indigo-900 font-bold text-sm whitespace-nowrap">Sort by:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border-2 p-3 rounded-xl shadow-sm bg-white focus:outline-none focus:border-indigo-300 text-sm font-semibold cursor-pointer"
            >
              <option value="desc">Date: Newest First</option>
              <option value="asc">Date: Oldest First</option>
            </select>
          </div>
        </div>

        {/* Loading Logic for Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-900 border-t-transparent rounded-full mb-4"></div>
            <p className="text-indigo-900 font-semibold animate-pulse">Loading user feedback...</p>
          </div>
        ) : (
          <>
            {sortedReviews.length > 0 ? (
              sortedReviews.map(rev => (
                <div key={rev._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl mb-8 border border-gray-100 text-center relative overflow-hidden">
                  <h3 className="text-xl font-bold text-purple-900 mb-2">{rev.book?.title || "Deleted Book"}</h3>
                  <div className="text-yellow-500 text-xl mb-4">{"⭐".repeat(rev.rating)}</div>
                  <p className="text-sm font-bold text-gray-800 mb-2">Date: {new Date(rev.date).toLocaleDateString()}</p>
                  <p className="text-gray-600 text-sm leading-relaxed px-10 mb-6 italic">"{rev.reviewText}"</p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setSelectedBook(rev.book)}
                      className="bg-[#5D3F75] text-white px-6 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition"
                    >
                      View Book
                    </button>
                    <button
                      onClick={() => setSelectedProfile(rev.user)}
                      className="bg-[#5D3F75] text-white px-6 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition"
                    >
                      View User
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 py-20 text-lg">No reviews found matching your search.</p>
            )}
          </>
        )}
      </div>

      {/* --- BOOK DETAIL MODAL --- */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl relative w-80 text-center animate-in zoom-in duration-200">
            <button onClick={() => setSelectedBook(null)} className="absolute top-4 right-6 text-gray-400 text-2xl hover:text-red-500">&times;</button>
            <h3 className="font-bold text-indigo-900 mb-4 border-b pb-2">Book Details</h3>

            <img
              src={`${BASE_URL}${selectedBook.coverImage}`}
              alt={selectedBook.title}
              className="h-32 w-24 object-contain mx-auto mb-4 rounded shadow"
              onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
            />

            <div className="text-xs text-left space-y-2 font-bold text-gray-700">
              <p><span className="text-gray-400">Title:</span> {selectedBook.title}</p>
              <p><span className="text-gray-400">Author:</span> {selectedBook.author}</p>
              <p><span className="text-gray-400">Price:</span> ₹{selectedBook.price}</p>
            </div>
            <button onClick={() => setSelectedBook(null)} className="mt-6 w-full bg-gray-100 py-2 rounded-lg font-bold text-xs hover:bg-gray-200 transition">Close</button>
          </div>
        </div>
      )}

      {/* --- USER PROFILE MODAL --- */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-3xl shadow-2xl relative w-80 text-center">
            <button onClick={() => setSelectedProfile(null)} className="absolute top-4 right-6 text-gray-400 hover:text-red-500">✕</button>
            <h3 className="font-bold text-indigo-900 mb-6 border-b pb-2">User Profile</h3>
            <div className="text-xs text-left space-y-3 font-bold text-gray-700">
              <p><span className="text-gray-400">Username:</span> {selectedProfile.username}</p>
              <p><span className="text-gray-400">Email:</span> {selectedProfile.email}</p>
              <p><span className="text-gray-400">Mobile:</span> {selectedProfile.mobileNumber || selectedProfile.mobile || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViewReviews;