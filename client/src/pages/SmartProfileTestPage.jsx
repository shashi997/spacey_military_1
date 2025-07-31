import React from 'react';
import { useAuth } from '../hooks/useAuth';
import SmartProfileDemo from '../components/dashboard/SmartProfileDemo';
import Navbar from '../components/ui/Navbar';

const SmartProfileTestPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <p>You need to be logged in to test the Smart Profile System.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <SmartProfileDemo userId={currentUser.uid} />
      </div>
    </div>
  );
};

export default SmartProfileTestPage; 