'use client';

export default function DocumentUploader() {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Uploading document:', file.name);
      // TODO: Implement Convex file upload
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Upload Document</h2>

      <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-red-500 transition-colors cursor-pointer">
        <input
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
          id="document-upload"
        />
        <label htmlFor="document-upload" className="cursor-pointer">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm">Click to upload</p>
            <p className="text-xs text-gray-500 mt-1">PDF, TXT, DOC (max 25MB)</p>
          </div>
        </label>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Category</label>
          <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none">
            <option>Campaign Notes</option>
            <option>NPCs</option>
            <option>Lore</option>
            <option>Session Notes</option>
            <option>Other</option>
          </select>
        </div>

        <button className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
          Upload Document
        </button>
      </div>
    </div>
  );
}
