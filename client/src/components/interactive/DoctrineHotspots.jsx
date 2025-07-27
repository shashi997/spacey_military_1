import React, { useState } from 'react';
import { Shield, Star, Globe, Check } from 'lucide-react';

// --- Data for the interactive hotspots ---
const DOCTRINE_DATA = [
  {
    id: 'uk',
    name: 'UK Space Command',
    icon: <Shield size={50} className="text-blue-400" />,
    description: [
      'A joint command of the British Armed Forces, organized under the Royal Air Force.',
      'Staffed by personnel from the Royal Navy, British Army, and Royal Air Force.',
      'Focuses on three core pillars: protection, power projection, and innovation.'
    ]
  },
  {
    id: 'us',
    name: 'US Space Force',
    icon: <Star size={50} className="text-cyan-400" />,
    description: [
        "The United States Space Force (USSF) is the space force branch of the United States Department of Defense.",
        "It is one of the six armed forces of the United States and one of the eight uniformed services of the United States.",
        "It is also one of two independent space forces in the world.",
        "Operates specialized units, like Delta 5, which are responsible for constant space surveillance and tracking objects in orbit."
    ]
  },
  {
    id: 'nato',
    name: 'NATO Policy',
    icon: <Globe size={50} className="text-gray-400" />,
    description: [
        "The full form of NATO is North Atlantic Treaty Organization. It is a military alliance established in 1949 to provide collective security against potential threats, particularly during the Cold War.",
        "The alliance's space policy states that a hostile attack on a member's satellite could trigger Article 5, the collective defense clause."
    ]
  }
];

// --- The Main Component ---
const DoctrineHotspots = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);

  const handleSelect = (id) => {
    setSelectedId(id);
    if (!completedIds.includes(id)) {
      setCompletedIds([...completedIds, id]);
    }
  };

  const selectedDoctrine = DOCTRINE_DATA.find(d => d.id === selectedId);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Allied Doctrine Snapshot</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">Click on each emblem to review its doctrine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {DOCTRINE_DATA.map((doctrine) => (
          <button
            key={doctrine.id}
            onClick={() => handleSelect(doctrine.id)}
            className={`relative p-6 flex flex-col items-center justify-center gap-4 rounded-lg border-2 transition-all duration-300 ${
              selectedId === doctrine.id 
                ? 'bg-white/10 border-cyan-400 scale-105' 
                : 'bg-white/5 border-transparent hover:border-white/20'
            }`}
          >
            {doctrine.icon}
            {/* UPDATED: Increased text size for the name */}
            <span className="font-semibold text-white text-center text-lg">{doctrine.name}</span>
            {completedIds.includes(doctrine.id) && (
              <div className="absolute top-2 right-2 p-1 bg-green-500/20 rounded-full">
                <Check size={16} className="text-green-400" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Information Display Area */}
      <div className="w-full min-h-[120px] p-4 bg-black/30 rounded-lg flex items-center justify-center transition-opacity duration-500">
        {selectedDoctrine ? (
          <div className="text-left text-gray-300 animate-fade-in w-full">
            {Array.isArray(selectedDoctrine.description) ? (
              <ul className="space-y-2">
                {selectedDoctrine.description.map((point, index) => (
                  // UPDATED: Increased text size for list items
                  <li key={index} className="flex items-start text-lg">
                    <span className="text-cyan-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              // UPDATED: Increased text size for paragraphs
              <p className="text-center text-lg">{selectedDoctrine.description}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Select an emblem to learn more.</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(DoctrineHotspots);
