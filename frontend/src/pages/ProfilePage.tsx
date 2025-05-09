/**
 * User profile page for ProfitLens.
 * Displays the user profile management component.
 */
import React from 'react';
import UserProfile from '@/components/auth/UserProfile';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-navy">
            Your Profile
          </h1>
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
