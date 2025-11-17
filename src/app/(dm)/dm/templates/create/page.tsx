import TemplateCreator from './components/TemplateCreator';

export default function CreateTemplatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create Custom Template</h1>
        <p className="text-gray-400">
          Build your own campaign template and share it with the community.
        </p>
      </div>

      <TemplateCreator />
    </div>
  );
}
