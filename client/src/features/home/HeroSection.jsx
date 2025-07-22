import React from 'react'
import SignInButton from '../../components/SignInButton'
import SoldierImage from '../../assets/images/soldier-holding.png'

const HeroSection = () => {
  return (
        <section className="py-20 text-gray-100">
      <div className="container mx-auto px-4 flex items-center">
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-oswald font-bold mb-4">
            "We are always ready for tomorrow."
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Mission Statement text - Quote
          </p>
          <SignInButton />
        </div>
        <div className="hidden lg:block lg:w-1/2">
          <img src={SoldierImage} alt="Soldier" className="object-contain h-96" />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
