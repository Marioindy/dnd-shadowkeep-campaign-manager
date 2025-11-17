'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import TemplateCard from './TemplateCard';
import TemplateFilters from './TemplateFilters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Doc } from '@/convex/_generated/dataModel';

type Genre =
  | 'fantasy'
  | 'sci-fi'
  | 'horror'
  | 'modern'
  | 'steampunk'
  | 'cyberpunk'
  | 'post-apocalyptic'
  | 'custom';

type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export default function TemplateGallery() {
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [showOfficialOnly, setShowOfficialOnly] = useState(false);

  // Fetch templates based on filters
  const allTemplates = useQuery(api.templates.list);
  const officialTemplates = useQuery(api.templates.listOfficial);

  // Determine which templates to display
  const templates = showOfficialOnly ? officialTemplates : allTemplates;

  // Filter templates by genre and difficulty
  const filteredTemplates = templates?.filter((template) => {
    const genreMatch = selectedGenre === 'all' || template.genre === selectedGenre;
    const difficultyMatch =
      selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    return genreMatch && difficultyMatch;
  });

  if (!templates) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-400 mb-4">No templates available yet.</p>
        <p className="text-gray-500">Check back soon or create your own custom campaign!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <TemplateFilters
        selectedGenre={selectedGenre}
        selectedDifficulty={selectedDifficulty}
        showOfficialOnly={showOfficialOnly}
        onGenreChange={setSelectedGenre}
        onDifficultyChange={setSelectedDifficulty}
        onOfficialToggle={setShowOfficialOnly}
      />

      {/* Results count */}
      <div className="text-gray-400">
        Showing {filteredTemplates?.length || 0} template
        {filteredTemplates?.length !== 1 ? 's' : ''}
      </div>

      {/* Template Grid */}
      {filteredTemplates && filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template._id} template={template} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">No templates match your filters.</p>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
