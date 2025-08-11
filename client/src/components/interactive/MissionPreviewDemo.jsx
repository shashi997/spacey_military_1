import React, { useState, useEffect } from 'react';
import { Radio, ShieldAlert, Zap, GitBranch, MessageSquare } from 'lucide-react';
import * as Tone from 'tone';

// --- Data for the blurred action buttons ---
const ACTION_BUTTONS = [
  { id: 'warn', name: 'Send Warning', icon: <MessageSquare /> },
  { id: 'maneuver', name: 'Co-Orbit Maneuver', icon: <GitBranch /> },
  { id: 'jam', name: 'Jam Communications', icon: <Zap /> },
  { id: 'escalate', name: 'Escalate to Leadership', icon: <ShieldAlert /> },
];

// --- Custom Hook for Typing Effect ---
const useTypingEffect = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    if (text) {
      let i = 0;
      // UPDATED: Added volume property to make the synth quieter
      const synth = new Tone.Synth({ volume: -14, oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.1 } }).toDestination();
      
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.substring(0, i + 1));
          // Play a short beep for each character
          if (text[i] !== ' ') {
            synth.triggerAttackRelease("C5", "32n", Tone.now());
          }
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);
      return () => clearInterval(typingInterval);
    }
  }, [text, speed]);

  return displayedText;
};


// --- The Main Component ---
const MissionPreviewDemo = () => {
  const [startAnimation, setStartAnimation] = useState(false);

  const sitrepText = "An unidentified satellite has performed a close-proximity maneuver near a high-value allied ISR asset. Intent is unknown.";
  const objectiveText = "Advise leadership on the appropriate course of action. Your choices will have consequences.";

  const displayedSitrep = useTypingEffect(startAnimation ? sitrepText : '', 30);
  const displayedObjective = useTypingEffect(startAnimation && displayedSitrep.length === sitrepText.length ? objectiveText : '', 30);

  // Effect to start animations and play sound
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStartAnimation(true);
      // Play an alert sound when the alert appears
      const alertSynth = new Tone.FMSynth({ volume: -10 }).toDestination(); // Also lowered volume here
      alertSynth.triggerAttackRelease("A5", "8n", Tone.now() + 0.5);
    }, 500);

    return () => clearTimeout(startTimer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Mission Preview: Coalition SatOps</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">You are now in command. Analyze the situation and prepare your recommendations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Column: Scenario Details */}
        <div className="md:col-span-2 p-4 bg-black/30 rounded-lg">
          <h3 className="font-bold text-lg text-cyan-300 mb-2">SITREP</h3>
          <p className="text-sm text-gray-300 mb-4 h-24 font-mono">
            {displayedSitrep}
          </p>
          <div className="border-t border-gray-700 pt-4">
            <h4 className="font-semibold text-white mb-2">Your Objective:</h4>
            <p className="text-sm text-gray-400 h-20 font-mono">{displayedObjective}</p>
          </div>
        </div>

        {/* Right Column: Command Deck Mockup */}
        <div className="md:col-span-3 w-full h-96 bg-black/30 rounded-lg border border-gray-700 p-4 flex flex-col">
          <div className="flex-grow relative bg-cover bg-center rounded overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center animate-slow-zoom" style={{ backgroundImage: "url('https://placehold.co/600x400/0a0a0a/FFFFFF?text=Orbital+Map')" }}></div>
            {startAnimation && (
              <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs font-mono text-red-400 animate-flash">
                <Radio size={12} className="inline-block mr-1" />
                HOSTILE PROXIMITY ALERT
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {ACTION_BUTTONS.map(action => (
              <button
                key={action.id}
                disabled
                className="p-3 flex flex-col items-center justify-center gap-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-500 cursor-not-allowed"
              >
                <div className="blur-sm flex flex-col items-center justify-center gap-2">
                  {action.icon}
                  <span className="font-semibold text-xs text-center">{action.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



export default React.memo(MissionPreviewDemo);
