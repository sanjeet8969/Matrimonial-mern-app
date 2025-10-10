import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import OTPVerification from '../components/auth/OTPVerification';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import Dashboard from '../pages/Dashboard';
import MyProfile from '../pages/MyProfile';
import EditProfile from '../pages/EditProfile';
import ProfileCreation from '../components/profile/ProfileCreation';
import Matches from '../pages/Matches';
import Search from '../pages/Search';
import Interests from '../pages/Interests';
import Messages from '../pages/Messages';
import Notifications from '../pages/Notifications';
import Subscription from '../pages/Subscription';
import Settings from '../pages/Settings';
import AdminPanel from '../pages/AdminPanel';
import NotFound from '../pages/NotFound';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import Navbar from '../components/common/Navbar';

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-love"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes - NO LOGIN REQUIRED */}
      <Route path="/" element={<><Navbar /><Home /></>} />
      <Route path="/about" element={<><Navbar /><About /></>} />
      <Route path="/contact" element={<><Navbar /><Contact /></>} />
      <Route path="/privacy-policy" element={<><Navbar /><PrivacyPolicy /></>} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Private Routes - LOGIN REQUIRED */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/create" element={<ProfileCreation />} />
        <Route path="/profile/me" element={<MyProfile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/search" element={<Search />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/*" element={<AdminPanel />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
