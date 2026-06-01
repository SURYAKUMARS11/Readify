import React from 'react';
import logoImage from '../assets/images/logo.png';
import rightImgae from '../assets/images/forgotPassword.png'
import { useNavigate } from 'react-router-dom';
const ForgotPassword = () => {
  let navigate = useNavigate()
  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl flex max-w-4xl w-full overflow-hidden">
        {/* Left Side Form */}
        <div className="w-full md:w-1/2 p-12 text-center">
          <img src={logoImage} alt="Logo" className="mx-auto mb-2 h-10 w-auto" />
          <h2 className="text-2xl font-bold text-indigo-900">Forgot Password</h2>
          <p className="text-gray-500 text-sm mb-8">Enter your email to reset your password.</p>
          
          <div className="space-y-4 text-left">
            <label className="text-xs font-bold text-gray-600">Email *</label>
            <div className="flex gap-2">
              <input className="flex-1 p-2 border rounded-lg text-sm" placeholder="example@gmail.com" />
              <button className="bg-blue-400 text-white px-4 py-2 rounded-lg text-xs font-bold">Verify</button>
            </div>
            
            <label className="text-xs font-bold text-gray-600">New Password *</label>
            <input type="password" className="w-full p-2 border rounded-lg text-sm" placeholder="Enter new password" />
            
            <label className="text-xs font-bold text-gray-600">Confirm New Password *</label>
            <input type="password" className="w-full p-2 border rounded-lg text-sm" placeholder="Re-enter new password" />
            
            <button className="w-full bg-green-500 text-white py-3 rounded-xl font-bold mt-4 hover:bg-green-600 transition">Reset Password</button>
          </div>
          <p className="mt-6 text-xs">Remembered your password? <span className="text-blue-600 cursor-pointer " onClick={() => navigate('/')}>Login</span></p>
        </div>
        {/* Right Side Illustration */}
        <div className="hidden md:flex w-1/2 bg-blue-50 items-center justify-center p-10">
         <img src={rightImgae} alt="Logo" className="mx-auto mb-2" /> {/* Substitute for the illustration image */}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;