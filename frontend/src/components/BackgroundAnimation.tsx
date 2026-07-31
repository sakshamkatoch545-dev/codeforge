import React from 'react';

export const BackgroundAnimation: React.FC = () => {
  return (
    <>
      {/* Animated 3D Beehive Grid Background */}
      <div className="fixed inset-0 bg-grid animate-grid-scroll z-0"></div>
      
      {/* Multi-color Floating Blobs (White, Cream, Purple, Red, Pink) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#fffdd0] rounded-full mix-blend-multiply filter blur-3xl animate-blob dark:mix-blend-screen"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 dark:mix-blend-screen"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#fffdd0] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 dark:mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 dark:mix-blend-screen"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 dark:mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob dark:mix-blend-screen"></div>
      </div>
    </>
  );
};

export default BackgroundAnimation;
