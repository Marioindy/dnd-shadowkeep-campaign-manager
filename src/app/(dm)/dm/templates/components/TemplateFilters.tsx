'use client';

import { Filter } from 'lucide-react';

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

interface TemplateFiltersProps {
  selectedGenre: Genre | 'all';
  selectedDifficulty: Difficulty | 'all';
  showOfficialOnly: boolean;
  onGenreChange: (genre: Genre | 'all') => void;
  onDifficultyChange: (difficulty: Difficulty | 'all') => void;
  onOfficialToggle: (value: boolean) => void;
}

export default function TemplateFilters({
  selectedGenre,
  selectedDifficulty,
  showOfficialOnly,
  onGenreChange,
  onDifficultyChange,
  onOfficialToggle,
}: TemplateFiltersProps) {
  const genres: Array<{ value: Genre | 'all'; label: string }> = [
    { value: 'all', label: 'All Genres' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'horror', label: 'Horror' },
    { value: 'modern', label: 'Modern' },
    { value: 'steampunk', label: 'Steampunk' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'post-apocalyptic', label: 'Post-Apocalyptic' },
    { value: 'custom', label: 'Custom' },
  ];

  const difficulties: Array<{ value: Difficulty | 'all'; label: string }> = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-lg">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value as Genre | 'all')}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            {genres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty | 'all')}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </option>
            ))}
          </select>
        </div>

        {/* Official Only Toggle */}
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOfficialOnly}
              onChange={(e) => onOfficialToggle(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
            />
            <span className="text-sm text-gray-400">Official templates only</span>
          </label>
        </div>
      </div>
    </div>
  );
}
