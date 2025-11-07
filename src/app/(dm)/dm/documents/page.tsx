import DMHeader from '../components/DMHeader';
import DocumentList from './components/DocumentList';
import DocumentUploader from './components/DocumentUploader';

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <DMHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
          <p className="text-gray-400">Manage campaign documents and resources</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <DocumentUploader />
          </div>
          <div className="lg:col-span-3">
            <DocumentList />
          </div>
        </div>
      </main>
    </div>
  );
}
