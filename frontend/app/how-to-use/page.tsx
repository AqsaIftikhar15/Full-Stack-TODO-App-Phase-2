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
                  AquaTodo is a simple, responsive Todo application that helps you organize and manage your tasks efficiently.
                  You can use it without signing up or create an account to save your tasks permanently.
                </p>
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
                  <p className="font-medium">Note: Tasks created without logging in are temporary and will be lost when you refresh the page.</p>
                  <p className="mt-2">Sign up to save your tasks permanently and access them from any device.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Use Without Login</h2>
                <p className="text-gray-600 mb-4">
                  Start using AquaTodo immediately without an account. Your tasks will be stored temporarily in your browser.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-bluish-100 text-bluish-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Visit Tasks Page</h3>
                      <p className="text-gray-600">Go to the Tasks page to start managing your tasks without logging in.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-bluish-100 text-bluish-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Add Tasks</h3>
                      <p className="text-gray-600">Create tasks that will be stored in your browser until you refresh the page.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-bluish-100 text-bluish-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Manage Tasks</h3>
                      <p className="text-gray-600">Update, delete, and mark tasks as complete or incomplete.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Login/Signup is Recommended</h2>
                <p className="text-gray-600 mb-4">
                  Creating an account enhances your task management experience:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Permanent storage of your tasks</li>
                  <li>Access from any device</li>
                  <li>Secure task management</li>
                  <li>Sync across sessions</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step-by-Step Guide</h2>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">1. How to Sign Up</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">1</div>
                      <p className="text-gray-600">Click on the "Sign Up" button in the navigation bar</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Enter your name, email, and create a password</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Click "Create Account" to complete registration</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">4</div>
                      <p className="text-gray-600">You'll be redirected to the Tasks page</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">2. How to Log In</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">1</div>
                      <p className="text-gray-600">Click on the "Login" button in the navigation bar</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Enter your email address and password</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Click "Login to Account" to access your tasks</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">3. How to Add Tasks</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">1</div>
                      <p className="text-gray-600">Go to the Tasks page</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Type your task in the "Task Title" field</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Add an optional description</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">4</div>
                      <p className="text-gray-600">Click "Add Task" to save</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">4. How to Update Tasks</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">1</div>
                      <p className="text-gray-600">Find the task you want to update</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Click the "Edit" button</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Modify the title or description</p>
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
                      <p className="text-gray-600">Find the task you want to delete</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Click the "Delete" button</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Confirm the deletion</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">6. How to Mark Tasks Complete/Incomplete</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">1</div>
                      <p className="text-gray-600">Find the task you want to mark</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">2</div>
                      <p className="text-gray-600">Click the checkbox to toggle completion status</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purplish-100 text-purplish-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm">3</div>
                      <p className="text-gray-600">Completed tasks will have a strikethrough</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">TaskMate AI Assistant</h2>
                <p className="text-gray-600 mb-4">
                  Meet TaskMate, your AI-powered assistant! Located in the top-right corner of the screen, TaskMate allows you to manage your tasks using natural language commands.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-bluish-100 text-bluish-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">How to Use TaskMate</h3>
                      <p className="text-gray-600">Click the robot icon in the top-right corner to open the chatbot. You can then ask TaskMate to:</p>
                      <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                        <li>Create tasks (e.g., "Create a task called 'Buy groceries'")</li>
                        <li>Update tasks (e.g., "Update the task 'Buy groceries' to 'Buy food items'")</li>
                        <li>Delete tasks (e.g., "Delete the task 'Buy groceries'")</li>
                        <li>Mark tasks as completed (e.g., "Mark 'Buy groceries' as complete")</li>
                        <li>Show all tasks (e.g., "Show me all my tasks")</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Important Information</h2>
                <p className="text-gray-600 mb-4">
                  Tasks are saved permanently ONLY after you log in to your account. When using the app without logging in,
                  your tasks are stored temporarily in your browser and will be lost when you refresh the page.
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