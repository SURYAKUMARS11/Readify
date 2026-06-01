import React, { useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import {
  LogOut,
  BookOpen,
  Star,
  Home,
  ShoppingCart,
  X,
  Package
} from 'lucide-react';
import { useCart } from '../CartContext';

const UserNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart, logoutResetCart } = useCart();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const name = localStorage.getItem('userName') || "User";

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/');
    logoutResetCart()
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 transition-all duration-300 pb-1 border-b-2 font-medium ${isActive
      ? 'text-blue-400 border-blue-400'
      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
    }`;

  return (
    <>
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-40 shadow-xl border-b border-slate-800 px-6 lg:px-12 flex justify-between items-center">

        {/* Logo Section */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BookOpen size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Readify Market
          </h1>
        </div>

        {/* User Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          <NavLink to="/home" className={navLinkClass}>
            <Home size={18} /> Home
          </NavLink>
          <NavLink to="/user-books" className={navLinkClass}>
            <BookOpen size={18} /> Books
          </NavLink>

          <NavLink
            to="/my-reviews"
            className={({ isActive }) => `flex items-center gap-1 transition-all duration-300 pb-1 border-b-2 font-medium ${isActive ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-white'}`}
          >
            <Star size={18} /> Review
          </NavLink>

          {/* --- ORDERS ICON LINK --- */}
          <NavLink to="/my-orders" className={navLinkClass}>
            <Package size={18} /> Orders {/* <--- Changed from "Orders" text to Icon + Text */}
          </NavLink>

        </div>

        {/* Profile & Logout Section */}
        <div className="flex gap-6 items-center">
          {/* --- CART ICON TRIGGER (Modified) --- */}
          <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(!isCartOpen)}>
            {/* Removed "Cart" text, kept only icon and count */}
            <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors pb-1">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900 animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-gray-200">{name}</span>
            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">Reader</span>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-all font-bold text-sm shadow-lg shadow-red-900/20"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* --- CART DROPDOWN (Matches Image) --- */}
        {isCartOpen && (
          <div className="absolute top-[70px] right-32 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 text-slate-800 animate-in fade-in zoom-in duration-200 z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-800 font-bold text-xl">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Item List */}
            <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item._id} className="border border-gray-100 rounded-xl p-4 shadow-sm bg-gray-50/50">
                    <h3 className="font-bold text-sm text-slate-800 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2 font-medium">
                      Quantity: {item.qty}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-6 italic">Cart is empty</p>
              )}
            </div>

            <div className="w-full h-[1px] bg-gray-100 mb-6"></div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { clearCart(); setIsCartOpen(false); }}
                disabled={cartItems.length === 0} // Disable if empty
                className={`flex-1 font-bold py-2.5 rounded-xl transition shadow-md text-sm
                ${cartItems.length === 0
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'}`}
              >
                Clear Cart
              </button>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                disabled={cartItems.length === 0} // Disable if empty
                className={`flex-1 font-bold py-2.5 rounded-xl transition shadow-md text-sm
                ${cartItems.length === 0
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'}`}
              >
                Checkout
              </button>
            </div>
            
          </div>
        )}
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-4 border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="text-red-500" size={30} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Logout Confirmation</h2>
            <p className="text-gray-500 mb-8">Are you sure you want to log out?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50">Cancel</button>
              <button onClick={confirmLogout} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-red-600 shadow-lg">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNav;