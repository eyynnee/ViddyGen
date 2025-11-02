import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-lg animate-fade-in">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
      <p className="mt-4 text-lg text-gray-300 text-center">{message}</p>
    </div>
  );
};

export default Loader;
