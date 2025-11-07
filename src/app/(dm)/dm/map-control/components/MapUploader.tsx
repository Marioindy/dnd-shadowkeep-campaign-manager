'use client';

export default function MapUploader() {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Uploading map:', file.name);
      // TODO: Implement Convex file upload
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Upload Map</h2>

      <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-red-500 transition-colors cursor-pointer">
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileUpload}
          className="hidden"
          id="map-upload"
        />
        <label htmlFor="map-upload" className="cursor-pointer">
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm">Click to upload</p>
            <p className="text-xs text-gray-500 mt-1">PNG or JPG (max 10MB)</p>
          </div>
        </label>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-gray-400 mb-2">Map Name</label>
        <input
          type="text"
          placeholder="Enter map name"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
        />
      </div>

      <button className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
        Upload Map
      </button>
    </div>
  );
}
