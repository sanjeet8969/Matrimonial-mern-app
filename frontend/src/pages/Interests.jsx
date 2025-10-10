import React, { useState } from 'react';
import ReceivedInterests from '../components/interests/ReceivedInterests';
import SentInterests from '../components/interests/SentInterests';
import { FadeIn } from '../components/animations/ScrollAnimations';

const Interests = () => {
  const [activeTab, setActiveTab] = useState('received');

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-4xl font-bold mb-8 text-center">Interests</h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('received')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'received'
                  ? 'bg-love text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Received
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'sent'
                  ? 'bg-love text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Sent
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          {activeTab === 'received' ? <ReceivedInterests /> : <SentInterests />}
        </FadeIn>
      </div>
    </div>
  );
};

export default Interests;
