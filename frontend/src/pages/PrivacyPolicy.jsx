import React from 'react';
import { FadeIn } from '../components/animations/ScrollAnimations';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-5xl font-bold mb-8 text-center">Privacy Policy</h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="card p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with other users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, to develop new services, and to protect our platform and users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not share your personal information with third parties except as described in this privacy policy or with your consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@matrimonial.com
              </p>
            </section>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
