import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { AlertTriangle, CheckCircle } from 'lucide-react';

// --- 3D Scene Components ---

// A simple sphere to represent the Earth
const Earth = () => (
  <mesh>
    <sphereGeometry args={[2, 32, 32]} />
    <meshStandardMaterial color="#639bff" wireframe />
  </mesh>
);

// The satellite's orbital path
const OrbitPath = ({ inclination, raan }) => {
  const orbitRef = useRef();

  // Apply rotations based on the slider values
  useEffect(() => {
    if (orbitRef.current) {
      // Reset rotation first
      orbitRef.current.rotation.set(0, 0, 0);
      // Apply RAAN (rotation around Y-axis)
      orbitRef.current.rotateY(THREE.MathUtils.degToRad(raan));
      // Apply Inclination (rotation around X-axis relative to the new Y)
      orbitRef.current.rotateX(THREE.MathUtils.degToRad(inclination));
    }
  }, [inclination, raan]);

  return (
    <group ref={orbitRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
    </group>
  );
};

// --- The Main Component ---
const OrbitalMechanicsDemo = () => {
  const [inclination, setInclination] = useState(25); // Initial inclination in degrees
  const [raan, setRaan] = useState(45); // Initial RAAN in degrees
  const [showAlert, setShowAlert] = useState(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);

  // Trigger the collision alert after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(true);
    }, 5000); // Alert appears after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleAcknowledge = () => {
    setAlertAcknowledged(true);
    setShowAlert(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Orbital Mechanics</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">Adjust the sliders to see how they affect the satellite's orbit.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-1 space-y-6">
          {/* Inclination Slider */}
          <div>
            <label htmlFor="inclination" className="block font-semibold text-white mb-2">Inclination: {inclination}°</label>
            <input
              type="range" id="inclination" min="0" max="90"
              value={inclination}
              onChange={(e) => setInclination(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-1">Controls the vertical tilt of the orbit.</p>
          </div>

          {/* RAAN Slider */}
          <div>
            <label htmlFor="raan" className="block font-semibold text-white mb-2">RAAN: {raan}°</label>
            <input
              type="range" id="raan" min="0" max="360"
              value={raan}
              onChange={(e) => setRaan(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-1">Controls the horizontal rotation of the orbit.</p>
          </div>
        </div>

        {/* Right Column: 3D Canvas */}
        <div className="relative lg:col-span-2 w-full h-[300px] lg:h-[400px] rounded-xl overflow-hidden bg-black">
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
              <Earth />
              <OrbitPath inclination={inclination} raan={raan} />
            </Suspense>
          </Canvas>

          {/* Collision Alert Overlay */}
          {showAlert && (
            <div className="absolute inset-0 z-10 bg-red-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 animate-fade-in">
              <AlertTriangle size={48} className="text-yellow-300 animate-pulse mb-4" />
              <h3 className="text-2xl font-bold text-yellow-200">P-c WARNING</h3>
              <p className="text-yellow-100 mt-2">High Collision Probability Detected!</p>
              <button
                onClick={handleAcknowledge}
                className="mt-6 px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300"
              >
                Perform Evasive Maneuver
              </button>
            </div>
          )}

          {alertAcknowledged && (
             <div className="absolute inset-0 z-10 bg-green-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 animate-fade-in">
              <CheckCircle size={48} className="text-green-300 mb-4" />
              <h3 className="text-2xl font-bold text-green-200">Maneuver Successful</h3>
              <p className="text-green-100 mt-2">Collision avoided. Orbit is clear.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrbitalMechanicsDemo);
