import React, { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { FadeIn } from '../components/animations/ScrollAnimations';
import toast from 'react-hot-toast';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FadeIn delay={0.1}>
              <div className="card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                  <div>
                    <label className="label">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows="5"
                      className="input-field resize-none"
                      required
                    />
                  </div>
                  <Button type="submit" fullWidth>Send Message</Button>
                </form>
              </div>
            </FadeIn>
          </div>

          <div className="space-y-6">
            <FadeIn delay={0.2}>
              <div className="card p-6">
                <EnvelopeIcon className="h-8 w-8 text-love mb-3" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">support@matrimonial.com</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="card p-6">
                <PhoneIcon className="h-8 w-8 text-love mb-3" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">+91 1234567890</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="card p-6">
                <MapPinIcon className="h-8 w-8 text-love mb-3" />
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-600">
                  123 Love Street<br />
                  Mumbai, India - 400001
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
