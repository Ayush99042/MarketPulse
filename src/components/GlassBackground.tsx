import React from 'react';

export const GlassBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* Top Left Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse duration-[10s]" />
      
      {/* Middle Right Blob */}
      <div className="absolute top-[20%] right-[-5%] w-[40%] h-[60%] rounded-full bg-indigo-500/15 blur-[100px] animate-pulse duration-[8s] delay-1000" />
      
      {/* Bottom Left Blob */}
      <div className="absolute bottom-[-10%] left-[5%] w-[45%] h-[40%] rounded-full bg-emerald-500/10 blur-[90px] animate-pulse duration-[12s] delay-500" />
      
      {/* Additional Center Accent */}
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[130px]" />
    </div>
  );
};
