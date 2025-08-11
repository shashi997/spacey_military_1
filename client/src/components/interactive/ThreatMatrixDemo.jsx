import React, { useState, useEffect } from 'react';
import { Target, Zap, Bot, ShieldOff, Check, X, RefreshCw, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useConversationManager } from '../../hooks/useConversationManager';

// --- Data for the threat matrix with scenarios ---
const THREAT_DATA = [
  {
    id: 'kinetic',
    name: 'Kinetic ASATs',
    icon: <Target size={48} className="text-red-400" />,
    description: 'Anti-satellite missiles designed to physically collide with and destroy targets, creating massive debris fields.',
    scenario: 'Intel reports a ground-based missile launch with a trajectory matching one of our key imaging satellites.'
  },
  {
    id: 'energy',
    name: 'Directed-Energy',
    icon: <Zap size={48} className="text-yellow-400" />,
    description: 'High-energy lasers or microwave weapons used to damage or disable a satellite\'s sensitive electronic components from a distance.',
    scenario: 'Our satellite\'s solar panels are showing rapid, unexplained degradation, and thermal sensors are spiking without any direct contact.'
  },
  {
    id: 'coorbital',
    name: 'Co-orbital Threats',
    icon: <Bot size={48} className="text-purple-400" />,
    description: 'Satellites capable of maneuvering close to other satellites to interfere, sabotage, or physically grapple them.',
    scenario: 'An unknown object has matched our satellite\'s orbit and is performing close-proximity maneuvers, potentially for inspection or interference.'
  },
  {
    id: 'cyber',
    name: 'Cyber & GPS Spoofing',
    icon: <ShieldOff size={48} className="text-green-400" />,
    description: 'Non-kinetic attacks that involve hacking a satellite\'s control systems or feeding it false GPS data, causing it to malfunction.',
    scenario: 'We are receiving telemetry from our satellite that contradicts its known position, and ground control is detecting unauthorized command attempts.'
  }
];

// --- The Main Component ---
const ThreatMatrixDemo = () => {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [userChoice, setUserChoice] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [aiFeedback, setAiFeedback] = useState('');

  const { currentUser } = useAuth();
  const { handleUserChat, isProcessing } = useConversationManager();

  const getNewScenario = () => {
    setUserChoice(null);
    setAiFeedback('');
    const unsolved = THREAT_DATA.filter(t => !completedIds.includes(t.id));
    if (unsolved.length > 0) {
      setCurrentScenario(unsolved[Math.floor(Math.random() * unsolved.length)]);
    } else {
      setCurrentScenario(null);
    }
  };

  useEffect(() => {
    getNewScenario();
  }, []);

  const handleSelectThreat = async (selectedId) => {
    if (userChoice) return;

    const isCorrect = selectedId === currentScenario.id;
    setUserChoice({ id: selectedId, isCorrect });

    if (isCorrect) {
      setCompletedIds(prev => [...prev, selectedId]);
    }

    // --- Generate AI Feedback ---
    const selectedThreatName = THREAT_DATA.find(t => t.id === selectedId)?.name;
    const correctThreat = THREAT_DATA.find(t => t.id === currentScenario.id);

    const prompt = isCorrect
      ? `As Spacey, the AI mission specialist, confirm to the Commander that their assessment was correct. The scenario was: "${currentScenario.scenario}". They correctly identified it as a "${correctThreat.name}" threat. Briefly explain why this is the right classification.`
      : `As Spacey, the AI mission specialist, gently correct the Commander. The scenario was: "${currentScenario.scenario}". They incorrectly identified it as a "${selectedThreatName}" threat when it was actually a "${correctThreat.name}" threat. Briefly explain the difference and why their choice was incorrect.`;

    const response = await handleUserChat(prompt, currentUser);
    if (response?.message) {
      setAiFeedback(response.message);
    }
  };

  const allComplete = completedIds.length === THREAT_DATA.length;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Threat Catalogue</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">Analyze the SITREP and identify the correct threat type.</p>
      </div>

      {/* Information / SITREP & Feedback Display Area */}
      <div className="w-full min-h-[150px] p-4 mb-8 bg-black/30 rounded-lg flex flex-col items-center justify-center text-center transition-opacity duration-500">
        {allComplete ? (
          <div className="flex flex-col items-center text-green-400">
            <Check size={48}/>
            <p className="mt-2 font-semibold text-lg">All threats analyzed. Well done, Commander.</p>
          </div>
        ) : !userChoice ? (
          <>
            <h3 className="text-lg font-semibold text-red-400 mb-2">SITREP</h3>
            <p className="text-gray-300 text-lg">{currentScenario?.scenario}</p>
          </>
        ) : isProcessing ? (
            <div className="flex items-center gap-2 text-gray-400">
                <Loader className="animate-spin"/>
                <span>Analyzing...</span>
            </div>
        ) : (
            <p className="text-gray-300 text-lg animate-fade-in">{aiFeedback}</p>
        )}
      </div>

      {/* Icon Grid / Answer Area */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {THREAT_DATA.map((threat) => (
          <button
            key={threat.id}
            onClick={() => handleSelectThreat(threat.id)}
            disabled={!!userChoice}
            className={`relative p-6 flex flex-col items-center justify-center gap-4 rounded-lg border-2 transition-all duration-300 ${
              userChoice && userChoice.id === threat.id
                ? (userChoice.isCorrect ? 'bg-green-500/20 border-green-500 scale-105' : 'bg-red-500/20 border-red-500 scale-105')
                : (userChoice ? 'opacity-50 cursor-not-allowed' : 'bg-white/5 border-transparent hover:border-white/20')
            }`}
          >
            {threat.icon}
            <span className="font-semibold text-white text-center text-base">{threat.name}</span>
            {userChoice && userChoice.id === threat.id && (
              <div className="absolute top-2 right-2 p-1 bg-black/50 rounded-full">
                {userChoice.isCorrect ? <Check size={16} className="text-green-400" /> : <X size={16} className="text-red-400" />}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Next Button */}
      {userChoice && !isProcessing && !allComplete && (
        <div className="text-center mt-6">
          <button onClick={getNewScenario} className="flex items-center gap-2 mx-auto px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors">
            Next Scenario <RefreshCw size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ThreatMatrixDemo);
