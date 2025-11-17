'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Sparkles, AlertCircle } from 'lucide-react';

/**
 * TemplateCreator Component
 *
 * This is a simplified template creator for the marketplace foundation.
 * A full implementation would include:
 * - Character template builder
 * - NPC creator
 * - Map uploader
 * - Encounter designer
 * - Item library
 *
 * For now, this serves as a placeholder and basic demonstration.
 */
export default function TemplateCreator() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    genre: 'fantasy' as const,
    difficulty: 'intermediate' as const,
    minPlayers: 3,
    maxPlayers: 5,
    lore: '',
    isPublic: true,
    tags: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const createTemplate = useMutation(api.templates.createTemplate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Get actual user ID from auth context
      const userId = 'placeholder_user_id' as Id<'users'>;

      // For now, create a minimal template
      // In production, users would build character templates, NPCs, etc.
      await createTemplate({
        name: formData.name,
        description: formData.description,
        genre: formData.genre,
        difficulty: formData.difficulty,
        recommendedPlayers: {
          min: formData.minPlayers,
          max: formData.maxPlayers,
        },
        lore: formData.lore,
        characterTemplates: [], // Would be built in advanced creator
        npcTemplates: [],
        mapTemplates: [],
        encounterTemplates: [],
        starterItems: [],
        authorId: userId,
        isOfficial: false,
        isPublic: formData.isPublic,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        // Reset form
        setFormData({
          name: '',
          description: '',
          genre: 'fantasy',
          difficulty: 'intermediate',
          minPlayers: 3,
          maxPlayers: 5,
          lore: '',
          isPublic: true,
          tags: '',
        });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to create template:', error);
      alert('Failed to create template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Info Banner */}
      <Card className="mb-6 p-4 bg-blue-500/10 border-blue-500/30">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <p className="font-semibold mb-1">Community Template Creator (Beta)</p>
            <p className="text-blue-300">
              This is a simplified version of the template creator. Advanced features for adding
              characters, NPCs, maps, and encounters will be available in a future update. For now,
              you can create a basic template framework.
            </p>
          </div>
        </div>
      </Card>

      {/* Success Message */}
      {submitSuccess && (
        <Card className="mb-6 p-4 bg-green-500/10 border-green-500/30">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span className="text-green-300">Template created successfully!</span>
          </div>
        </Card>
      )}

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Template Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Awesome Campaign"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A brief description of your campaign..."
                  required
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Genre *</label>
                  <select
                    value={formData.genre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        genre: e.target.value as typeof formData.genre,
                      })
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="fantasy">Fantasy</option>
                    <option value="sci-fi">Sci-Fi</option>
                    <option value="horror">Horror</option>
                    <option value="modern">Modern</option>
                    <option value="steampunk">Steampunk</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="post-apocalyptic">Post-Apocalyptic</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as typeof formData.difficulty,
                      })
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Min Players *
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.minPlayers}
                    onChange={(e) =>
                      setFormData({ ...formData, minPlayers: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Max Players *
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.maxPlayers}
                    onChange={(e) =>
                      setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lore */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Lore & Setting</h3>
            <textarea
              value={formData.lore}
              onChange={(e) => setFormData({ ...formData, lore: e.target.value })}
              placeholder="Describe the world, history, and setting of your campaign..."
              required
              rows={6}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Tags</h3>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="adventure, mystery, combat, roleplay (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add tags to help others find your template
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-400">Make this template public</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⚙</span>
                  Creating Template...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Template
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
