import React, { useState } from 'react';
import { Target, Zap, Bot, ShieldOff, WifiOff, Check } from 'lucide-react';

// --- Data for the threat matrix ---
const THREAT_DATA = [
  {
    id: 'kinetic',
    name: 'Kinetic ASATs',
    icon: <Target size={48} className="text-red-400" />,
    description: 'Anti-satellite missiles designed to physically collide with and destroy targets, creating massive debris fields.'
  },
  {
    id: 'energy',
    name: 'Directed-Energy',
    icon: <Zap size={48} className="text-yellow-400" />,
    description: 'High-energy lasers or microwave weapons used to damage or disable a satellite\'s sensitive electronic components from a distance.'
  },
  {
    id: 'coorbital',
    name: 'Co-orbital Threats',
    icon: <Bot size={48} className="text-purple-400" />,
    description: 'Satellites capable of maneuvering close to other satellites to interfere, sabotage, or physically grapple them.'
  },
  {
    id: 'cyber',
    name: 'Cyber & GPS Spoofing',
    icon: <ShieldOff size={48} className="text-green-400" />,
    description: 'Non-kinetic attacks that involve hacking a satellite\'s control systems or feeding it false GPS data, causing it to malfunction.'
  }
];

// --- The Main Component ---
const ThreatMatrixDemo = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);

  const handleSelect = (id) => {
    setSelectedId(id);
    if (!completedIds.includes(id)) {
      setCompletedIds([...completedIds, id]);
    }
  };

  const selectedThreat = THREAT_DATA.find(t => t.id === selectedId);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Threat Catalogue</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">Click on each threat icon to review the intelligence report.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {THREAT_DATA.map((threat) => (
          <button
            key={threat.id}
            onClick={() => handleSelect(threat.id)}
            className={`relative p-6 flex flex-col items-center justify-center gap-4 rounded-lg border-2 transition-all duration-300 ${
              selectedId === threat.id 
                ? 'bg-white/10 border-red-400 scale-105' 
                : 'bg-white/5 border-transparent hover:border-white/20'
            }`}
          >
            {threat.icon}
            <span className="font-semibold text-white text-center text-sm">{threat.name}</span>
            {completedIds.includes(threat.id) && (
              <div className="absolute top-2 right-2 p-1 bg-green-500/20 rounded-full">
                <Check size={16} className="text-green-400" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Information Display Area */}
      <div className="w-full min-h-[100px] p-4 bg-black/30 rounded-lg flex flex-col items-center justify-center text-center transition-opacity duration-500">
        {selectedThreat ? (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-2">{selectedThreat.name}</h3>
            <p className="text-gray-300">{selectedThreat.description}</p>
          </div>
        ) : (
          <p className="text-gray-500">Select a threat to view details.</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(ThreatMatrixDemo);
