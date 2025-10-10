import React from 'react';
import { FadeIn, ScaleIn } from '../components/animations/ScrollAnimations';
import { HeartIcon, ShieldCheckIcon, UsersIcon, SparklesIcon } from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Helping you find your perfect life partner with trust and authenticity
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <FadeIn delay={0.2}>
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                We are dedicated to creating meaningful connections and helping individuals find their life partners through a secure, verified, and user-friendly platform. Our mission is to bring together compatible matches based on shared values, interests, and life goals.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To be the most trusted matrimonial platform that transforms the way people find their soulmates, making the journey of finding love simple, safe, and successful for everyone.
              </p>
            </div>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: UsersIcon, title: '10,000+', subtitle: 'Active Members' },
            { icon: HeartIcon, title: '5,000+', subtitle: 'Success Stories' },
            { icon: ShieldCheckIcon, title: '100%', subtitle: 'Verified Profiles' },
            { icon: SparklesIcon, title: '24/7', subtitle: 'Support' }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <ScaleIn key={index} delay={index * 0.1}>
                <div className="card p-6 text-center">
                  <Icon className="h-12 w-12 mx-auto mb-4 text-love" />
                  <div className="text-3xl font-bold mb-2">{item.title}</div>
                  <div className="text-gray-600">{item.subtitle}</div>
                </div>
              </ScaleIn>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default About;
