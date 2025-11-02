import React, { useEffect } from "react";

interface ApiKeySelectorProps {
  onSelectKey: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onSelectKey }) => {
  // fire once, skip the API-key screen
  useEffect(() => {
    onSelectKey();
  }, [onSelectKey]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">Starting app…</h2>
        <p className="text-gray-400">Loading without API key check.</p>
      </div>
    </div>
  );
};

export default ApiKeySelector;
