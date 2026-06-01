import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Components
import Login from './Components/Login';
import Signup from './Components/Signup';
import ForgotPassword from './Components/ForgotPassword';
import ErrorPage from './Components/ErrorPage';
import HomePage from './Components/HomePage';

// Admin Components
import Dashboard from './AdminComponents/Dashboard';
import BookForm from './AdminComponents/BookForm';
import OrderPlaced from './AdminComponents/OrderPlaced';
import AdminViewBooks from './AdminComponents/AdminViewBooks';
import AdminViewReviews from './AdminComponents/AdminViewReviews';

// User Components
import UserViewBooks from './UserComponents/UserViewBooks';
import UserReview from './UserComponents/UserReview';
import UserMyReview from './UserComponents/UserMyReview';
import Checkout from './UserComponents/Checkout';
import { CartProvider } from './CartContext';
import ProtectedRoute from './Components/PrivateRoute';
import UserViewOrders from './UserComponents/UserViewOrders';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
          </Route>

          {/* PROTECTED ADMIN ROUTES */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-books" element={<AdminViewBooks />} />
            <Route path="/add-book" element={<BookForm isEdit={false} />} />
            <Route path="/edit-book/:id" element={<BookForm isEdit={true} />} />
            <Route path="/admin-orders" element={<OrderPlaced />} />
            <Route path="/admin-reviews" element={<AdminViewReviews />} />
          </Route>

          {/* PROTECTED USER ROUTES */}
          <Route element={<ProtectedRoute allowedRole="user" />}>
            <Route path="/user-books" element={<UserViewBooks />} />
            <Route path="/write-review" element={<UserReview />} />
            <Route path="/my-reviews" element={<UserMyReview />} />
            <Route path="/my-orders" element={<UserViewOrders />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;