import { useEffect, useId, useMemo, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

const WebDriveBackground = ({ 
  className,
  background="linear-gradient(135deg, #0b1120 0%, #111827 50%, #000000 100%)"
}) => {
  const [init, setInit] = useState(false)
  const controls = useAnimation()
  const generatedId = useId()

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particleOptions = useMemo(() => ({
    background: {
      color: { value: "transparent" },
    },
    fullScreen: { enable: false },
    fpsLimit: 60,
    particles: {
      number: {
        value: 90,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: ["#3b82f6", "#60a5fa", "#93c5fd", "#ffffff"],
      },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.4, max: 0.9 },
        animation: {
          enable: true,
          speed: 1.5,
        },
      },
      size: {
        value: { min: 1.5, max: 3.5 },
      },
      move: {
        enable: true,
        speed: 1.2,
        random: true,
        outModes: { default: "out" },
      },
      links: {
        enable: true,
        distance: 130,
        color: "#60a5fa",
        opacity: 0.35,
        width: 1,
      },
    },
    detectRetina: true,
  }), [])

  const particlesLoaded = async (container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: { duration: 1 },
      })
    }
  }

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 0 }}
      className={`pointer-events-none absolute inset-0 z-0 ${className || ""}`}
      style={{ background }}
    >
      {init && (
        <Particles
          id={generatedId}
          particlesLoaded={particlesLoaded}
          options={particleOptions}
        />
      )}
    </motion.div>
  )
}

export default WebDriveBackground
