'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

type TabType = 'discover' | 'posts' | 'myContent';

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Community Hub
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Discover amazing campaigns, share your characters, and connect with
          fellow adventurers
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-4 border-b border-gray-800 pb-4">
        <Button
          variant={activeTab === 'discover' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('discover')}
        >
          Discover
        </Button>
        <Button
          variant={activeTab === 'posts' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('posts')}
        >
          Community Posts
        </Button>
        <Button
          variant={activeTab === 'myContent' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('myContent')}
        >
          My Shared Content
        </Button>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'discover' && <DiscoverTab />}
        {activeTab === 'posts' && <PostsTab />}
        {activeTab === 'myContent' && <MyContentTab />}
      </div>
    </div>
  );
}

function DiscoverTab() {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400">1,234</div>
              <div className="text-gray-400 mt-2">Shared Campaigns</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400">5,678</div>
              <div className="text-gray-400 mt-2">Character Builds</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">3,456</div>
              <div className="text-gray-400 mt-2">Battle Maps</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Browse Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CategoryCard
          title="Campaign Templates"
          description="Ready-to-play campaigns for your next adventure"
          icon="🎲"
          count={1234}
          href="/community/campaigns"
        />
        <CategoryCard
          title="Character Builds"
          description="Optimized character builds and strategies"
          icon="⚔️"
          count={5678}
          href="/community/characters"
        />
        <CategoryCard
          title="Battle Maps"
          description="Beautiful maps for your encounters"
          icon="🗺️"
          count={3456}
          href="/community/maps"
        />
      </div>

      {/* Featured Content */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          Featured This Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeaturedCard
            title="The Dragon's Lair Campaign"
            author="DMaster99"
            rating={4.8}
            downloads={234}
            category="Campaign"
          />
          <FeaturedCard
            title="Optimized Paladin Tank Build"
            author="CharacterCrafter"
            rating={4.9}
            downloads={567}
            category="Character"
          />
        </div>
      </div>
    </div>
  );
}

function PostsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Community Posts</h2>
        <Button>Create Post</Button>
      </div>

      <div className="space-y-4">
        <PostCard
          title="Amazing session last night!"
          author="DMaster99"
          type="showcase"
          likes={45}
          comments={12}
          preview="Our party finally defeated the ancient dragon after 3 sessions of buildup..."
        />
        <PostCard
          title="How do you handle homebrew magic items?"
          author="NewDM2024"
          type="question"
          likes={23}
          comments={34}
          preview="I'm new to DMing and wondering about balancing custom magic items..."
        />
        <PostCard
          title="Epic combat map I made"
          author="MapArtist"
          type="showcase"
          likes={89}
          comments={15}
          preview="Spent the weekend creating this detailed dungeon map..."
        />
      </div>
    </div>
  );
}

function MyContentTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Shared Content</h2>
        <Button>Share New Content</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg mb-4">
              You haven&apos;t shared any content yet
            </p>
            <p className="text-sm">
              Share your campaigns, characters, or maps with the community!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  count: number;
  href: string;
}

function CategoryCard({
  title,
  description,
  icon,
  count,
  href,
}: CategoryCardProps) {
  return (
    <Card className="hover:border-purple-500 transition-colors cursor-pointer">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="text-5xl">{icon}</div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
          <div className="text-gray-500 text-sm">{count.toLocaleString()} items</div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FeaturedCardProps {
  title: string;
  author: string;
  rating: number;
  downloads: number;
  category: string;
}

function FeaturedCard({
  title,
  author,
  rating,
  downloads,
  category,
}: FeaturedCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-gray-400 text-sm mt-1">by {author}</p>
          </div>
          <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded">
            {category}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>↓</span>
            <span>{downloads} downloads</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PostCardProps {
  title: string;
  author: string;
  type: string;
  likes: number;
  comments: number;
  preview: string;
}

function PostCard({
  title,
  author,
  type,
  likes,
  comments,
  preview,
}: PostCardProps) {
  const typeColors = {
    showcase: 'text-pink-400 bg-pink-400/10',
    question: 'text-blue-400 bg-blue-400/10',
    discussion: 'text-purple-400 bg-purple-400/10',
    story: 'text-green-400 bg-green-400/10',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            <p className="text-gray-400 text-sm mt-1">by {author}</p>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${
              typeColors[type as keyof typeof typeColors]
            }`}
          >
            {type}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-4">{preview}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>👍 {likes}</span>
          <span>💬 {comments}</span>
        </div>
      </CardContent>
    </Card>
  );
}
