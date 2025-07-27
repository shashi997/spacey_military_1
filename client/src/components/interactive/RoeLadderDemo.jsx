import React, { useState } from 'react';
import { MessageSquare, DollarSign, ShieldOff, Target, ChevronDown, Check } from 'lucide-react';

// --- Data for the ROE Ladder steps ---
const LADDER_STEPS = [
  {
    id: 'diplomatic',
    name: 'Diplomatic Pressure',
    icon: <MessageSquare size={32} className="text-blue-400" />,
    description: 'Initial action: A formal warning is sent via diplomatic channels, demanding the hostile platform cease its approach.',
    outcome: 'Outcome: The warning is ignored. The platform continues its maneuver.'
  },
  {
    id: 'economic',
    name: 'Economic Sanctions',
    icon: <DollarSign size={32} className="text-yellow-400" />,
    description: 'Next step: Targeted economic sanctions are announced against the offending nation\'s space program.',
    outcome: 'Outcome: No immediate effect. The platform holds its position, increasing the threat.'
  },
  {
    id: 'cyber',
    name: 'Cyber Countermeasures',
    icon: <ShieldOff size={32} className="text-green-400" />,
    description: 'Escalation: A non-destructive cyber operation is authorized to temporarily disable the platform\'s communication systems.',
    outcome: 'Outcome: The cyber-attack is successful, but the platform\'s automated systems remain active.'
  },
  {
    id: 'kinetic',
    name: 'Kinetic Strike',
    icon: <Target size={32} className="text-red-400" />,
    description: 'Final option: As a last resort, leadership authorizes a kinetic strike to neutralize the threat before it can harm the allied asset.',
    outcome: 'Outcome: The threat is eliminated, but this action carries significant geopolitical consequences.'
  }
];

// --- The Main Component ---
const RoeLadderDemo = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1); // -1 means nothing is selected yet

  const handleSelectStep = (index) => {
    // Allow user to only select the next step in the sequence
    if (index === currentStepIndex + 1) {
      setCurrentStepIndex(index);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">ROE Decision Ladder</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">A hostile platform is approaching an allied satellite. Click each step to escalate your response.</p>
      </div>

      {/* Flowchart Visualization */}
      <div className="space-y-2">
        {LADDER_STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => handleSelectStep(index)}
              disabled={index > currentStepIndex + 1}
              className={`w-full p-4 flex items-center gap-4 rounded-lg border-2 transition-all duration-300 text-left ${
                currentStepIndex >= index ? 'bg-white/10 border-cyan-400' : 'bg-white/5 border-transparent'
              } ${index === currentStepIndex + 1 ? 'cursor-pointer hover:bg-white/10 animate-pulse' : 'cursor-not-allowed'}`}
            >
              <div className={`p-3 rounded-full ${currentStepIndex >= index ? 'bg-cyan-500/20' : 'bg-gray-700'}`}>
                {step.icon}
              </div>
              <span className="font-semibold text-white text-lg">{step.name}</span>
              {currentStepIndex >= index && <Check size={24} className="text-green-400 ml-auto" />}
            </button>

            {/* Outcome Display */}
            {currentStepIndex >= index && (
              <div className="pl-8 pr-4 py-4 text-gray-300 animate-fade-in">
                <p className="text-sm mb-2">{step.description}</p>
                <p className="text-sm font-semibold text-yellow-300">{step.outcome}</p>
              </div>
            )}

            {/* Arrow Connector */}
            {index < LADDER_STEPS.length - 1 && (
              <div className="flex justify-center">
                <ChevronDown size={24} className={`transition-opacity ${currentStepIndex >= index ? 'opacity-100 text-cyan-400' : 'opacity-50 text-gray-600'}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default React.memo(RoeLadderDemo);
