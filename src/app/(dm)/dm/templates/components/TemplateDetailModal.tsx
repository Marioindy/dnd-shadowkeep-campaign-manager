'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import {
  X,
  Users,
  Star,
  Download,
  Scroll,
  Map,
  Swords,
  UserCircle,
  Package,
  Sparkles,
} from 'lucide-react';

interface TemplateDetailModalProps {
  template: Doc<'campaignTemplates'>;
  onClose: () => void;
}

export default function TemplateDetailModal({ template, onClose }: TemplateDetailModalProps) {
  const [campaignName, setCampaignName] = useState(template.name);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const createCampaignFromTemplate = useMutation(api.templates.createCampaignFromTemplate);

  const handleCreateCampaign = async () => {
    setIsCreating(true);
    try {
      // TODO: Get actual DM user ID from auth context
      // For now, using a placeholder. This should be replaced with actual user ID from auth
      const dmId = 'placeholder_user_id' as Id<'users'>;

      const result = await createCampaignFromTemplate({
        templateId: template._id,
        dmId: dmId,
        campaignName: campaignName,
      });

      setShowSuccess(true);
      setTimeout(() => {
        // TODO: Navigate to the new campaign page
        // For now, just close the modal
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{template.name}</h2>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-purple-500/20 text-purple-300 text-sm px-3 py-1 rounded">
                {template.genre.replace('-', ' ').toUpperCase()}
              </span>
              <span className="bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded">
                {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
              </span>
              {template.isOfficial && (
                <span className="bg-green-500/20 text-green-300 text-sm px-3 py-1 rounded">
                  Official
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              <span>Campaign created successfully! Redirecting...</span>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-400">{template.description}</p>
          </div>

          {/* Lore */}
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-purple-400" />
              Lore & Setting
            </h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-300 whitespace-pre-line">{template.lore}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">Players</span>
              </div>
              <p className="text-xl font-bold">
                {template.recommendedPlayers.min}-{template.recommendedPlayers.max}
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Download className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">Downloads</span>
              </div>
              <p className="text-xl font-bold">{template.downloads}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-400">Rating</span>
              </div>
              <p className="text-xl font-bold">{template.rating.toFixed(1)}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <UserCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">Characters</span>
              </div>
              <p className="text-xl font-bold">{template.characterTemplates.length}</p>
            </Card>
          </div>

          {/* Characters Preview */}
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-blue-400" />
              Pre-made Characters ({template.characterTemplates.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {template.characterTemplates.map((char, idx) => (
                <Card key={idx} className="p-4">
                  <h4 className="font-bold mb-1">{char.name}</h4>
                  <p className="text-sm text-gray-400">
                    Level {char.level} {char.race} {char.class}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{char.backstory}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* NPCs Preview */}
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              NPCs ({template.npcTemplates.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {template.npcTemplates.map((npc, idx) => (
                <Card key={idx} className="p-4">
                  <h4 className="font-bold mb-1">{npc.name}</h4>
                  <p className="text-sm text-purple-400 mb-2">{npc.role}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{npc.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Maps Preview */}
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Map className="w-5 h-5 text-amber-400" />
              Maps ({template.mapTemplates.length})
            </h3>
            <div className="space-y-2">
              {template.mapTemplates.map((map, idx) => (
                <Card key={idx} className="p-3">
                  <h4 className="font-bold text-sm">{map.name}</h4>
                  <p className="text-xs text-gray-400">{map.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{map.markers.length} markers</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Encounters Preview */}
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Swords className="w-5 h-5 text-red-400" />
              Encounters ({template.encounterTemplates.length})
            </h3>
            <div className="space-y-2">
              {template.encounterTemplates.map((encounter, idx) => (
                <Card key={idx} className="p-3">
                  <h4 className="font-bold text-sm">{encounter.name}</h4>
                  <p className="text-xs text-gray-400">{encounter.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {encounter.enemies.length} enemies
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Starter Items */}
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              Starter Items ({template.starterItems.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {template.starterItems.map((item, idx) => (
                <div key={idx} className="bg-gray-800 p-2 rounded text-sm">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{item.type}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <span key={tag} className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Create Campaign Section */}
          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-xl font-semibold mb-4">Create Campaign from Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Campaign Name
                </label>
                <Input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
                  className="w-full"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2">What's Included:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ {template.characterTemplates.length} pre-made character templates</li>
                  <li>✓ {template.npcTemplates.length} NPCs with backstories</li>
                  <li>✓ {template.mapTemplates.length} maps with markers</li>
                  <li>✓ {template.encounterTemplates.length} ready-to-run encounters</li>
                  <li>✓ {template.starterItems.length} starter items</li>
                  <li>✓ Complete lore and world-building</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleCreateCampaign}
                  disabled={isCreating || !campaignName.trim()}
                  className="flex-1"
                >
                  {isCreating ? (
                    <>
                      <span className="animate-spin mr-2">⚙</span>
                      Creating Campaign...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Campaign
                    </>
                  )}
                </Button>
                <Button variant="secondary" onClick={onClose} disabled={isCreating}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
