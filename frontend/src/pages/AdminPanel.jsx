import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import Dashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';
import VerificationRequests from '../components/admin/VerificationRequests';
import ReportManagement from '../components/admin/ReportManagement';
import SubscriptionManagement from '../components/admin/SubscriptionManagement';
import Analytics from '../components/admin/Analytics';

const AdminPanel = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="verifications" element={<VerificationRequests />} />
          <Route path="reports" element={<ReportManagement />} />
          <Route path="subscriptions" element={<SubscriptionManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
