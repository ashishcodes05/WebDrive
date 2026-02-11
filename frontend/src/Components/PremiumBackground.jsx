import React from "react"

const PremiumBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b1120]">
      <div className="absolute inset-0 
        bg-[linear-gradient(135deg,#0b1120_0%,#0f172a_40%,#000000_100%)]" 
      />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 
        w-[800px] h-[800px] 
        bg-blue-600/10 
        rounded-full 
        blur-[120px]" 
      />
      <div className="absolute bottom-0 right-0 
        w-[600px] h-[600px] 
        bg-indigo-500/10 
        rounded-full 
        blur-[140px]" 
      />
      <div className="absolute inset-0 opacity-[0.03] 
        bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] 
        [background-size:40px_40px]" 
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default PremiumBackground
