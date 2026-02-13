'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../lib/types';
import Navbar from '../components/ui/Navbar';
import TaskForm from '../components/ui/TaskForm';
import TaskList from '../components/ui/TaskList';
import TaskTable from '../components/ui/TaskTable';
import TaskFilters from '../components/ui/TaskFilters';
import TaskSortControls from '../components/ui/TaskSortControls';
import SearchBar from '../components/ui/SearchBar';
import ReminderConfig from '../components/ui/ReminderConfig';
import RecurrenceConfig from '../components/ui/RecurrenceConfig';

export default function HomePage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // For non-authenticated users, maintain temporary tasks in local state
  const [tempTasks, setTempTasks] = useState<Task[]>([]);
  const [tempLoading, setTempLoading] = useState(false);

  // State for search, filters, and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // For authenticated users, use the API tasks
  const { tasks: apiTasks, loading: apiTasksLoading, error: apiError, createTask, updateTask, toggleTaskCompletion, deleteTask } = useTasks();

  // Handle temporary tasks for non-authenticated users
  const handleCreateTempTask = async (
    title: string, 
    description?: string, 
    priority?: 'low' | 'medium' | 'high', 
    tags?: string[], 
    dueDate?: string | Date, 
    reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, 
    recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }
  ): Promise<void> => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: description || '',
      completed: false,
      userId: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: priority || 'medium',
      tags: tags || [],
      dueDate: dueDate ? (typeof dueDate === 'string' ? dueDate : new Date(dueDate).toISOString()) : undefined,
      reminderConfig: reminderConfig || { enabled: false, notifyBefore: 15, method: 'push' },
      recurrenceRule: recurrenceRule || { enabled: false, pattern: 'daily', endsOn: undefined },
      status: 'pending'
    };
    setTempTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTempTask = async (
    id: string, 
    title?: string, 
    description?: string, 
    priority?: 'low' | 'medium' | 'high', 
    tags?: string[], 
    dueDate?: string | Date, 
    reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, 
    recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }, 
    status?: 'pending' | 'completed' | 'archived'
  ): Promise<void> => {
    setTempTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { 
              ...task, 
              title: title || task.title, 
              description: description || task.description, 
              priority: priority || task.priority,
              tags: tags || task.tags,
              dueDate: dueDate || task.dueDate,
              reminderConfig: reminderConfig || task.reminderConfig,
              recurrenceRule: recurrenceRule || task.recurrenceRule,
              status: status || task.status,
              updatedAt: new Date().toISOString() 
            }
          : task
      )
    );
  };

  const handleToggleTempTask = async (id: string): Promise<void> => {
    setTempTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleDeleteTempTask = async (id: string): Promise<void> => {
    setTempTasks(prev => prev.filter(task => task.id !== id));
  };

  // Determine which functions to use based on authentication status
  const currentCreateTask = isAuthenticated 
    ? (title: string, description?: string, priority?: 'low' | 'medium' | 'high', tags?: string[], dueDate?: string | Date, reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }) => 
        createTask(title, description, priority, tags, dueDate, reminderConfig, recurrenceRule)
    : handleCreateTempTask;
  const currentUpdateTask = isAuthenticated
    ? (id: string, title?: string, description?: string, priority?: 'low' | 'medium' | 'high', tags?: string[], dueDate?: string | Date, reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }, status?: 'pending' | 'completed' | 'archived') => 
        updateTask(id, title, description, priority, tags, dueDate, reminderConfig, recurrenceRule, status)
    : handleUpdateTempTask;
  const currentToggleTask = isAuthenticated ? toggleTaskCompletion : handleToggleTempTask;
  const currentDeleteTask = isAuthenticated ? deleteTask : handleDeleteTempTask;

  // For non-authenticated users, use temp tasks; for authenticated users, use API tasks
  const allTasks = isAuthenticated ? apiTasks : tempTasks;
  const displayLoading = isAuthenticated ? apiTasksLoading : tempLoading;

  // Apply search, filters, and sorting to tasks
  const displayTasks = allTasks.filter(task => {
    // Apply priority filter
    if (priorityFilter && task.priority !== priorityFilter) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter) {
      if (statusFilter === 'completed' && !(task.completed || task.status === 'completed')) {
        return false;
      } else if (statusFilter === 'pending' && (task.completed || task.status === 'completed' || task.status === 'archived')) {
        return false;
      } else if (statusFilter === 'archived' && task.status !== 'archived') {
        return false;
      }
    }
    
    // Apply tag filter
    if (tagFilter && task.tags && !task.tags.some(tag => 
      tag.toLowerCase().includes(tagFilter.toLowerCase())
    )) {
      return false;
    }
    
    // Apply search query
    if (searchQuery && 
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !(task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'priority':
        // Define priority order: high > medium > low
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        aValue = priorityOrder[a.priority || 'medium'];
        bValue = priorityOrder[b.priority || 'medium'];
        break;
      case 'due_date':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        break;
      case 'created_at':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-bluish-50 to-purplish-50">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">AquaTodo - Your Personal Task Manager</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            All in one app to keep you daily life organized
          </p>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl mb-3">➕</div>
              <h3 className="font-semibold text-gray-800 mb-2">Add Tasks</h3>
              <p className="text-gray-600 text-sm">Create new tasks with titles and descriptions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl mb-3">👁️</div>
              <h3 className="font-semibold text-gray-800 mb-2">View Tasks</h3>
              <p className="text-gray-600 text-sm">See all your tasks in an organized list</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl mb-3">✏️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Update Tasks</h3>
              <p className="text-gray-600 text-sm">Edit task details anytime you need</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl mb-3">🗑️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Delete Tasks</h3>
              <p className="text-gray-600 text-sm">Remove tasks you no longer need</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl mb-3">✅</div>
              <h3 className="font-semibold text-gray-800 mb-2">Mark Complete</h3>
              <p className="text-gray-600 text-sm">Toggle task completion status</p>
            </div>
          </div>

          {/* Task Management Dashboard */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {isAuthenticated ? `Hello, ${user?.name || user?.email}!` : 'AquaTodo Dashboard'}
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              {isAuthenticated
                ? 'Here are your tasks'
                : 'Manage your tasks - Login to save your tasks permanently'
              }
            </p>

            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-center">
                <p className="font-medium">Login to save tasks permanently.</p>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar onSearch={setSearchQuery} />
            </div>

            {/* Filter and Sort Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <TaskFilters 
                priorityFilter={priorityFilter}
                tagFilter={tagFilter}
                statusFilter={statusFilter}
                onPriorityChange={setPriorityFilter}
                onTagChange={setTagFilter}
                onStatusChange={setStatusFilter}
              />
              <TaskSortControls 
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Task List */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Tasks</h3>
                <TaskList
                  tasks={displayTasks}
                  loading={displayLoading}
                  error={isAuthenticated ? apiError : null}
                  onUpdateTask={currentUpdateTask}
                  onToggleTask={currentToggleTask}
                  onDeleteTask={currentDeleteTask}
                  searchQuery={searchQuery}
                  priorityFilter={priorityFilter}
                  tagFilter={tagFilter}
                  statusFilter={statusFilter}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
              </div>

              {/* Right Column - Task Form */}
              <div>
                <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Add New Task</h3>
                  <TaskForm onCreateTask={currentCreateTask} />
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mt-4">
            Start managing your tasks today - no signup required to try it out!
          </p>
        </div>
      </main>
    </div>
  );
}