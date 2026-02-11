import { ShieldCheck, Cloud, Rocket } from "lucide-react"

const AboutSection = () => {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <div>
          <div className="inline-flex items-center px-5 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm backdrop-blur-md">
            About WebDrive
          </div>

          <h2 className="text-white font-semibold text-4xl md:text-5xl mt-6 leading-tight">
            Redefining the way you store and manage files
          </h2>

          <p className="text-white/60 mt-6 leading-relaxed text-lg">
            WebDrive is built to simplify digital storage in a world where data
            moves fast. We combine performance, security, and intelligent design
            to create a seamless cloud experience for individuals and teams.
          </p>

          <p className="text-white/60 mt-4 leading-relaxed">
            Whether you're managing personal documents or collaborating across
            projects, WebDrive ensures your files remain accessible, secure,
            and organized — without compromise.
          </p>
        </div>

        <div className="space-y-6">

          <div className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-6 backdrop-blur-xl hover:border-secondary-accent/40 transition duration-300">
            <ShieldCheck className="text-secondary-accent w-16 h-16" />
            <div>
              <h4 className="text-white font-semibold">Security First</h4>
              <p className="text-white/60 text-sm mt-1">
                Enterprise-level encryption and access controls protect your data at every stage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-6 backdrop-blur-xl hover:border-secondary-accent/40 transition duration-300">
            <Cloud className="text-secondary-accent w-16 h-16" />
            <div>
              <h4 className="text-white font-semibold">Built for the Cloud Era</h4>
              <p className="text-white/60 text-sm mt-1">
                Access your files anytime, from anywhere, across devices seamlessly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-6 backdrop-blur-xl hover:border-secondary-accent/40 transition duration-300">
            <Rocket className="text-secondary-accent w-14 h-14 mt-1" />
            <div>
              <h4 className="text-white font-semibold">Performance Driven</h4>
              <p className="text-white/60 text-sm mt-1">
                Designed with speed and reliability in mind for modern digital workflows.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default AboutSection
