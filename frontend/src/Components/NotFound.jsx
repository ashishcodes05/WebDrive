import React from "react"
import { CloudOff } from "lucide-react"

const NotFound = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 text-center bg-background overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 
        w-[600px] h-[600px] 
        bg-blue-600/10 
        rounded-full blur-[120px]" 
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6">
          <CloudOff className="w-16 h-16 text-blue-400" strokeWidth={1.5} />
        </div>
        <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent">
          404
        </h1>
        <div className="h-1 w-20 rounded bg-blue-500/40 my-6"></div>
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          Page Not Found
        </h2>
        <p className="text-white/60 mt-4 max-w-md leading-relaxed">
          The page you’re looking for may have been moved, deleted, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <a
            href="/"
            className="px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 
              text-white font-medium transition-all duration-300 active:scale-95"
          >
            Return Home
          </a>

          <a
            href="/contact"
            className="px-8 py-3 rounded-xl border border-white/10 
              bg-white/[0.03] backdrop-blur-xl 
              text-white/80 hover:border-blue-500/40 
              transition-all duration-300 active:scale-95"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}

export default NotFound
