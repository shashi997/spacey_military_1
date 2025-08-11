import React, { useState } from 'react';
import { MessageSquare, DollarSign, ShieldOff, Target, ChevronDown, Check, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useConversationManager } from '../../hooks/useConversationManager';

// --- Data for the ROE Ladder steps with AI prompts ---
const LADDER_STEPS = [
  {
    id: 'diplomatic',
    name: 'Diplomatic Pressure',
    icon: <MessageSquare size={32} className="text-blue-400" />,
    description: 'Initial action: A formal warning is sent via diplomatic channels, demanding the hostile platform cease its approach.',
    ai_prompt: 'As Spacey, the AI mission specialist, describe the likely outcome of applying diplomatic pressure against a nation maneuvering a hostile platform near an allied satellite. The warning is ignored. Keep it concise.'
  },
  {
    id: 'economic',
    name: 'Economic Sanctions',
    icon: <DollarSign size={32} className="text-yellow-400" />,
    description: 'Next step: Targeted economic sanctions are announced against the offending nation\'s space program.',
    ai_prompt: 'As Spacey, describe the outcome of applying economic sanctions. The action has no immediate effect on the hostile platform, which holds its position.'
  },
  {
    id: 'cyber',
    name: 'Cyber Countermeasures',
    icon: <ShieldOff size={32} className="text-green-400" />,
    description: 'Escalation: A non-destructive cyber operation is authorized to temporarily disable the platform\'s communication systems.',
    ai_prompt: 'As Spacey, report on the outcome of the cyber-attack. The operation is successful in disabling communications, but the platform\'s automated systems remain active.'
  },
  {
    id: 'kinetic',
    name: 'Kinetic Strike',
    icon: <Target size={32} className="text-red-400" />,
    description: 'Final option: As a last resort, leadership authorizes a kinetic strike to neutralize the threat before it can harm the allied asset.',
    ai_prompt: 'As Spacey, confirm the outcome of the kinetic strike. The threat is eliminated, but emphasize the significant geopolitical consequences of this action.'
  }
];

// --- The Main Component ---
const RoeLadderDemo = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [aiOutcomes, setAiOutcomes] = useState({});

  const { currentUser } = useAuth();
  const { handleUserChat, isProcessing } = useConversationManager();

  const handleSelectStep = async (index) => {
    // Prevent selecting out of order or while AI is processing
    if (index > currentStepIndex + 1 || isProcessing) return;

    setCurrentStepIndex(index);
    const step = LADDER_STEPS[index];

    // Only call the AI if we don't already have a response for this step
    if (!aiOutcomes[step.id]) {
      const response = await handleUserChat(step.ai_prompt, currentUser);
      if (response?.message) {
        setAiOutcomes(prev => ({ ...prev, [step.id]: response.message }));
      }
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
              disabled={index > currentStepIndex + 1 || isProcessing}
              className={`w-full p-4 flex items-center gap-4 rounded-lg border-2 transition-all duration-300 text-left ${
                currentStepIndex >= index ? 'bg-white/10 border-cyan-400' : 'bg-white/5 border-transparent'
              } ${index === currentStepIndex + 1 && !isProcessing ? 'cursor-pointer hover:bg-white/10 animate-pulse' : 'cursor-not-allowed'}`}
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
                <p className="text-base mb-2">{step.description}</p>
                <div className="text-base font-semibold text-yellow-300">
                  {isProcessing && currentStepIndex === index ? (
                    <div className="flex items-center gap-2">
                      <Loader className="animate-spin" size={16}/>
                      <span>Analyzing outcome...</span>
                    </div>
                  ) : (
                    <p><strong>Outcome:</strong> {aiOutcomes[step.id]}</p>
                  )}
                </div>
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
