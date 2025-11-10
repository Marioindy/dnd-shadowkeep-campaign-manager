'use client';

import { useState } from 'react';
import { Doc } from '@/convex/_generated/dataModel';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Users, Star, Download, BookOpen } from 'lucide-react';
import TemplateDetailModal from './TemplateDetailModal';

interface TemplateCardProps {
  template: Doc<'campaignTemplates'>;
}

const genreColors: Record<string, string> = {
  fantasy: 'bg-purple-500/20 text-purple-300',
  'sci-fi': 'bg-blue-500/20 text-blue-300',
  horror: 'bg-red-500/20 text-red-300',
  modern: 'bg-gray-500/20 text-gray-300',
  steampunk: 'bg-amber-500/20 text-amber-300',
  cyberpunk: 'bg-pink-500/20 text-pink-300',
  'post-apocalyptic': 'bg-orange-500/20 text-orange-300',
  custom: 'bg-green-500/20 text-green-300',
};

const difficultyColors: Record<string, string> = {
  beginner: 'text-green-400',
  intermediate: 'text-yellow-400',
  advanced: 'text-orange-400',
  expert: 'text-red-400',
};

export default function TemplateCard({ template }: TemplateCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const genreClass = genreColors[template.genre] || genreColors.custom;
  const difficultyClass = difficultyColors[template.difficulty] || difficultyColors.intermediate;

  return (
    <>
      <Card className="group hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
        <div onClick={() => setShowDetail(true)} className="p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors">
                {template.name}
              </h3>
              {template.isOfficial && (
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
                  Official
                </span>
              )}
            </div>

            {/* Genre & Difficulty */}
            <div className="flex gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded ${genreClass}`}>
                {template.genre.replace('-', ' ').toUpperCase()}
              </span>
              <span className={`text-xs px-2 py-1 ${difficultyClass}`}>
                {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{template.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400">
                {template.recommendedPlayers.min}-{template.recommendedPlayers.max} players
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400">
                {template.characterTemplates.length} characters
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400">{template.downloads} downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-400">{template.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Tags */}
          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{template.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetail(true);
              }}
              className="flex-1"
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>

      {/* Detail Modal */}
      {showDetail && (
        <TemplateDetailModal template={template} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
