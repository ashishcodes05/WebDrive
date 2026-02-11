import React from "react"
import { Shield, Zap, FolderTree, Search, Share2, Cloud } from "lucide-react"

const FeatureSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure by Design",
      description:
        "End-to-end encryption and advanced access controls keep your data protected at every layer.",
    },
    {
      icon: Zap,
      title: "High-Speed Transfers",
      description:
        "Optimized infrastructure ensures fast uploads and seamless downloads, even for large files.",
    },
    {
      icon: FolderTree,
      title: "Intelligent Organization",
      description:
        "Structure your files effortlessly with intuitive folders, tagging, and smart management tools.",
    },
    {
      icon: Search,
      title: "Real-Time Search",
      description:
        "Locate documents instantly with powerful real-time indexing across your entire drive.",
    },
    {
      icon: Share2,
      title: "Secure Sharing",
      description:
        "Share files with confidence using customizable permission controls.",
    },
    {
      icon: Cloud,
      title: "Access Anywhere",
      description:
        "Access your files securely from any device, anytime — without compromise.",
    },
  ]

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm backdrop-blur-md">
          Core Features
        </div>
        <h2 className="text-white font-semibold text-4xl md:text-5xl mt-6">
          Everything You Need to Store Smarter
        </h2>

        <p className="text-white/60 max-w-xl mx-auto mt-4">
          Built for speed, designed for security — WebDrive simplifies how you manage and access your files.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-7 backdrop-blur-xl hover:border-blue-500/40 hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-blue-600/5 blur-xl"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-600/15 border border-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-secondary-accent fill-current" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/60 mt-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
