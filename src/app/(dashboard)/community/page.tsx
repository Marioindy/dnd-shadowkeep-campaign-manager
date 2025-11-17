import { Metadata } from 'next';
import CommunityHub from './components/CommunityHub';

export const metadata: Metadata = {
  title: 'Community | D&D Campaign Manager',
  description: 'Discover and share campaigns, characters, and maps with the community',
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <CommunityHub />
      </div>
    </div>
  );
}
