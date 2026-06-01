import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import Swal from 'sweetalert2';

const OrderPlaced = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [viewingBooks, setViewingBooks] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const BASE_URL = process.env.BASE_URL;
  const API_URL = `${process.env.REACT_APP_API_URL}/orders`;
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/getAllOrders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to handle Status Change
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const token = localStorage.getItem('token');
      // Update this URL based on your specific backend route for updating orders
      await axios.put(`${API_URL}/updateStatus/${orderId}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state to reflect change immediately
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));

      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Order is now ${newStatus}`,
        timer: 1500,
        showConfirmButton: false,
        toast: true, // Optional: make it a toast for less intrusion
        position: 'top-end'
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to update status', 'error');
    } finally {
      setUpdatingOrderId(null); // Clear loading state
    }
  };

  const filteredOrders = orders.filter(order =>
    (order._id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Sort filtered orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.orderDate);
    const dateB = new Date(b.orderDate);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // const filteredOrders = orders.filter(order =>
  //   (order._id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   (order.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/deleteOrder/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove the order from local state
      setOrders(orders.filter(order => order._id !== orderId));
      setDeletingOrderId(null);

      Swal.fire({
        icon: 'success',
        title: 'Order Deleted',
        text: 'The order record has been removed.',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire('Error', 'Failed to delete the order', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Accepted':
        return 'bg-blue-100 text-blue-700 border-blue-200'; // New Color for Accepted
      case 'Dispatched':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <div className="max-w-5xl  mx-auto py-10 px-6">
        <h2 className="text-3xl text-center font-bold text-slate-800 mb-10">Orders Placed</h2>

        {/* Search and Sort Bar */}
        <div className="mb-8 flex flex-col md:flex-row justify-center items-center gap-4">
          {/* Search Box */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by Order ID or Username..."
              className="w-full p-3 pl-10 rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 ring-purple-400 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-gray-500 font-bold text-sm whitespace-nowrap">Sort by:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-3 rounded-xl border border-gray-200 shadow-sm outline-none bg-white focus:ring-2 ring-purple-400 text-sm font-semibold cursor-pointer"
            >
              <option value="desc">Date: Newest First</option>
              <option value="asc">Date: Oldest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedOrders.length > 0 ? (
              sortedOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl shadow-md border-l-[6px] border-purple-700 p-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Order ID: {order._id}</h3>

                    <div className="text-[15px] space-y-2 text-gray-700">
                      <p><span className="font-bold">Date:</span> {new Date(order.orderDate).toLocaleDateString()}</p>
                      <p><span className="font-bold">Total Amount:</span> ₹{order.totalAmount}</p>
                      <p className="flex items-center gap-2">
                        <span className="font-bold">Status:</span>
                        <span className={`px-3 py-0.5 rounded-full text-[11px] font-black uppercase border ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </p>
                      <p><span className="font-bold">Shipping:</span> <span className="text-gray-600">{order.shippingAddress}</span></p>
                      <p><span className="font-bold">Billing:</span> <span className="text-gray-600">{order.billingAddress}</span></p>
                    </div>

                    {/* Status Update Dropdown */}
                    <div className="flex items-center gap-3 py-2">
                      <label className="text-gray-500 font-bold font-medium text-sm">Update Status:</label>

                      {updatingOrderId === order._id ? (
                        /* Small spinner for the active update */
                        <div className="flex items-center gap-2 text-purple-600">
                          <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                          <span className="text-xs font-bold italic">Updating...</span>
                        </div>
                      ) : (
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={updatingOrderId !== null}
                          className="border rounded-md px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-semibold cursor-pointer hover:border-purple-300 transition-colors"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      )}
                    </div>

                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => setViewingBooks(order.orderItems || [])}
                        className="bg-[#3b82f6] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition shadow-sm"
                      >
                        View Books
                      </button>
                      <button
                        onClick={() => setViewingUser(order.user)}
                        className="bg-[#4ade80] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-green-500 transition shadow-sm"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => setDeletingOrderId(order._id)}
                        className="bg-red-50 text-red-500 border border-red-200 px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition shadow-sm ml-auto"
                      >
                        Delete Order
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">No orders found.</div>
            )}
          </div>
        )}
      </div>

      {deletingOrderId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Order?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. This will permanently remove the order record from the database.</p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingOrderId(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(deletingOrderId)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-200"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BOOK DETAIL MODAL --- */}
      {viewingBooks && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl relative w-80 text-center animate-in zoom-in duration-200 overflow-hidden">
            <button
              onClick={() => setViewingBooks(null)}
              className="absolute top-4 right-6 text-gray-400 text-2xl hover:text-red-500 transition-colors"
            >
              &times;
            </button>

            <h3 className="font-bold text-indigo-900 mb-4 border-b pb-2">Order Items</h3>

            <div className="max-h-[60vh] overflow-y-auto space-y-8 pr-2 custom-scrollbar">
              {viewingBooks.length > 0 ? (
                viewingBooks.map((item, index) => {
                  console.log("Order Item Data:", item);
                  // LOGIC FIX: Check if book info is in 'item.book' OR directly in 'item'
                  // Some backends flatten the object, some nest it.
                  const bookInfo = item.book || item;

                  // If we still don't have a title, the data might be missing
                  if (!bookInfo || !bookInfo.title) {
                    return (
                      <div key={index} className="pb-4 border-b border-gray-100 last:border-0 text-left">
                        <p className="font-bold text-red-500 text-sm">Book Info Missing</p>
                        <p className="text-xs text-gray-400 font-bold">Quantity: {item.quantity || item.qty}</p>
                      </div>
                    );
                  }

                  // Image URL logic (Handling full URLs or relative paths)
                  const imageUrl = bookInfo.coverImage
                    ? (bookInfo.coverImage.startsWith('http')
                      ? bookInfo.coverImage
                      : `${BASE_URL}${bookInfo.coverImage}`)
                    : 'https://via.placeholder.com/150';

                  return (
                    <div key={index} className="pb-6 border-b border-gray-100 last:border-0">
                      <img
                        src={imageUrl}
                        alt={bookInfo.title}
                        className="h-32 w-24 object-contain mx-auto mb-4 rounded shadow"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                      />
                      <div className="text-xs text-left space-y-2 font-bold text-gray-700">
                        <p><span className="text-gray-400">Title:</span> {bookInfo.title}</p>
                        <p><span className="text-gray-400">Author:</span> {bookInfo.author || 'Unknown'}</p>
                        <p><span className="text-gray-400">Price:</span> ₹{bookInfo.price}</p>
                        <p><span className="text-gray-400">Quantity:</span> {item.quantity || item.qty}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-xs italic">No items found</p>
              )}
            </div>

            <button
              onClick={() => setViewingBooks(null)}
              className="mt-6 w-full bg-gray-100 py-2 rounded-lg font-bold text-xs hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* --- PROFILE MODAL --- */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl relative w-full max-w-sm text-center">
            <button onClick={() => setViewingUser(null)} className="absolute top-4 right-6 text-gray-400">✕</button>
            <h3 className="font-bold text-[#581c87] text-xl mb-4 border-b pb-2">User Profile</h3>
            <div className="text-xs text-left space-y-3 font-bold text-gray-700">
              <p><span className="text-gray-400">Username:</span> {viewingUser.username}</p>
              <p><span className="text-gray-400">Email:</span> {viewingUser.email}</p>
              <p><span className="text-gray-400">Mobile:</span> {viewingUser.mobileNumber || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderPlaced;