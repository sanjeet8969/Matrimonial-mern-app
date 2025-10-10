import React, { useState } from 'react';
import PrivacySettings from '../components/profile/PrivacySettings';
import PreferenceForm from '../components/preferences/PreferenceForm';
import { FadeIn } from '../components/animations/ScrollAnimations';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-4xl font-bold mb-8 text-center">Settings</h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-love text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'preferences'
                  ? 'bg-love text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Partner Preferences
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="card p-8">
            {activeTab === 'privacy' ? <PrivacySettings /> : <PreferenceForm />}
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Settings;
