import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import {
  LogOut,
  BookOpen,
  LayoutDashboard,
  ShoppingBag,
  Star,
  Home,
  ChevronDown,
  PlusCircle,
  List
} from 'lucide-react';


const AdminNav = () => {
  const navigate = useNavigate();
  const { logoutResetCart } = useCart();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);

  const name = localStorage.getItem('userName') || "Admin";

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    logoutResetCart();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 transition-all duration-300 pb-1 border-b-2 font-medium ${isActive
      ? 'text-blue-400 border-blue-400'
      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
    }`;

  const isBooksPath = location.pathname.includes('admin-books') || location.pathname.includes('add-book');

  return (
    <>
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-40 shadow-xl border-b border-slate-800 px-6 lg:px-12 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BookOpen size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Readify Market
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          <NavLink to="/home" className={navLinkClass}><Home size={18} /> Home</NavLink>
          <NavLink to="/dashboard" className={navLinkClass}><LayoutDashboard size={18} /> Dashboard</NavLink>

          {/* BOOKS DROPDOWN SECTION */}
          <div
            className="relative group"
            onMouseEnter={() => setIsBooksDropdownOpen(true)}
            onMouseLeave={() => setIsBooksDropdownOpen(false)}
          >
            <button className={`flex items-center gap-2 transition-all duration-300 pb-1 border-b-2 font-medium ${isBooksPath
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
              }`}>
              <BookOpen size={18} /> Books <ChevronDown size={14} className={`transition-transform duration-300 ${isBooksDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isBooksDropdownOpen && (
              <div className="absolute top-full left-0 mt-0 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <NavLink
                  to="/admin-books"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 hover:text-blue-400 transition-colors"
                >
                  <List size={16} /> Manage Books
                </NavLink>
                <NavLink
                  to="/add-book"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 hover:text-blue-400 transition-colors"
                >
                  <PlusCircle size={16} /> Add Books
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/admin-orders" className={navLinkClass}><ShoppingBag size={18} /> Orders</NavLink>
          <NavLink to="/admin-reviews" className={navLinkClass}><Star size={18} /> Reviews</NavLink>
        </div>

        {/* Profile & Logout */}
        <div className="flex gap-6 items-center">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-gray-200">{name}</span>
            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">Administrator</span>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg transition-all border border-red-500/20 font-bold text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-4 border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="text-red-500" size={30} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Logout Confirmation</h2>
            <p className="text-gray-500 mb-8">Are you sure you want to log out of your admin account?</p>
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

export default AdminNav;