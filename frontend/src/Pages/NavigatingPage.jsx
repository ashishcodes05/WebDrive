import React from 'react'
import HeroNavbar from '../Components/HeroNavbar'
import { Outlet } from 'react-router'
import Footer from '../Components/Footer'

const NavigatingPage = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-40"
            style={{ background: "var(--color-primary-accent)" }}
          />
          <div
            className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full blur-[140px] opacity-30"
            style={{ background: "var(--color-secondary-accent)" }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-[600px] h-[300px] rounded-full blur-[160px] opacity-20"
            style={{ background: "var(--color-secondary)" }}
          />
        </div>
      <HeroNavbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default NavigatingPage