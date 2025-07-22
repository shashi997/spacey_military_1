import React from 'react'

const FeatureSection = () => {
  return (
    <section className="py-20 bg-gray-800 text-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-oswald font-bold text-center mb-8">
          Our Missions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Mission 1</h3>
            <p className="text-gray-300">Description for Mission 1.</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Mission 2</h3>
            <p className="text-gray-300">Description for Mission 2.</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Mission 3</h3>
            <p className="text-gray-300">Description for Mission 3.</p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-400 italic">
            "A small quote or highlight about our missions."
          </p>
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
