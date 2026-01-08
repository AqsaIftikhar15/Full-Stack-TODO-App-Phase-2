'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import Loader from '../../../components/ui/Loader';
import Navbar from '../../../components/ui/Navbar';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signup, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      router.push('/tasks'); // Redirect to tasks page after signup
      router.refresh(); // Refresh to update the navbar
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bluish-50 to-purplish-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Loader text="Creating your account..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bluish-50 to-purplish-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
              <p className="text-gray-600">Join AquaTodo and start organizing your tasks</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purplish-500 focus:border-transparent transition duration-300"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purplish-500 focus:border-transparent transition duration-300"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purplish-500 focus:border-transparent transition duration-300"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purplish-500 to-purplish-600 hover:from-purplish-600 hover:to-purplish-700'
                }`}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-bluish-600 hover:text-bluish-700 font-semibold hover:underline transition duration-300">
                Login to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;