import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import UserNav from './UserNav';

const UserMyReview = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // const API_URL = 'http://localhost:8080/api/reviews';
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchReviews = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/getReviewsByUser/${userId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (count) => {
    return "⭐".repeat(count) + "☆".repeat(5 - count);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/reviews/deleteReview/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(reviews.filter(r => r._id !== id));
        Swal.fire('Deleted!', 'Your review has been removed.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete review', 'error');
      }
    }
  };

  // if (loading) return <div className="text-center mt-20 font-bold">Loading Reviews...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-emerald-50 pb-10">
      <UserNav />

      <div className="max-w-4xl mx-auto mt-10 p-4 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">My Book Reviews</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-indigo-600 font-semibold">Fetching your reviews...</p>
          </div>

        ) : (
          <>
            {reviews.length === 0 ? (
              <p className="text-gray-500">You haven't written any reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
                  {/* Note: Ensure backend populates the 'book' field to get the title */}
                  <h3 className="text-xl font-bold text-indigo-900">{review.book?.title || "Book Title Not Found"}</h3>

                  <div className="my-2 text-sm">
                    <span className="text-gray-600">Rating: </span>
                    <span className="text-yellow-500 font-bold">{renderStars(review.rating)}</span>
                  </div>

                  <p className="text-sm font-bold text-gray-800 my-2">
                    Date: {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                  </p>

                  <p className="text-gray-600 leading-relaxed text-sm px-10">
                    "{review.reviewText}"
                  </p>

                  <div className="mt-6 flex justify-center gap-4">
                    <button
                      onClick={() => setSelectedBook(review.book)}
                      className="bg-[#5D3F75] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#4a325d] transition"
                    >
                      View Book
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="bg-[#5D3F75] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#4a325d] transition"
                    >
                      Delete Review
                    </button>
                  </div>
                </div>
              ))
            )}

          </>
        )}

      </div>

      {selectedBook && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative text-center">
            <button onClick={() => setSelectedBook(null)} className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-xl">✕</button>
            <h3 className="text-lg font-bold text-indigo-900 mb-4">{selectedBook.title}</h3>
            <div className="flex justify-center mb-6">
              <img
                src={
                  selectedBook.coverImage
                    ? selectedBook.coverImage.startsWith('data:') || selectedBook.coverImage.startsWith('http')
                      ? selectedBook.coverImage
                      : `${BASE_URL}${selectedBook.coverImage}`
                    : 'https://via.placeholder.com/150'
                }
                alt={selectedBook.title}
                className="w-40 h-56 object-contain rounded shadow-md border"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
              />
            </div>
            {/* <div className="flex justify-center mb-6">
              <img src={selectedBook.coverImage} alt="Cover" className="w-40 h-56 object-contain rounded shadow-md border" />
            </div> */}
            <div className="text-sm space-y-1">
              <p>
                <span className="font-bold text-gray-800">Price: </span>
                {selectedBook.price ? `₹${selectedBook.price}` : "Not Available"}
              </p>
              <p>
                <span className="font-bold text-gray-800">Category: </span>
                {selectedBook.category || "General"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMyReview;