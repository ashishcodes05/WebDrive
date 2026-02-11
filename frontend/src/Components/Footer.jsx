import React from "react"
import { Cloud, Github, Twitter, Linkedin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2">
              <Cloud className="text-blue-400 w-6 h-6" />
              <span className="text-white font-semibold text-lg">
                WebDrive
              </span>
            </div>

            <p className="text-white/60 text-sm mt-4 leading-relaxed">
              Secure, high-performance cloud storage built for modern workflows.
              Store smarter. Access faster.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-white/60 hover:text-blue-400 transition">
                <Github size={18} />
              </a>
              <a href="#" className="text-white/60 hover:text-blue-400 transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white/60 hover:text-blue-400 transition">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="hover:text-blue-400 cursor-pointer transition">Features</li>
              <li className="hover:text-blue-400 cursor-pointer transition">Pricing</li>
              <li className="hover:text-blue-400 cursor-pointer transition">Security</li>
              <li className="hover:text-blue-400 cursor-pointer transition">Roadmap</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="hover:text-blue-400 cursor-pointer transition">About</li>
              <li className="hover:text-blue-400 cursor-pointer transition">Careers</li>
              <li className="hover:text-blue-400 cursor-pointer transition">Blog</li>
              <li className="hover:text-blue-400 cursor-pointer transition">Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="hover:text-blue-400 cursor-pointer transition">Privacy Policy</li>
              <li className="hover:text-blue-400 cursor-pointer transition">Terms of Service</li>
              <li className="hover:text-blue-400 cursor-pointer transition">Cookie Policy</li>
            </ul>
          </div>

        </div>
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} WebDrive. All rights reserved.</p>
          <p className="mt-4 md:mt-0">
            Built with performance & security in mind.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
