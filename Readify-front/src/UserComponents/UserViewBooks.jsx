import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Added for feedback
import UserNav from './UserNav';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';

const UserViewBooks = () => {

  const BASE_URL = process.env.BASE_URL;

  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;


  const [showReviewFloater, setShowReviewFloater] = useState(false);
  const [currentReviews, setCurrentReviews] = useState([]);
  const [selectedBookName, setSelectedBookName] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(false);

  const navigate = useNavigate();

  const API_URL = 'http://localhost:8080/api/books';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAllBooks`);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);


  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleViewReviews = async (bookId, bookTitle) => {

    setSelectedBookName(bookTitle);
    setShowReviewFloater(true);
    setLoadingReviews(true);
    setCurrentReviews([]);
    try {
      // Correct URL matching the new route
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/getReviewsByBook/${bookId}`);
      setCurrentReviews(res.data);

    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
    finally {
      setLoadingReviews(false); // Stop loading spinner
    }

  };
  const handleAddToCart = (book) => {
    // Get the quantity from the specific select dropdown for this book
    const qtyElement = document.getElementById(`qty-${book._id}`);
    const qty = qtyElement ? parseInt(qtyElement.value) : 1;

    addToCart(book, qty);

    // Provide visual feedback
    Swal.fire({
      title: 'Added to Cart!',
      text: `${book.title} (${qty} qty) has been added.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const filteredBooks = books.filter((book) =>
    (book.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)

  return (
    <div className="bg-gray-50 min-h-screen">
      <UserNav />
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-center text-slate-700 flex justify-center items-center gap-2">
          📚 Books
        </h2>

        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin h-10 w-10 border-4 border-slate-700 border-t-transparent rounded-full"></div>
          </div>
        ) : (

          <>

            <div className="flex justify-center my-6">
              <input
                type="text"
                placeholder="Search books..."
                className="border p-2 rounded-lg w-1/2 shadow-sm outline-none focus:ring-2 ring-blue-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {currentBooks.map((book) => (
                <div key={book._id} className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center text-center">
                  <img
                    src={
                      book.coverImage
                        ? book.coverImage.startsWith('data:')
                          ? book.coverImage                       // Show if it's old Base64 data
                          : `${BASE_URL}${book.coverImage}`       // Prepend URL if it's a file path (/uploads/...)
                        : 'https://via.placeholder.com/150'       // Fallback
                    }
                    alt={book.title}
                    className="h-48 object-contain mb-4 rounded shadow"
                    // Optional: If the image fails to load, show a placeholder
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                  />
                  <h3 className="font-bold text-lg line-clamp-1">{book.title}</h3>
                  <p className="text-gray-500 text-sm font-semibold"> ₹ {book.price}</p>
                  <p className="text-gray-500 text-sm">Author: {book.author}</p>
                  <p className={`font-bold mt-2 ${book.stockQuantity <= 0
                    ? 'text-red-600'
                    : book.stockQuantity <= 10
                      ? 'text-orange-500'
                      : 'text-green-600'
                    }`}>
                    {book.stockQuantity <= 0
                      ? 'Out of Stock'
                      : book.stockQuantity <= 10
                        ? `Limited Stock: ${book.stockQuantity}`
                        : `In Stock: ${book.stockQuantity}`
                    }
                  </p>

                  <div className="mt-4 w-full text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block ml-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id={`qty-${book._id}`}
                      min="1"
                      max="10"
                      defaultValue="1"
                      // The "appearance-auto" ensures the browser's default arrows show up
                      className="border rounded-lg p-2 w-full text-sm bg-gray-50 outline-none focus:ring-2 ring-blue-200 transition-all appearance-auto"
                      onInput={(e) => {
                        let val = parseInt(e.target.value);
                        if (val > 10) e.target.value = 10;
                        if (val < 1) e.target.value = 1;
                      }}
                      // Prevents typing 'e', '+', '-', etc.
                      onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    />
                  </div >

                  <button
                    onClick={() => handleAddToCart(book)}
                    disabled={book.stockQuantity <= 0}
                    className={`w-full font-bold py-2 rounded-lg mt-3 transition ${book.stockQuantity > 0
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}>
                    {book.stockQuantity > 0 ? 'Add to Cart' : 'Unavailable'}
                  </button>

                  <div className="flex gap-2 w-full mt-3 text-[11px]">
                    <button
                      onClick={() => handleViewReviews(book._id, book.title)} // TRIGGER FLOATER
                      className="flex-1 bg-slate-700 text-white py-2 rounded font-bold hover:bg-slate-800"
                    >
                      View Reviews
                    </button>
                    <button
                      onClick={() => navigate('/write-review', { state: { bookId: book._id, bookTitle: book.title } })}
                      className="flex-1 bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* --- PAGINATION CONTROLS --- */}
            {filteredBooks.length > 0 && (
              <div className="flex justify-center items-center mt-12 gap-4 pb-10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className={`px-4 py-2 rounded-lg font-bold transition ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-slate-700 text-white hover:bg-slate-800'}`}
                >
                  Previous
                </button>

                <span className="font-bold text-slate-700">
                  Page {currentPage} of {totalPages || 1}
                </span>

                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className={`px-4 py-2 rounded-lg font-bold transition ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-slate-700 text-white hover:bg-slate-800'}`}
                >
                  Next
                </button>
              </div>
            )}

          </>
        )}
      </div>


      {showReviewFloater && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white w-full max-w-6xl rounded-t-[2.5rem] shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-indigo-900">
                Reviews for {selectedBookName}
              </h2>
              <button
                onClick={() => setShowReviewFloater(false)}
                className="text-2xl font-bold text-gray-400 hover:text-red-500 transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">

              {loadingReviews ? (
                /* New Loading Spinner for Reviews */
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
                  <p className="text-gray-500 text-sm">Loading reviews...</p>
                </div>

              ) : currentReviews.length > 0 ? (
                currentReviews.map((rev, index) => (
                  <div key={rev._id} className="pb-6 border-b last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      {/* User Tag */}
                      <span className="bg-purple-900 text-white text-[10px] px-3 py-0.5 rounded-full font-bold uppercase">
                        {rev.userName || `User${index + 1}`}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                      <span>⭐</span>
                      <span className="font-bold text-gray-700">{rev.rating}/5</span>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      {rev.reviewText}
                    </p>

                    {/* Date */}
                    <p className="text-gray-400 text-[10px]">
                      {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-gray-400 font-semibold italic">
                  No reviews available for this book yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserViewBooks;