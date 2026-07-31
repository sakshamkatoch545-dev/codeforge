import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-12 bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-sm text-gray-500 z-10">
      &copy; {new Date().getFullYear()} CodeForge. All rights reserved.
    </footer>
  );
};

export default Footer;
