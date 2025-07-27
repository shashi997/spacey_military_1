import React, { useState } from 'react';
import { Scale, ShieldCheck, Handshake, Check, FileText, Moon } from 'lucide-react';

// --- Data for the timeline events ---
const TREATY_DATA = [
  {
    id: 'ost',
    year: '1967',
    name: 'The Outer Space Treaty',
    icon: <Scale size={32} className="text-yellow-400" />,
    description: 'Prohibits placing weapons of mass destruction in orbit and limits the use of celestial bodies to peaceful purposes.'
  },
  {
    id: 'liability',
    year: '1972',
    name: 'The Liability Convention',
    icon: <ShieldCheck size={32} className="text-green-400" />,
    description: 'Establishes that launching states are absolutely liable to pay compensation for damage caused by their space objects.'
  },
  {
    id: 'registration',
    year: '1975',
    name: 'The Registration Convention',
    icon: <FileText size={32} className="text-orange-400" />,
    description: 'Requires launching states to maintain a registry of their space objects and report them to the United Nations.'
  },
  {
    id: 'moon',
    year: '1979',
    name: 'The Moon Agreement',
    icon: <Moon size={32} className="text-gray-400" />,
    description: 'Governs the activities of states on the Moon and other celestial bodies, stating they should be used exclusively for peaceful purposes.'
  },
  {
    id: 'artemis',
    year: '2020',
    name: 'The Artemis Accords',
    icon: <Handshake size={32} className="text-cyan-400" />,
    description: 'A set of non-binding principles to guide civil space exploration, emphasizing transparency, interoperability, and peaceful intent.'
  }
];

// --- The Main Component ---
const LegalTimelineDemo = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);

  const handleSelect = (id) => {
    setSelectedId(id);
    if (!completedIds.includes(id)) {
      setCompletedIds([...completedIds, id]);
    }
  };

  const selectedTreaty = TREATY_DATA.find(t => t.id === selectedId);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Legal & Ethical Framework</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">Click on each event on the timeline to learn more.</p>
      </div>

      {/* Timeline Visualization */}
      <div className="relative w-full h-20 mb-8">
        {/* The main timeline bar */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 rounded-full"></div>
        
        {/* Timeline Events */}
        <div className="relative flex justify-between w-full h-full">
          {TREATY_DATA.map((treaty) => (
            <div key={treaty.id} className="flex flex-col items-center">
              <button
                onClick={() => handleSelect(treaty.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  selectedId === treaty.id 
                    ? 'bg-cyan-500/20 border-cyan-400 scale-110' 
                    : 'bg-gray-800 border-gray-600 hover:border-cyan-500'
                }`}
              >
                {treaty.icon}
              </button>
              <span className="mt-2 font-mono text-sm text-gray-400">{treaty.year}</span>
              {completedIds.includes(treaty.id) && (
                <Check size={16} className="text-green-400 mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Information Display Area */}
      <div className="w-full min-h-[100px] p-4 bg-black/30 rounded-lg flex flex-col items-center justify-center text-center transition-opacity duration-500">
        {selectedTreaty ? (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-2">{selectedTreaty.name}</h3>
            <p className="text-gray-300">{selectedTreaty.description}</p>
          </div>
        ) : (
          <p className="text-gray-500">Select a treaty from the timeline.</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(LegalTimelineDemo);
