import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { HeartIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <div className="text-center px-4">
        <div className="mb-8">
          <HeartIcon className="h-32 w-32 mx-auto text-love opacity-50" />
        </div>
        <h1 className="text-9xl font-bold text-love mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button size="lg">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
