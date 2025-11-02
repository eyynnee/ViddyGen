import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.75.75V9h3.75a.75.75 0 010 1.5H9.75v3.75a.75.75 0 01-1.5 0V10.5H4.5a.75.75 0 010-1.5H8.25V5.25A.75.75 0 019 4.5z"
      clipRule="evenodd"
    />
    <path d="M14.25 10.5a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
    <path
      fillRule="evenodd"
      d="M16.5 15a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z"
      clipRule="evenodd"
    />
    <path d="M19.5 15.75a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" />
    <path
      fillRule="evenodd"
      d="M19.125 4.875A.75.75 0 0119.5 4.5h.375a.75.75 0 010 1.5H19.5a.75.75 0 01-.375-.125z"
      clipRule="evenodd"
    />
    <path d="M19.5 7.5a.75.75 0 00-.375.125l-.375.125a.75.75 0 00.75.75l.375-.125A.75.75 0 0019.5 7.5z" />
  </svg>
);

export default SparklesIcon;
