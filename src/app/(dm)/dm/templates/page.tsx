import Link from 'next/link';
import TemplateGallery from './components/TemplateGallery';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Campaign Templates</h1>
          <p className="text-gray-400">
            Jumpstart your campaign with pre-built templates. Choose from classic adventures or create
            your own custom campaign.
          </p>
        </div>
        <Link href="/dm/templates/create">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        </Link>
      </div>

      <TemplateGallery />
    </div>
  );
}
