import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as THREE from 'three';
import { Globe, Tv, Satellite as SatelliteIcon, CheckCircle } from 'lucide-react';
import earthTexture from '/images/earth_daymap.jpg';

// --- Helper Constants and Data ---
const ItemTypes = { SATELLITE: 'satellite' };

const SATELLITE_DATA = [
  { name: 'Surveillance Satellite', type: 'LEO' },
  { name: 'GPS Satellite', type: 'MEO' },
  { name: 'Communications Satellite', type: 'GEO' },
];

const icons = {
  MEO: <Globe size={24} className="text-yellow-300" />,
  GEO: <Tv size={24} className="text-purple-300" />,
  LEO: <SatelliteIcon size={24} className="text-cyan-300" />,
};

// --- 2D Draggable Satellite Component (HTML) ---
const DraggableSatellite = ({ name, type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SATELLITE,
    item: { type },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div ref={drag} className={`flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-cyan-500/50 transition-all duration-200 cursor-grab ${isDragging ? 'opacity-30' : 'opacity-100'}`}>
      {icons[type]}
      <span className="text-white font-semibold">{name}</span>
    </div>
  );
};

// --- 2D Drop Zone that LOOKS like a ring ---
const RingDropZone = ({ ringType, onDrop, isCorrect, size, label, color }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.SATELLITE,
    drop: (item) => onDrop(ringType, item.type),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const getBorderColor = () => {
    if (isCorrect) return 'border-green-500';
    if (isOver && canDrop) return 'border-cyan-400';
    return color;
  };

  return (
    <div
      ref={drop}
      style={{ width: `${size}%`, height: `${size}%` }}
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed transition-all duration-300 flex items-center justify-center ${getBorderColor()} ${isOver && canDrop ? 'bg-white/10' : ''}`}
    >
      <span className={`absolute -top-6 font-mono text-sm ${isCorrect ? 'text-green-400' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
};

// --- 3D Scene (Background Only) ---
const GlobeBackground = () => (
  <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="absolute inset-0 z-0">
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <Earth />
      <OrbitControls enableZoom={true} enablePan={false} minDistance={4} maxDistance={15} />
    </Suspense>
  </Canvas>
);

const Earth = () => {
  const texture = useLoader(THREE.TextureLoader, earthTexture);
  const earthRef = useRef();
  useFrame(() => { earthRef.current.rotation.y += 0.001; });
  return (
    // FIX: Reduced the scale of the Earth mesh to make orbits visible
    <mesh ref={earthRef} scale={1.1}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

// --- Main Component ---
const InteractiveGlobeDemo = () => {
  const [placedSatellites, setPlacedSatellites] = useState({});

  const handleDrop = (ringType, itemType) => {
    if (ringType === itemType) {
      setPlacedSatellites(prev => ({ ...prev, [ringType]: true }));
    }
  };

  const unplacedSatellites = SATELLITE_DATA.filter(sat => !placedSatellites[sat.type]);
  const isComplete = unplacedSatellites.length === 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Orbital Assignment</h2>
          <p className="font-mono text-sm text-gray-400 mt-2">Drag each satellite from the list onto its correct orbit.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-1 space-y-3">
            {isComplete ? (
              <div className="flex flex-col items-center justify-center text-center h-full p-4">
                <CheckCircle className="text-green-400 mb-4" size={64} />
                <h3 className="text-xl font-bold text-green-300">All Satellites Deployed!</h3>
              </div>
            ) : (
              unplacedSatellites.map(({ name, type }) => (
                <DraggableSatellite key={type} name={name} type={type} />
              ))
            )}
          </div>
          
          <div className="relative lg:col-span-2 w-full h-[400px] lg:h-[500px]">
            <GlobeBackground />
            {/* FIX: The container for the drop zones is now a grid, which prevents them from overlapping and blocking each other. */}
            <div className="absolute inset-0 z-10 grid place-items-center">
              <RingDropZone ringType="GEO" onDrop={handleDrop} isCorrect={placedSatellites['GEO']} size={95} label="GEO" color="border-purple-500/50" />
              <RingDropZone ringType="MEO" onDrop={handleDrop} isCorrect={placedSatellites['MEO']} size={75} label="MEO" color="border-yellow-500/50" />
              <RingDropZone ringType="LEO" onDrop={handleDrop} isCorrect={placedSatellites['LEO']} size={55} label="LEO" color="border-cyan-500/50" />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default React.memo(InteractiveGlobeDemo);
