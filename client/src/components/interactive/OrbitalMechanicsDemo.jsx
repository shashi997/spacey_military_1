import React, { useState, useRef, Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useConversationManager } from '../../hooks/useConversationManager';

// --- 3D Scene Components ---

const Earth = () => (
  <mesh>
    <sphereGeometry args={[2, 32, 32]} />
    <meshStandardMaterial color="#639bff" wireframe />
  </mesh>
);

const OrbitPath = ({ inclination, raan, color }) => {
  const orbitRef = useRef();

  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.rotation.set(0, 0, 0);
      orbitRef.current.rotateY(THREE.MathUtils.degToRad(raan));
      orbitRef.current.rotateX(THREE.MathUtils.degToRad(inclination));
    }
  }, [inclination, raan]);

  return (
    <group ref={orbitRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

// --- The Main Component ---
const OrbitalMechanicsDemo = () => {
  const [inclination, setInclination] = useState(0);
  const [raan, setRaan] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');

  const { currentUser } = useAuth();
  const { handleUserChat, isProcessing } = useConversationManager();

  // Memoize the target orbit so it doesn't change on re-render
  const targetOrbit = useMemo(() => ({
    inclination: Math.floor(Math.random() * 60) + 15, // Target between 15 and 75
    raan: Math.floor(Math.random() * 360),
  }), []);

  const calculateScore = () => {
    const inclinationError = Math.abs(targetOrbit.inclination - inclination);
    const raanError = Math.abs(targetOrbit.raan - raan);
    // Normalize error to a score out of 100 (lower error is better)
    const score = Math.max(0, 100 - (inclinationError + raanError / 3.6));
    return Math.round(score);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const score = calculateScore();
    
    const prompt = `
      As Spacey, the AI mission specialist, analyze the Commander's performance in an orbital mechanics challenge.
      - Their target inclination was ${targetOrbit.inclination} degrees, and they set it to ${inclination} degrees.
      - Their target RAAN was ${targetOrbit.raan} degrees, and they set it to ${raan} degrees.
      - Their final accuracy score is ${score} out of 100.

      Provide a brief, encouraging feedback message. If the score is high, praise their precision. If it's low, explain the importance of accuracy in orbital mechanics.
    `;

    const response = await handleUserChat(prompt, currentUser);
    if (response?.message) {
      setAiFeedback(response.message);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Orbital Mechanics Challenge</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">Match the target orbit by adjusting the sliders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-4 bg-black/30 rounded-lg">
            <h3 className="font-semibold text-white text-center mb-2">Target Orbit</h3>
            <div className="flex justify-around font-mono text-lg">
              <span>Inc: <span className="text-cyan-400">{targetOrbit.inclination}°</span></span>
              <span>RAAN: <span className="text-cyan-400">{targetOrbit.raan}°</span></span>
            </div>
          </div>
          <div>
            <label htmlFor="inclination" className="block font-semibold text-white mb-2">Your Inclination: {inclination}°</label>
            <input type="range" id="inclination" min="0" max="90" value={inclination} disabled={submitted} onChange={(e) => setInclination(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label htmlFor="raan" className="block font-semibold text-white mb-2">Your RAAN: {raan}°</label>
            <input type="range" id="raan" min="0" max="360" value={raan} disabled={submitted} onChange={(e) => setRaan(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          {!submitted && (
            <button onClick={handleSubmit} className="w-full px-4 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors">
              Lock In Solution
            </button>
          )}
        </div>

        {/* Right Column: 3D Canvas & Feedback */}
        <div className="relative lg:col-span-2 w-full h-[300px] lg:h-[400px] rounded-xl overflow-hidden bg-black">
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
              <Earth />
              {/* Target Orbit (semi-transparent) */}
              <OrbitPath inclination={targetOrbit.inclination} raan={targetOrbit.raan} color="#00ffff" />
              {/* User's Orbit */}
              <OrbitPath inclination={inclination} raan={raan} color="#ffff00" />
            </Suspense>
          </Canvas>

          {/* AI Feedback Overlay */}
          {submitted && (
            <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 animate-fade-in">
              {isProcessing ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader className="animate-spin" />
                  <span>Analyzing Performance...</span>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-green-300 mb-2">Analysis Complete</h3>
                  <p className="text-gray-300">{aiFeedback}</p>
                  <p className="mt-4 text-4xl font-bold text-white">{calculateScore()}<span className="text-lg text-gray-400">/100</span></p>
                  <p className="font-mono text-sm text-gray-500">Accuracy Score</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrbitalMechanicsDemo);
