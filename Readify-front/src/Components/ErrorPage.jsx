import React from 'react';

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white/80 p-12 rounded-2xl shadow-lg text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-slate-800">Oops! Something Went Wrong</h1>
        <p className="text-blue-500 my-4">Please try again later.</p>
        
        {/* Warning Icon Container */}
        <div className="flex justify-center mt-6">
           <div className="text-9xl text-gray-700">⚠️</div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;