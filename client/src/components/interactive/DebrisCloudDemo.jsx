import React, { useState, useEffect } from 'react';
import { Satellite, AlertTriangle, CheckCircle } from 'lucide-react';

// --- Data for the demo ---
const KEY_FACTS = [
  { id: 1, text: 'Collision occurred at an altitude of 789 kilometers.' },
  { id: 2, text: 'Combined satellite mass was over 1,400 kg.' },
  { id: 3, text: 'Generated a debris cloud of over 1,500 trackable fragments.' },
  { id: 4, text: 'Significantly increased the risk to other satellites in LEO.' }
];

// --- The Main Component ---
const DebrisCloudDemo = () => {
  const [state, setState] = useState('before'); // 'before', 'after'
  const [debrisCount, setDebrisCount] = useState(0);

  // An effect to animate the debris count when the state changes to 'after'
  useEffect(() => {
    if (state === 'after') {
      const interval = setInterval(() => {
        setDebrisCount(prevCount => {
          const nextCount = prevCount + 30;
          if (nextCount >= 1500) {
            clearInterval(interval);
            return 1500;
          }
          return nextCount;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [state]);

  const handleCollision = () => {
    setState('after');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Case Study: Iridium-Cosmos 2009</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">
          {state === 'before' ? 'Click the button to simulate the collision event.' : 'Analysis of the collision aftermath.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Column: Visualization */}
        <div className="relative w-full h-80 bg-black/30 rounded-lg overflow-hidden border border-gray-700">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {state === 'before' ? (
            <>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <Satellite size={48} className="text-blue-400 animate-pulse" />
                <p className="text-xs font-mono text-blue-300 mt-2">Iridium 33 (Active)</p>
              </div>
              <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 text-center">
                <Satellite size={48} className="text-gray-500" />
                <p className="text-xs font-mono text-gray-400 mt-2">Cosmos-2251 (Defunct)</p>
              </div>
              <button
                onClick={handleCollision}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <AlertTriangle size={16} />
                Simulate Collision
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Debris Cloud */}
              <div className="w-4/5 h-4/5 rounded-full bg-red-500/10 animate-ping-slow"></div>
              <div className="absolute text-center">
                <p className="text-4xl font-bold text-red-400">{debrisCount.toLocaleString()}+</p>
                <p className="font-mono text-red-300">Trackable Debris Fragments</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Key Facts */}
        <div className="w-full min-h-[20rem] p-4 bg-black/30 rounded-lg">
          <h3 className="font-bold text-lg text-cyan-300 mb-4">Key Facts:</h3>
          <ul className="space-y-3">
            {KEY_FACTS.map(fact => (
              <li key={fact.id} className="flex items-start gap-3 text-gray-300">
                <CheckCircle size={18} className="text-green-400 mt-1 flex-shrink-0" />
                <span>{fact.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};



export default React.memo(DebrisCloudDemo);
