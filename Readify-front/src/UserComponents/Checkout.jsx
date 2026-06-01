import React, { useState } from 'react';
import axios from 'axios';
import UserNav from './UserNav';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // New Loading State
  
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const handlePlaceOrder = async () => {
    // 1. Basic Validation
    if (cartItems.length === 0) return Swal.fire('Wait!', 'Your cart is empty', 'warning');
    if (!shippingAddress || !billingAddress) return Swal.fire('Error', 'Please fill in both addresses', 'error');

    setLoading(true); // Start Loading

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const payload = {
        user: userId,
        orderItems: cartItems.map(item => ({
          book: item._id,
          quantity: item.qty
        })),
        shippingAddress: shippingAddress,
        billingAddress: billingAddress
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/orders/addOrder`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsSuccess(true);
      clearCart(); 
    } catch (error) {
      console.error("Order error:", error);
      const errorMsg = error.response?.data?.message || "Failed to place order";
      Swal.fire('Order Failed', errorMsg, 'error');
    } finally {
      setLoading(false); // Stop Loading regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-emerald-50">
      <UserNav />
      <div className="max-w-3xl mx-auto mt-10 bg-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-slate-700 mb-8">Order Confirmation</h2>
        
        {/* Invoice Summary */}
        <div className="border-l-4 border-yellow-400 p-6 bg-gray-50 rounded-r-xl mb-6">
          <h3 className="font-bold text-indigo-900 mb-4">Invoice</h3>
          <div className="space-y-4 text-sm text-gray-600">
             {cartItems.map((item) => (
                <div key={item._id} className="bg-white p-3 rounded-lg border flex justify-between">
                   <div>
                      <p className="font-bold text-slate-800">{item.title}</p>
                      <p>Quantity: {item.qty}</p>
                   </div>
                   <p className="font-bold">₹{item.price * item.qty}</p>
                </div>
             ))}
             <p className="text-lg font-bold text-yellow-600">Total Amount: ₹{totalAmount}</p>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="border-l-4 border-blue-400 p-6 bg-blue-50/30 rounded-r-xl">
          <h3 className="font-bold text-indigo-900 mb-4">Enter Shipping Details</h3>
          <label className="text-xs font-bold block mb-1">Shipping Address:</label>
          <input 
            className="w-full p-2 border rounded mb-4 text-sm focus:ring-1 ring-blue-400 outline-none" 
            placeholder="Enter shipping address" 
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />
          
          <label className="text-xs font-bold block mb-1">Billing Address:</label>
          <input 
            className="w-full p-2 border rounded text-sm focus:ring-1 ring-blue-400 outline-none" 
            placeholder="Enter billing address" 
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
          />
        </div>

        {/* Improved Button with Loading State */}
        <button 
          onClick={handlePlaceOrder} 
          disabled={loading}
          className={`mt-8 w-full md:w-auto px-8 py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center space-x-2 
            ${loading 
              ? "bg-emerald-300 cursor-not-allowed" 
              : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}
        >
          {loading ? (
            <>
              {/* Simple CSS Spinner */}
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>

      {/* Success Modal */}
      {isSuccess && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
           <div className="bg-white p-10 rounded-2xl shadow-2xl text-center">
              <p className="text-lg font-bold mb-6">🎉 Order placed successfully!</p>
              <button 
                onClick={() => navigate('/user-books')} 
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-600"
              >
                Continue Shopping
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;