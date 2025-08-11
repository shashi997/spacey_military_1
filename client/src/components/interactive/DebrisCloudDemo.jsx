import React, { useState, useEffect, useMemo } from 'react';
import { Satellite, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useConversationManager } from '../../hooks/useConversationManager';

// --- Data for the demo ---
const PREDICTION_OPTIONS = [
  { id: 'minor', text: 'A minor debris event, easily contained.' },
  { id: 'catastrophic', text: 'A catastrophic debris field, posing a major navigational hazard.' },
  { id: 'bounce', text: 'The satellites will likely bounce off each other with minimal damage.' }
];

const CORRECT_ANSWER_ID = 'catastrophic';

// --- Debris Field Component ---
const DebrisField = () => {
  const debris = useMemo(() => {
    return Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {debris.map(d => (
        <div
          key={d.id}
          className="absolute rounded-full bg-gray-500 animate-fade-in"
          style={{
            width: `${d.size}px`,
            height: `${d.size}px`,
            left: d.left,
            top: d.top,
            animationDelay: d.animationDelay,
          }}
        />
      ))}
    </div>
  );
};


// --- The Main Component ---
const DebrisCloudDemo = () => {
  const [state, setState] = useState('predicting'); // 'predicting', 'simulating', 'feedback'
  const [debrisCount, setDebrisCount] = useState(0);
  const [userPrediction, setUserPrediction] = useState(null);
  const [aiFeedback, setAiFeedback] = useState('');

  const { currentUser } = useAuth();
  const { handleUserChat, isProcessing } = useConversationManager();

  // An effect to animate the debris count
  useEffect(() => {
    if (state === 'simulating') {
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

  const handlePrediction = async (prediction) => {
    setUserPrediction(prediction);
    setState('simulating');

    const isCorrect = prediction.id === CORRECT_ANSWER_ID;
    
    const prompt = isCorrect
      ? `As Spacey, the AI mission specialist, the Commander correctly predicted that the Iridium-Cosmos collision would be a catastrophic event. Praise their accurate assessment and briefly explain why the creation of over 1,500 debris fragments is such a significant and long-lasting threat in Low Earth Orbit.`
      : `As Spacey, the AI mission specialist, the Commander incorrectly predicted the outcome of the Iridium-Cosmos collision, choosing "${prediction.text}". Gently correct them, explaining that the result was actually a catastrophic debris field of over 1,500 fragments. Emphasize why this event is a critical case study in orbital negligence.`;

    const response = await handleUserChat(prompt, currentUser);
    if (response?.message) {
      setAiFeedback(response.message);
      setState('feedback');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Case Study: Iridium-Cosmos 2009</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">
          Analyze the scenario and predict the outcome.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Column: Visualization */}
        <div className="relative w-full h-80 bg-black/30 rounded-lg overflow-hidden border border-gray-700">
          <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {state === 'predicting' ? (
            <div className="animate-fade-in w-full h-full">
              {/* Satellite 1: Iridium 33 */}
              <div className="absolute text-center animate-move-satellite-1">
                <Satellite size={48} className="text-blue-400" />
                <p className="text-xs font-mono text-blue-300 mt-2">Iridium 33</p>
              </div>
              {/* Satellite 2: Cosmos-2251 */}
              <div className="absolute text-center animate-move-satellite-2">
                <Satellite size={48} className="text-gray-500" />
                <p className="text-xs font-mono text-gray-400 mt-2">Cosmos-2251</p>
              </div>
            </div>
          ) : (
            // FIX: Added w-full and h-full to this container
            <div className="animate-fade-in w-full h-full">
              <DebrisField />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center">
                  <p className="text-4xl font-bold text-red-400">{debrisCount.toLocaleString()}+</p>
                  <p className="font-mono text-red-300">Trackable Debris Fragments</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Prediction & Feedback */}
        <div className="w-full min-h-[20rem] p-4 bg-black/30 rounded-lg flex flex-col justify-center">
          {state === 'predicting' && (
            <div className="animate-fade-in">
              <h3 className="font-bold text-lg text-cyan-300 mb-4">What is the most likely outcome of this collision?</h3>
              <div className="space-y-3">
                {PREDICTION_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handlePrediction(option)}
                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-cyan-500/50 transition-colors"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {(state === 'simulating' || (state === 'feedback' && isProcessing)) && (
             <div className="flex items-center justify-center gap-2 text-gray-400">
                <Loader className="animate-spin"/>
                <span>Analyzing Outcome...</span>
            </div>
          )}

          {state === 'feedback' && !isProcessing && (
            <div className="animate-fade-in">
              <h3 className={`font-bold text-lg mb-2 ${userPrediction.id === CORRECT_ANSWER_ID ? 'text-green-400' : 'text-red-400'}`}>
                {userPrediction.id === CORRECT_ANSWER_ID ? 'Assessment Correct' : 'Assessment Incorrect'}
              </h3>
              <p className="text-gray-300">{aiFeedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default React.memo(DebrisCloudDemo);
