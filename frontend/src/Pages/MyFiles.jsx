import React from 'react'
import DirectoryView from '../Components/DirectoryView'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

const MyFiles = () => {
  return (
    <div className='relative flex flex-col min-h-screen bg-background'>
        <Navbar />
        <DirectoryView />
        <Footer />
    </div>
  )
}

export default MyFiles