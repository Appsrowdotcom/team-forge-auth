import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage: React.FC = () => {
  const { user, profile, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to their appropriate dashboard
  if (user && profile) {
    const redirectPath = profile.role === 'Admin' ? '/admin/dashboard' : '/user/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // If user is authenticated but profile is still loading, redirect to user dashboard as fallback
  if (user && !loading && !profile) {
    console.log('User authenticated but no profile found, redirecting to user dashboard');
    return <Navigate to="/user/dashboard" replace />;
  }

  return <AuthForm />;
};

export default AuthPage;