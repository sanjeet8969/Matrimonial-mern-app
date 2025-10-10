import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroAnimation = ({ children }) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      // Subtitle animation
      gsap.from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      });

      // CTA animation
      gsap.from(ctaRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'back.out(1.7)'
      });

      // Heart beat animation
      gsap.to('.heart-beat', {
        scale: 1.2,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      // Floating animation
      gsap.to('.float', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-red-50 to-purple-50 -z-10" />
      
      {/* Floating hearts background */}
      <div className="absolute inset-0 -z-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="float absolute text-love-light opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            ♥
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 text-center z-10">
        <div ref={titleRef}>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Find Your
            <span className="text-love heart-beat inline-block mx-4">♥</span>
            Perfect Match
          </h1>
        </div>

        <div ref={subtitleRef}>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Join thousands of happy couples who found their life partners through our trusted platform
          </p>
        </div>

        <div ref={ctaRef}>{children}</div>
      </div>
    </div>
  );
};

export default HeroAnimation;
