import React from 'react';
import AdminNav from '../AdminComponents/AdminNav';
import UserNav from '../UserComponents/UserNav';

// 1. IMPORT YOUR HERO IMAGE
const homeCover = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop";

const HomePage = () => {
  // Get the role from localStorage to decide which nav to show
  const userRole = localStorage.getItem('userRole');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-emerald-50">
      {/* 2. CONDITIONAL NAVIGATION */}
      {userRole === 'admin' ? <AdminNav /> : <UserNav />}

      <div className="max-w-6xl mx-auto p-10">
        
        {/* 3. HERO SECTION (Image with Overlay) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12">
          <img 
            src={homeCover} 
            alt="Readify Market Cover" 
            className="w-full h-[450px] object-cover"
          />
          {/* Centered Overlay Box */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 px-10 py-5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h1 className="text-4xl font-bold text-white tracking-widest">Readify Market</h1>
            </div>
          </div>
        </div>

        {/* 4. WELCOME MESSAGE */}
        <div className="text-center max-w-5xl mx-auto mb-20 px-4">
          <p className="text-gray-600 leading-relaxed text-lg">
            Welcome to <span className="font-bold text-slate-800">Readify Market</span>, 
            your one-stop destination for premium books across genres. Explore a wide range of 
            Fiction, Non-fiction, Science, Comics, Romance, Thriller, Fantasy, and Children’s books. 
            Whether you’re a casual reader or a book enthusiast, find your next favorite read here. 
            Start exploring today and enrich your reading journey!
          </p>
        </div>

        {/* 5. CONTACT US SECTION */}
        <div className="flex justify-center">
          <div className="bg-blue-50/40 p-10 rounded-3xl shadow-xl border-l-[12px] border-purple-900 w-full max-w-md text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 underline decoration-purple-300 underline-offset-8">
              Contact Us
            </h2>
            
            <div className="space-y-4 text-slate-700 font-medium">
              <p><span className="font-bold text-slate-900">Phone:</span> +91 98765 43210</p>
              <p><span className="font-bold text-slate-900">Email:</span> support@readifymarket.com</p>
              <p><span className="font-bold text-slate-900">Address:</span> 123 Book Lane, Literature City, IN</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;