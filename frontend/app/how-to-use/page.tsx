'use client';

import Link from 'next/link';
import Navbar from '../../components/ui/Navbar';

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bluish-50 to-purplish-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">How to Use AquaTodo</h1>

            <div className="prose prose-lg max-w-none">
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">What is AquaTodo?</h2>
                <p className="text-gray-600 mb-4">
                  AquaTodo is a simple, responsive, and visually appealing Todo application that helps you organize and manage your tasks efficiently.
                  You can use it right away without signing up, or create an account to save your tasks permanently.
                </p>
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
                  <p className="font-medium">Note: Tasks created without logging in are temporary and will be lost when you refresh the page.</p>
                  <p className="mt-2">Sign up and log in to save your tasks permanently and access them from any device.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Use Without Login</h2>
                <p className="text-gray-600 mb-4">
                  You can start using AquaTodo immediately without creating an account. Your tasks will be stored temporarily in your browser.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-bluish-100 text-bluish-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Visit the Tasks Page</h3>
                      <p className="text-gray-600">Go to the Tasks page to start managing your tasks without logging in.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-bluish-100 text-bluish-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Add Temporary Tasks</h3>
                      <p className="text-gray-600">Create tasks that will be stored in your browser until you refresh the page.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-bluish-100 text-bluish-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Manage Your Tasks</h3>
                      <p className="text-gray-600">You can update, delete, and mark tasks as complete or incomplete.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Login/Signup is Recommended</h2>
                <p className="text-gray-600 mb-4">
                  Creating an account provides several benefits that enhance your task management experience:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Permanent storage of your tasks</li>
                  <li>Access to your tasks from any device</li>
                  <li>Secure and private task management</li>
                  <li>Sync across multiple sessions</li>
                  <li>Backup of your important tasks</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step-by-Step Guide</h2>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">1. How to Sign Up</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">1</div>
                      <p className="text-gray-600">Click on the "Sign Up" button in the navigation bar or on the landing page</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Enter your full name, email address, and create a password</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Click "Create Account" to complete the registration process</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">4</div>
                      <p className="text-gray-600">You'll be automatically redirected to the Tasks page to start managing your tasks</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">2. How to Log In</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">1</div>
                      <p className="text-gray-600">Click on the "Login" button in the navigation bar or on the landing page</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Enter your email address and password</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Click "Login to Account" to access your saved tasks</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">3. How to Add Tasks</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">1</div>
                      <p className="text-gray-600">Navigate to the Tasks page (either logged in or not)</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Type your task in the "Task Title" field</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Optionally add a description in the "Description" field</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">4</div>
                      <p className="text-gray-600">Click "Add Task" to save your new task</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">4. How to Update Tasks</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">1</div>
                      <p className="text-gray-600">Find the task you want to update in your task list</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Click the "Edit" button next to the task</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Modify the title or description as needed</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">4</div>
                      <p className="text-gray-600">Click "Save" to update the task</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">5. How to Delete Tasks</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">1</div>
                      <p className="text-gray-600">Find the task you want to delete in your task list</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Click the "Delete" button next to the task</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Confirm the deletion if prompted</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">6. How to Mark Tasks Complete/Incomplete</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">1</div>
                      <p className="text-gray-600">Find the task you want to mark in your task list</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Click the checkbox next to the task title to toggle its completion status</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Completed tasks will be visually marked with a strikethrough</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Important Information</h2>
                <p className="text-gray-600 mb-4">
                  Tasks are saved permanently ONLY after you log in to your account. When using the app without logging in,
                  your tasks are stored temporarily in your browser and will be lost when you refresh the page or close the browser.
                </p>
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">Recommendation:</p>
                  <p className="mt-2">Sign up for an account to ensure your tasks are saved securely and accessible from any device.</p>
                </div>
              </section>

              <div className="text-center mt-12">
                <Link
                  href="/tasks"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-bluish-500 to-purplish-500 text-white font-semibold rounded-lg hover:from-bluish-600 hover:to-purplish-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Using AquaTodo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}