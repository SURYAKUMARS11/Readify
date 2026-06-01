import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import UserNav from './UserNav';

const UserReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Destructure from location.state
  const { bookId, bookTitle } = location.state || {}; 

  const emojis = ['😡', '😟', '😐', '😊', '😍'];
  const [rating, setRating] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // REDIRECT if no bookId is found (e.g. user refreshed the page or typed URL manually)
  useEffect(() => {
    if (!bookId) {
      Swal.fire('Notice', 'Please select a book from the store to write a review.', 'info');
      navigate('/view-books');
    }
  }, [bookId, navigate]);

  // const API_URL = 'http://localhost:8080/api/reviews';

  const handleSubmit = async () => {
    if (rating === null || !text.trim()) {
      return Swal.fire('Error', 'Please provide a rating and a comment.', 'error');
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Note: In many backends, userId is extracted from the token. 
      // If your backend requires it in the body, keep it.
      const userId = localStorage.getItem('userId');

      const payload = {
        user: userId,     // Check if your backend expects 'user' or 'userId'
        book: bookId,     // Check if your backend expects 'book' or 'bookId'
        rating: rating + 1, 
        reviewText: text       // Check if your backend expects 'reviewText' or 'comment'
      };
      
      await axios.post(`${process.env.REACT_APP_API_URL}/reviews/addReview`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await Swal.fire({
        title: 'Success',
        text: 'Your review has been submitted!',
        icon: 'success',
        confirmButtonColor: '#22c55e'
      });
      
      navigate('/my-reviews');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to add review', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav />
      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-lg text-center border border-gray-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">📚 Share Your Thoughts</h2>
          <p className="text-sm font-semibold text-purple-600 mb-6 italic">
            "{bookTitle || "Loading Book..."}"
          </p>
          
          <textarea 
            placeholder="What did you like or dislike?"
            className="w-full border-2 border-gray-100 rounded-2xl p-4 h-40 focus:border-purple-300 focus:ring-2 ring-purple-100 outline-none bg-gray-50 transition-all resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <p className="mt-6 text-gray-400 text-sm font-medium">How was your experience?</p>
          <div className="flex justify-center gap-4 my-4 text-4xl">
            {emojis.map((emoji, index) => (
              <button 
                key={index} 
                type="button"
                className={`hover:scale-125 transition-transform duration-200 ${rating === index ? 'grayscale-0' : 'grayscale opacity-40'}`}
                onClick={() => setRating(index)}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex-[2] bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 shadow-lg shadow-green-200 transition-all disabled:bg-gray-300"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReview;