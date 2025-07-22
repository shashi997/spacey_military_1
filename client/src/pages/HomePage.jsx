import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../features/home/HeroSection'
import FeatureSection from '../features/home/FeatureSection'
import FooterSection from '../features/home/FooterSection'

const HomePage = () => {
  return (
    <div className='bg-gray-800'>
        <Navbar />
      <HeroSection />
      <FeatureSection /> 
      <FooterSection />
    </div>
  )
}

export default HomePage