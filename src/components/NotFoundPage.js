import React from 'react'
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
    <h1 className="text-9xl font-extrabold text-gray-800 mb-4">404</h1>
    <p className="text-2xl md:text-3xl text-gray-600 mb-6">
      Oops! The page you're looking for doesn't exist.
    </p>
    <Link
      to="/"
      className="inline-block px-6 py-3 bg-[#d38473] text-white rounded-lg hover:[#bd7667] transition duration-300"
    >
      Go Back Home
    </Link>
  </div>
  )
}

export default NotFoundPage;
