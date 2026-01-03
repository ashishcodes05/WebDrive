import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
      
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></span>
        <span className="absolute inset-1 rounded-full border-4 border-transparent border-r-secondary animate-spin [animation-duration:1.2s]"></span>
        <span className="absolute inset-2 rounded-full border-4 border-transparent border-b-secondaryAccent animate-spin [animation-duration:1s]"></span>
      </div>

      <p className="text-sm tracking-widest text-textSecondary">
        {text}
      </p>
    </div>
  );
};

export default Loader;
