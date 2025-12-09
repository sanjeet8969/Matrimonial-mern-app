import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LoveScene = () => {
  const containerRef = useRef(null);
  const heartsRef = useRef([]);

  useEffect(() => {
    const hearts = heartsRef.current;
    const container = containerRef.current;

    // Central heart animation
    gsap.to('.central-heart', {
      scale: 1.2,
      rotation: 5,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });

    // Orbiting hearts
    hearts.forEach((heart, i) => {
      const angle = (i / hearts.length) * Math.PI * 2;
      const radius = 150;

      gsap.to(heart, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
        modifiers: {
          x: (x) => {
            const time = gsap.getProperty(heart, "rotation") || 0;
            return Math.cos(((time + i * 30) * Math.PI) / 180) * radius + 'px';
          },
          y: (y) => {
            const time = gsap.getProperty(heart, "rotation") || 0;
            return Math.sin(((time + i * 30) * Math.PI) / 180) * radius + 'px';
          },
        },
      });

      // Individual breathing effect
      gsap.to(heart, {
        scale: 1.3,
        duration: 2,
        delay: i * 0.2,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
    });

    // Sparkle particles
    gsap.utils.toArray('.sparkle').forEach((sparkle) => {
      gsap.to(sparkle, {
        y: -30,
        opacity: 0.6,
        duration: gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: gsap.utils.random(0, 2),
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-96 w-full bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 rounded-2xl overflow-hidden relative"
    >
      {/* Overlay text */}
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-2xl font-bold text-red-600">💕 Find Your Soulmate</h3>
        <p className="text-gray-600 text-sm mt-1">Experience love in 3D</p>
      </div>

      {/* Central heart */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="central-heart text-9xl cursor-pointer">❤️</div>
      </div>

      {/* Orbiting hearts */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (heartsRef.current[i] = el)}
            className="absolute text-4xl"
          >
            {i % 2 === 0 ? '💖' : '💕'}
          </div>
        ))}
      </div>

      {/* Sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="sparkle absolute text-sm opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

export default LoveScene;
