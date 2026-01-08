'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, loading, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-bluish-500 to-purplish-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link href="/">AquaTodo</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/how-to-use"
              className="px-3 py-2 rounded-lg hover:bg-white/20 transition duration-300 font-medium"
            >
              How to Use
            </Link>
            {loading ? (
              <div className="text-sm">Loading...</div>
            ) : isAuthenticated ? (
              <>
                <span className="hidden md:inline">Welcome, {user?.name || user?.email}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-white text-bluish-700 rounded-lg hover:bg-gray-100 transition duration-300 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-white text-bluish-700 rounded-lg hover:bg-gray-100 transition duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-purplish-600 text-white rounded-lg hover:bg-purplish-700 transition duration-300 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;