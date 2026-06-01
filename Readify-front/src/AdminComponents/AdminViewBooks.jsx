import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from './AdminNav';

const AdminViewBooks = () => {
  const BACKEND_URL = process.env.BASE_URL;

  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/books/getAllBooks`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // --- RESET TO PAGE 1 WHEN FILTERING ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/books/deleteBook/${showDeleteModal}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(books.filter(b => b._id !== showDeleteModal));
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Failed to delete book", error);
      alert("Error deleting book");
    }
  };

  // 1. Filter the list first
  const filteredBooks = books.filter(book => {
    const matchesSearch = (book.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 2. Paginate the filtered list
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const categories = ["All Categories", ...new Set(books.map(b => b.category))];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdminNav />

      <div className="max-w-7xl mx-auto p-10 text-center">
        <h2 className="text-4xl font-bold text-purple-900 mb-2 flex justify-center items-center gap-2">
          📚 Manage Books
        </h2>
        <div className="w-64 h-1 bg-purple-200 mx-auto mb-10"></div>

        <div className="flex justify-center items-center gap-4 mb-10">
          <input
            className="border-2 p-2 rounded-xl w-80 shadow-sm focus:outline-none focus:border-purple-400"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border-2 p-2 rounded-xl shadow-sm bg-white w-48 focus:outline-none focus:border-purple-400"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-purple-900 border-t-transparent rounded-full mb-4"></div>
            <p className="text-purple-900 font-semibold animate-pulse">Fetching inventory...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {currentBooks.length > 0 ? (
                currentBooks.map((book) => (
                  <div
                    key={book._id}
                    className="bg-white p-5 rounded-[2rem] shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                  >
                    <div className="flex justify-center mb-4 pt-2">
                      <img
                        src={
                          book.coverImage
                            ? book.coverImage.startsWith("data:") || book.coverImage.startsWith("http")
                              ? book.coverImage
                              : `${BACKEND_URL}${book.coverImage}`
                            : "https://via.placeholder.com/150"
                        }
                        className="h-40 object-contain drop-shadow-sm"
                        alt={book.title}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                      />
                    </div>

                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1 mb-1 px-1">
                      {book.title}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem] px-1 leading-snug mb-4">
                      {book.description}
                    </p>

                    <div className="text-[13px] pt-4 border-t border-gray-50 space-y-1.5 px-1 flex-grow">
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-semibold">Author</span>
                        <span className="text-gray-700 font-medium">{book.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-semibold">Price</span>
                        <span className="text-indigo-600 font-bold">₹{book.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-semibold">Stock</span>
                        <span className={`font-bold ${(book.stockQuantity || book.stock) > 0 ? 'text-gray-700' : 'text-red-500'}`}>
                          {book.stockQuantity || book.stock}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-semibold">Category</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] text-gray-600 uppercase font-bold">
                          {book.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => navigate(`/edit-book/${book._id}`)}
                        className="flex-1 bg-purple-700 text-white py-2.5 rounded-xl font-bold hover:bg-purple-800 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(book._id)}
                        className="flex-1 bg-red-50 text-red-500 py-2.5 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all text-sm border border-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center py-20 bg-white rounded-3xl border border-gray-100">
                  <p className="text-gray-400 text-lg">No books found matching your criteria.</p>
                </div>
              )}
            </div>

            {/* --- FUNCTIONAL PAGINATION CONTROLS --- */}
            {filteredBooks.length > 0 && (
              <div className="mt-16 flex justify-center items-center gap-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${
                    currentPage === 1 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  Previous
                </button>

                <span className="text-purple-900 font-bold bg-white px-4 py-2 rounded-lg shadow-sm border border-purple-100">
                  Page {currentPage} of {totalPages || 1}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${
                    (currentPage === totalPages || totalPages === 0)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-orange-50 p-10 rounded-3xl border-2 border-orange-200 shadow-2xl text-center max-w-sm">
            <p className="text-orange-800 font-bold mb-6">Are you sure you want to delete this book?</p>
            <div className="flex gap-4">
              <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 transition">Yes, Delete</button>
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 bg-gray-300 py-2 rounded-lg font-bold hover:bg-gray-400 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViewBooks;