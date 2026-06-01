import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../assets/images/form.png';
import AdminNav from './AdminNav';
const BookForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const BASE_URL = 'http://localhost:8080'

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    stockQuantity: '',
    category: '',
    description: '', 
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isEdit && id) {
      const fetchBook = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/getBookById/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFormData({
            title: res.data.title,
            author: res.data.author,
            price: res.data.price,
            stockQuantity: res.data.stockQuantity,
            category: res.data.category,
            description: res.data.description,
            coverImage: res.data.coverImage
          });
          if (res.data.coverImage) {
            const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
            const imageUrl = res.data.coverImage.startsWith('http')
              ? res.data.coverImage
              : `${baseUrl}${res.data.coverImage}`;

            setPreviewUrl(imageUrl);
          }
          console.log("Image Path from DB:", res.data.coverImage);
          console.log("Final Preview URL:", `${import.meta.env.VITE_API_URL}${res.data.coverImage}`);
        } catch (err) {
          console.error("Failed to load book", err);
        }
      };
      fetchBook();
    }
  }, [isEdit, id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); 
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Book title is required";
    if (!formData.author) newErrors.author = "Author is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.stockQuantity) newErrors.stockQuantity = "Stock Quantity is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description) newErrors.description = "Description is required";

    if (!isEdit && !selectedFile) {
      newErrors.coverImage = "Cover Image is required";
    } else if (isEdit && !previewUrl && !selectedFile) {
      newErrors.coverImage = "Cover Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const data = new FormData();
      data.append('title', formData.title);
      data.append('author', formData.author);
      data.append('price', formData.price);
      data.append('stockQuantity', formData.stockQuantity);
      data.append('category', formData.category);
      data.append('description', formData.description);

      if (selectedFile) {
        data.append('coverImage', selectedFile);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      };

      // const API_BASE = 'http://localhost:8080/api/books';

      if (isEdit) {
        await axios.put(`${import.meta.env.VITE_API_URL}/books/updateBook/${id}`, data, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/books/addBook`, data, config);
      }

      setShowPopup(true); // Show older success modal
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/admin-books');
  };

  return (

    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <div

        className="relative min-h-screen flex items-center justify-center bg-cover bg-center py-2"
        style={{ backgroundImage: `url(${bgImage})` }}

      >


        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

        {/* RESTORED OLDER SUCCESS POPUP STYLE */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-md">
            <div className="bg-white p-10 rounded-xl shadow-2xl border-2 border-yellow-500 text-center max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-300">
              <h2 className="text-blue-800 font-bold text-xl mb-6">
                {isEdit ? 'Book Updated Successfully!' : 'Book Added Successfully!'}
              </h2>
              <button
                onClick={handlePopupClose}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-10 py-2 rounded-md font-bold transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* RESTORED OLDER FORM CONTAINER STYLE */}
        <div className="relative bg-white/95 p-8 rounded-xl shadow-2xl w-full max-w-2xl z-10 mx-4">

          <button
            onClick={() => navigate('/admin-books')}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors text-2xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
            {isEdit ? 'Edit Book' : 'Add New Book'}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-bold block text-gray-700">Book Title *</label>
              <input
                className="w-full border p-2 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold block text-gray-700">Author *</label>
                <input
                  className="w-full border p-2 rounded bg-gray-50"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
                {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
              </div>
              <div>
                <label className="text-sm font-bold block text-gray-700">Price (₹) *</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded bg-gray-50"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold block text-gray-700">Stock Quantity *</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded bg-gray-50"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                />
                {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity}</p>}
              </div>
              <div>
                <label className="text-sm font-bold block text-gray-700">Category *</label>
                <select
                  className="w-full border p-2 rounded bg-gray-50"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Non-fiction">Non-fiction</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold block text-gray-700">Description *</label>
              <textarea
                className="w-full border p-2 rounded bg-gray-50 h-20 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="text-sm font-bold block text-gray-700">Cover Image *</label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm border p-2 rounded bg-gray-50"
                onChange={handleImageChange}
              />
              {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage}</p>}

              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-20 w-16 object-cover rounded shadow border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-blue-700 hover:from-yellow-600 hover:to-blue-800 text-white py-3 rounded-lg font-bold shadow-lg transition-all transform active:scale-95"
            >
              {loading ? 'Processing...' : (isEdit ? 'Update Book' : 'Add Book')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;