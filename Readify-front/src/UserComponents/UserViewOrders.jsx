import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import UserNav from './UserNav';

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingItems, setViewingItems] = useState(null); // Modal for items

  const BASE_URL = 'http://localhost:8080';
  const API_URL = `${BASE_URL}/api/orders`;

  const fetchMyOrders = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/getOrdersByUser/${userId}`, {
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
    fetchMyOrders();
  }, []);

  // --- BUTTON ACTIONS ---

  const handleTrackOrder = (status) => {
  // Define the stages exactly as they appear in your image
  const stages = ['Pending', 'Accepted', 'Dispatched', 'Out for Delivery', 'Delivered'];
  const currentStep = stages.indexOf(status);

  Swal.fire({
    title: 'Order Tracking',
    width: '700px',
    html: `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 40px; padding: 0 20px; position: relative;">
        <!-- Gray Background Line -->
        <div style="position: absolute; top: 12px; left: 50px; right: 50px; height: 2px; background-color: #e5e7eb; z-index: 0;"></div>
        
        ${stages.map((stage, index) => {
          const isCompleted = index <= currentStep;
          const dotColor = isCompleted ? '#22c55e' : '#d1d5db';
          
          return `
            <div style="display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; flex: 1;">
              <!-- Progress Dot -->
              <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${dotColor}; border: 4px solid white; box-shadow: 0 0 0 1px ${dotColor};"></div>
              
              <!-- Label -->
              <span style="font-size: 10px; font-weight: bold; color: ${isCompleted ? '#1e293b' : '#94a3b8'}; margin-top: 8px;">
                ${stage.replace(/\s/g, '')}
              </span>

              <!-- Connector Line (Turns Green) -->
              ${index < currentStep ? `
                <div style="position: absolute; top: 12px; left: 50%; width: 100%; height: 2px; background-color: #22c55e; z-index: -1;"></div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `,
    showConfirmButton: false,
    showCloseButton: true,
  });
};

  const handleCancelOrder = async (orderId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to cancel this order?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Cancel it!'
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_URL}/updateStatus/${orderId}`,
          { orderStatus: 'Cancelled' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchMyOrders(); // Refresh
        Swal.fire('Cancelled', 'Your order has been cancelled.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to cancel order', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav />
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold text-center text-slate-700 border-b-2 border-slate-200 pb-3 mb-8">Order History</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
            <p>Loading your orders...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 italic">You haven't placed any orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl shadow-md border-l-[6px] border-[#5D3F75] p-6 flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-gray-800">Order ID: {order._id}</h3>

                  <div className="text-[13px] text-gray-700 space-y-1">
                    <p><span className="font-bold">Status:</span> {order.orderStatus}</p>
                    <p><span className="font-bold">Total:</span> ₹{order.totalAmount}</p>
                    <p><span className="font-bold">Ship to:</span> {order.shippingAddress}</p>
                    <p><span className="font-bold">Bill to:</span> {order.billingAddress}</p>
                    <p><span className="font-bold">Date:</span> {new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>

                  <div className="space-y-2 mt-2">
                    {order.orderItems && order.orderItems.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400 flex justify-between items-center text-sm">
                        {/* 
         item is now the OrderItem object.
         item.book is the populated Book object.
      */}
                        <p>
                          <span className="font-bold">Book:</span> {item.book?.title || "Title Not Found"}
                        </p>
                        <p>
                          <span className="font-bold">Qty:</span> {item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleTrackOrder(order.orderStatus)}
                      className="bg-blue-500 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => setViewingItems(order.orderItems)}
                      className="bg-green-500 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-green-600 transition"
                    >
                      View Items
                    </button>
                    <button
                      disabled={order.orderStatus !== 'Pending'}
                      onClick={() => handleCancelOrder(order._id)}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition ${order.orderStatus === 'Pending'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* VIEW ITEMS MODAL */}
      {viewingItems && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setViewingItems(null)} className="absolute top-4 right-6 text-2xl text-gray-400">&times;</button>
            <h3 className="font-bold text-xl text-indigo-900 mb-6 border-b pb-2">Order Summary</h3>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {viewingItems.map((item, i) => (
                <div key={i} className="flex gap-4 items-center border-b pb-4 last:border-0">
                  <img
                    src={`${BASE_URL}${item.book?.coverImage}`}
                    className="w-16 h-20 object-contain rounded border"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                    alt=""
                  />
                  <div className="text-sm">
                    <p className="font-bold text-gray-800">{item.book?.title}</p>
                    <p className="text-gray-500">Price: ₹{item.book?.price}</p>
                    <p className="text-gray-500 font-semibold">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setViewingItems(null)}
              className="mt-6 w-full bg-slate-800 text-white py-2 rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;