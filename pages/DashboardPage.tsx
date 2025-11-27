
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import PresidentDashboard from '../components/dashboards/PresidentDashboard';
import UserDashboard from '../components/dashboards/UserDashboard';

const DashboardPage = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'president':
        return <PresidentDashboard />;
      case 'user':
        return <UserDashboard />;
      default:
        return <div>Invalid user role.</div>;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
