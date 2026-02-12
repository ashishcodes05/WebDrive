import { Crown } from "lucide-react";
import assets from "../assets/assets";
import WebDriveBackground from "../Components/WebDriveBackground";
import FeatureSection from "../Components/FeatureSection";
import AboutSection from "../Components/AboutSection";
import PricingSection from "../Components/PricingSection";
import { Link } from "react-router";

const Home = () => {
  return (
    <>
      <section className="flex flex-col items-center text-white text-sm bg-background min-h-screen overflow-hidden">
        <WebDriveBackground className='fixed inset-0 z-0' />
        <div
          id="mobile-navLinks"
          className="fixed inset-0 z-100 bg-black/60 backdrop-blur flex flex-col items-center justify-center text-xl gap-8 md:hidden transition-transform duration-300 -translate-x-full"
        >
          <a href="#products">Products</a>
          <a href="#resources">Resources</a>
          <a href="#stories">Stories</a>
          <a href="#pricing">Pricing</a>
          <button
            id="close-menu"
            class="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-x-icon lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="relative inline-flex items-center gap-2 px-6 py-2 rounded-full 
        bg-blue-600/10 border border-blue-500/20 
        text-blue-400 text-sm backdrop-blur-md overflow-hidden mt-12">

          <div className="absolute inset-0 bg-blue-500/5 blur-xl"></div>

          <span className="relative z-10 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Secure • Fast • Cloud Powered
          </span>
        </div>

        <div className="flex flex-col items-center justify-end z-40">
          <h1 className="text-center text-5xl leading-[68px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-2xl">
            <span className="text-primary-accent">Fast.</span> <span className="text-secondary-accent">Secure.</span> <span className="text-secondary">Simplified.</span> Cloud Storage.
          </h1>
          <p className="text-center text-base max-w-lg mt-2">
            A smarter way to store and access your files—anytime, anywhere. Your files stay private, encrypted, and always under your control.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <Link to="/register" className="flex items-center gap-2 bg-primary-accent hover:bg-primary-accent/80 text-white active:scale-95 rounded-lg px-7 h-11">
              Get Free Access
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.166 10h11.667m0 0L9.999 4.165m5.834 5.833-5.834 5.834"
                  stroke="#fff"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Link>
            <button className="flex items-center gap-2 border border-secondary-400 bg-black/50 font-bold text-secondary-accent hover:border-slate-400 hover:text-slate-300 active:scale-95 transition rounded-lg px-8 h-11">
              Go Premium
              <Crown className="text-yellow-500" size={16} />
            </button>
          </div>
          <div className="p-2 border border-secondary-accent mt-12 rounded-2xl bg-card-bg/80 backdrop-blur-xl shadow-xl shadow-black/40 overflow-hidden">
            <img
              src={assets.directoryView}
              className="w-full rounded-[15px] max-w-2xl"
              alt="hero section showcase"
            />
          </div>
        </div>
      </section>
      <FeatureSection />
      <PricingSection />
      <AboutSection />
    </>
  );
};

export default Home;
