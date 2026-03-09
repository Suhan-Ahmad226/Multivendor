import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Page not found</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;

