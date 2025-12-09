import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const HeartParticles = () => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.1);
    mouseY.set((e.clientY - centerY) * 0.1);
  };

  return (
    <div
      className="relative h-64 w-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <motion.div
        style={{ x, y }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          rotate: isHovered ? 360 : 0,
        }}
        transition={{ duration: 0.5 }}
        className="text-8xl cursor-pointer"
      >
        ❤️
      </motion.div>

      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{ opacity: 0.5 }}
          animate={{
            x: Math.cos((i * 2 * Math.PI) / 12) * (isHovered ? 150 : 100),
            y: Math.sin((i * 2 * Math.PI) / 12) * (isHovered ? 150 : 100),
            rotate: 360,
            opacity: isHovered ? 1 : 0.3,
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          💖
        </motion.div>
      ))}
    </div>
  );
};

export default HeartParticles;
