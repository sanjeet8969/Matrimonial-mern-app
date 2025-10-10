import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HeroAnimation from '../components/animations/HeroAnimation';
import { FadeIn, ScaleIn, SlideIn } from '../components/animations/ScrollAnimations';
import LoveScene from '../components/animations/LoveScene';
import Button from '../components/common/Button';
import {
  HeartIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Verified Profiles',
      description: 'All profiles are verified to ensure authenticity and safety'
    },
    {
      icon: UserGroupIcon,
      title: 'Smart Matching',
      description: 'Advanced algorithm to find your perfect match based on preferences'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Instant Messaging',
      description: 'Real-time chat with your matches and express interests'
    },
    {
      icon: SparklesIcon,
      title: 'Premium Features',
      description: 'Unlock exclusive features with our affordable premium plans'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Users' },
    { number: '5,000+', label: 'Success Stories' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support Available' }
  ];

  const testimonials = [
    {
      name: 'Priya & Rahul',
      image: '/testimonial1.jpg',
      text: 'We found each other through this amazing platform. Best decision of our lives!',
      rating: 5
    },
    {
      name: 'Ananya & Vikram',
      image: '/testimonial2.jpg',
      text: 'The matching algorithm is incredible. We connected instantly and are now happily married!',
      rating: 5
    },
    {
      name: 'Sneha & Arjun',
      image: '/testimonial3.jpg',
      text: 'Professional, secure, and effective. Highly recommend to anyone serious about finding a life partner.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroAnimation>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg" className="px-8 py-4 text-lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </HeroAnimation>

      {/* 3D Love Scene */}
      <FadeIn delay={0.2}>
        <section className="py-20 bg-gradient-to-b from-white to-pink-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                💕 Your Soulmate Awaits
              </h2>
              <p className="text-xl text-gray-600">
                Every great love story begins here
              </p>
            </div>
            <LoveScene />
          </div>
        </section>
      </FadeIn>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Us?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide the best platform to find your perfect life partner with advanced features and complete security
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <ScaleIn key={index} delay={index * 0.1}>
                  <div className="card p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-love-light bg-opacity-20 rounded-full mb-6">
                      <Icon className="h-8 w-8 text-love" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </ScaleIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-love-light to-love">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="text-center text-white">
                  <div className="text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Simple steps to find your perfect match
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Create Profile',
                description: 'Sign up and create your detailed profile with preferences'
              },
              {
                step: '02',
                title: 'Find Matches',
                description: 'Browse through verified profiles and find your perfect match'
              },
              {
                step: '03',
                title: 'Connect & Chat',
                description: 'Send interests and chat with matches in real-time'
              }
            ].map((item, index) => (
              <SlideIn key={index} delay={index * 0.2} direction="left">
                <div className="relative">
                  <div className="text-6xl font-bold text-love-light opacity-20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                      <HeartIcon className="h-8 w-8 text-love animate-pulse" />
                    </div>
                  )}
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                Hear from our happy couples
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScaleIn key={index} delay={index * 0.15}>
                <div className="card p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <HeartIcon key={i} className="h-5 w-5 text-love fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-love-light rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.split('&')[0].trim()[0]}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">Happily Married</p>
                    </div>
                  </div>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-100 via-red-100 to-purple-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Find Your Soulmate?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of happy couples today and start your journey to forever
            </p>
            <Link to="/register">
              <Button size="lg" className="px-12 py-4 text-lg transform hover:scale-105 transition-transform">
                Start Your Journey
                <HeartIcon className="h-6 w-6 ml-2 inline" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HeartIcon className="h-8 w-8 text-love" />
            <span className="text-2xl font-bold">Matrimonial</span>
          </div>
          <p className="text-gray-400">
            Find your perfect life partner with our trusted platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
