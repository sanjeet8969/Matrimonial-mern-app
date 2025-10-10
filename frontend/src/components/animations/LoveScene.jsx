import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

function SimpleHeart({ position, color = "#ff1744", scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      
      // Gentle breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef} position={position}>
        {/* Using sphere geometry styled as heart */}
        <sphereGeometry args={[scale, 16, 16]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.2}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function RingOfHearts() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const hearts = [];
  const heartCount = 12;
  const radius = 4;

  for (let i = 0; i < heartCount; i++) {
    const angle = (i / heartCount) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(angle * 3) * 0.5;

    hearts.push(
      <SimpleHeart
        key={i}
        position={[x, y, z]}
        color={i % 2 === 0 ? "#ff1744" : "#ff6b9d"}
        scale={0.3 + Math.sin(angle) * 0.1}
      />
    );
  }

  return <group ref={groupRef}>{hearts}</group>;
}

const LoveScene = () => {
  return (
    <div className="h-96 w-full bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 rounded-2xl overflow-hidden relative">
      {/* Overlay text */}
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-2xl font-bold text-love">💕 Find Your Soulmate</h3>
        <p className="text-gray-600 text-sm mt-1">Experience love in 3D</p>
      </div>

      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-3, -3, 3]} intensity={0.3} color="#ff6b9d" />

        {/* Central heart */}
        <SimpleHeart position={[0, 0, 0]} scale={1.2} />
        
        {/* Ring of hearts */}
        <RingOfHearts />

        {/* Controls */}
        <OrbitControls 
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};

export default LoveScene;
