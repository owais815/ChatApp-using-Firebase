import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>No user logged in</p>;

  return (
    <div className="p-4 border border-gray-300 bg-white">
      <h2 className="text-lg font-semibold mb-4">User Profile</h2>
      <div className="flex items-center">
        <img src={user.photoURL} alt="User Avatar" className="w-12 h-12 rounded-full mr-4" />
        <div>
          <p className="text-xl font-semibold">{user.displayName}</p>
          <p className="text-gray-600">{user.email}</p>
          
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
