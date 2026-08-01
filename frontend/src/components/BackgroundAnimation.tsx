import React from 'react';

export const BackgroundAnimation: React.FC = () => {
  return (
    <>
      <div 
        className="fixed bg-grid animate-grid-scroll z-0 pointer-events-none transform-gpu"
        style={{ top: '-40vh', bottom: '-20vh', left: '-10vw', right: '-10vw' }}
      ></div>
      
      {/* Multi-color Floating Blobs (Cream, Green, Blue, Pink, Purple) - Optimized radial gradients for bold rendering */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Cream Blob */}
        <div 
          className="absolute top-0 -left-4 w-[600px] h-[600px] opacity-75 dark:opacity-50 animate-blob transform-gpu"
          style={{ 
            background: 'radial-gradient(circle, rgba(255, 253, 208, 0.45) 0%, transparent 70%)',
            willChange: 'transform'
          }}
        />
        {/* Blue Blob */}
        <div 
          className="absolute top-0 right-1/4 w-[600px] h-[600px] opacity-75 dark:opacity-50 animate-blob animation-delay-2000 transform-gpu"
          style={{ 
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)',
            willChange: 'transform'
          }}
        />
        {/* Green Blob */}
        <div 
          className="absolute -bottom-8 left-20 w-[600px] h-[600px] opacity-75 dark:opacity-50 animate-blob animation-delay-4000 transform-gpu"
          style={{ 
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.35) 0%, transparent 70%)',
            willChange: 'transform'
          }}
        />
        {/* Purple Blob */}
        <div 
          className="absolute bottom-1/4 right-20 w-[600px] h-[600px] opacity-65 dark:opacity-40 animate-blob animation-delay-2000 transform-gpu"
          style={{ 
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)',
            willChange: 'transform'
          }}
        />
        {/* Pink Blob */}
        <div 
          className="absolute top-1/3 left-1/3 w-[600px] h-[600px] opacity-65 dark:opacity-40 animate-blob animation-delay-4000 transform-gpu"
          style={{ 
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%)',
            willChange: 'transform'
          }}
        />
        {/* Blue/Green Accent Blob */}
        <div 
          className="absolute bottom-0 right-1/3 w-[600px] h-[600px] opacity-65 dark:opacity-40 animate-blob transform-gpu"
          style={{ 
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)',
            willChange: 'transform'
          }}
        />
      </div>
    </>
  );
};

export default BackgroundAnimation;
