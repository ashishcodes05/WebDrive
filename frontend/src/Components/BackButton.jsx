import React from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router"

const BackButton = ({ label = "Go Back" }) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className="group inline-flex items-center gap-2 
        px-5 py-2.5 rounded-xl 
        bg-white/[0.03] border border-white/10 
        backdrop-blur-xl 
        text-white/80 
        hover:border-blue-500/40 
        hover:text-blue-400 
        transition-all duration-300 
        active:scale-95"
    >
      <ArrowLeft
        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
        strokeWidth={2}
      />
      {label}
    </button>
  )
}

export default BackButton
