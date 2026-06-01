import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from "axios"
import {
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  UserCircle
} from 'lucide-react';

const coverImage = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop";
import Swal from 'sweetalert2';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    let err = {};
    if (!formData.username) err.username = "Name is required";
    if (!formData.email) err.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) err.email = "Invalid email";

    if (!formData.mobile) err.mobile = "Required";
    else if (formData.mobile.length !== 10) err.mobile = "Must be 10 digits";

    if (formData.password.length < 6) err.password = "Min 6 characters";
    if (formData.password !== formData.confirmPassword) err.confirmPassword = "Mismatch";
    if (!formData.role) err.role = "Select a role";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);
      try {
        const dataToSend = {
          username: formData.username,
          email: formData.email,
          mobileNumber: formData.mobile,
          password: formData.password,
          userRole: formData.role
        };

        const url = `${import.meta.env.VITE_API_URL}/users/signup`;

        const response = await axios.post(
          url, dataToSend);

        if (response.status === 200) {
          // Save data to localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userRole', response.data.role);
          localStorage.setItem('username', response.data.username);

          // SUCCESS POP-UP
          Swal.fire({
            title: 'Welcome to Readify!',
            text: 'Your account has been created successfully.',
            icon: 'success',
            timer: 2500, // Slightly longer so they can read the welcome message
            showConfirmButton: false,
            background: '#ffffff',
            iconColor: '#3b82f6', // Your theme blue
          }).then(() => {
            // Redirect after the timer ends
            navigate('/');
          });
        }
      } catch (error) {
        const serverMsg = error.response?.data?.message || "Something went wrong";

        // ERROR POP-UP
        Swal.fire({
          title: 'Registration Failed',
          text: serverMsg,
          icon: 'error',
          confirmButtonColor: '#3b82f6',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (

    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full border border-slate-100"
      >

        {/* Left Side: Branding (Same as Login for consistency) */}
        <div className="hidden md:block w-5/12 relative overflow-hidden">
          <img
            src={coverImage}
            alt="Books"
            className="object-cover h-full w-full transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent flex flex-col justify-end p-10 text-white">
            <h2 className="text-2xl font-bold mb-2 font-serif">Join Readify</h2>
            <p className="text-blue-100/80">Start your journey into the world of thousands of stories and knowledge.</p>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full md:w-7/12 p-8 lg:p-12 bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">Create Account</h2>
            <p className="text-slate-500 mt-2">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">User Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border ${errors.username ? 'border-red-400' : 'border-slate-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all`}
                    placeholder="John Doe"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-[11px] font-medium ml-1">{errors.username}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all`}
                    placeholder="john@example.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[11px] font-medium ml-1">{errors.email}</p>}
              </div>

              {/* Mobile */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Mobile</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border ${errors.mobile ? 'border-red-400' : 'border-slate-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all`}
                    placeholder="10 digit number"
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
                {errors.mobile && <p className="text-red-500 text-[11px] font-medium ml-1">{errors.mobile}</p>}
              </div>

              {/* Role Select */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Role</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <select
                    className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border ${errors.role ? 'border-red-400' : 'border-slate-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all appearance-none text-slate-600`}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="">Select Role</option>
                    <option value="user">User / Reader</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                {errors.role && <p className="text-red-500 text-[11px] font-medium ml-1">{errors.role}</p>}
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border ${errors.password ? 'border-red-400' : 'border-slate-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all`}
                    placeholder="••••••••"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-[11px] font-medium ml-1">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-11 pr-12 py-2.5 bg-slate-50 border ${errors.confirmPassword ? 'border-red-400' : 'border-slate-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all`}
                    placeholder="••••••••"
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[11px] font-medium ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              disabled={loading}
              type="submit" // Ensure type is submit
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl mt-6 font-bold flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-slate-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 font-bold hover:underline underline-offset-4"
            >
              Log in instead
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;