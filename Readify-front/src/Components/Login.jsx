import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axios from "axios"
const coverImage = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop";
const logoImage = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format&fit=crop";
import Swal from 'sweetalert2'
import { useCart } from '../CartContext'; // 1. Import useCart

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // 2. Destructure setCartItems from the hook
  const { setCartItems } = useCart();

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
    if (!email) tempErrors.email = "Email is required";
    else if (!emailRegex.test(email)) tempErrors.email = "Please enter a valid email";
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Must be at least 6 characters";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const url = `${import.meta.env.VITE_API_URL}/users/login`;
        const response = await axios.post(url, { email, password });
        if (response.status === 200) {
          const { token, role, username, id } = response.data;

          // 3. Store user details
          localStorage.setItem('token', token);
          localStorage.setItem('userRole', role);
          localStorage.setItem('userName', username);
          localStorage.setItem('userId', id);

          const savedCart = localStorage.getItem(`cart_${id}`);
          setCartItems(savedCart ? JSON.parse(savedCart) : []);

          Swal.fire({
            title: 'Login Successful!',
            text: `Welcome back, ${username}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            if (role.toLowerCase() === 'admin') {
              navigate('/dashboard');
            } else {
              navigate('/home');
            }
          });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Login failed.";
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#0f172a',
        });
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Main Card - Reduced max-width to 4xl to match the smaller height */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full border border-slate-100"
      >

        {/* Left Side: Visual/Branding */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={coverImage}
            alt="Bookshelf"
            className="object-cover h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex flex-col justify-end p-10 text-white">
            <h1 className="text-3xl font-bold mb-3">Readify Market</h1>
            <p className="text-blue-100 text-base">"The more that you read, the more things you will know."</p>
          </div>
        </div>

        {/* Right Side: Login Form - Reduced padding from p-16 to py-10 px-8 */}
        <div className="w-full md:w-1/2 py-10 px-8 lg:px-12 flex flex-col justify-center bg-white">
          <div className="flex flex-col items-center mb-8 text-center">
            <motion.img
              whileHover={{ rotate: 10 }}
              src={logoImage}
              alt="Logo"
              className="w-14 h-14 rounded-2xl shadow-lg mb-4"
            />
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1">Enter your credentials to access your library</p>
          </div>

          {/* Reduced spacing from space-y-5 to space-y-4 */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.email ? 'border-red-400 ring-2 ring-red-50' : 'border-slate-200'} rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200`}
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.email}</motion.p>}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 pr-12 py-2.5 bg-slate-50 border ${errors.password ? 'border-red-400 ring-2 ring-red-50' : 'border-slate-200'} rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200`}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.password}</motion.p>}
            </div>

            {/* Login Button - Slightly smaller padding */}
            <motion.button
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full ${loading ? 'bg-slate-400' : 'bg-slate-900'} text-white py-3.5 rounded-xl mt-2 font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all group`}
            >
              {loading ? "Authenticating..." : "Sign In"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          {/* Bottom Link - Reduced margin top from mt-10 to mt-6 */}
          <p className="mt-6 text-center text-sm text-slate-600">
            New to Readify?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-600 font-bold hover:underline underline-offset-4"
            >
              Create an account
            </button>
          </p>
        </div>
      </motion.div>
    </div>

  );
};

export default Login;