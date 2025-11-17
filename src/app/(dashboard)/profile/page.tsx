import { Metadata } from 'next';
import UserProfile from './components/UserProfile';

export const metadata: Metadata = {
  title: 'Profile | D&D Campaign Manager',
  description: 'View and edit your profile',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <UserProfile />
      </div>
    </div>
  );
}
