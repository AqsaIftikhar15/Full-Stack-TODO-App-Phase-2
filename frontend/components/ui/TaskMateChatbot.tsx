'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Adjust the path as needed

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const TaskMateChatbot: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Enhanced authentication check before making API call
    if (!isAuthenticated || !user || !user.id) {
      // Add bot response asking user to log in
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Please log in to manage your tasks with TaskMate.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
      return;
    }

    // Additional validation for user ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(user.id)) {
      console.error('Invalid user ID format:', user.id);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Invalid user ID format. Please log in again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Get token and validate it comprehensively
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Validate JWT format
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid authentication token format. Please log in again.');
      }

      // Validate token expiration
      try {
        const payload = tokenParts[1];
        const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        const parsedPayload = JSON.parse(decodedPayload);

        const currentTime = Math.floor(Date.now() / 1000);
        if (parsedPayload.exp && parsedPayload.exp < currentTime) {
          throw new Error('Authentication token has expired. Please log in again.');
        }
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        throw new Error('Invalid authentication token. Please log in again.');
      }

      // Use environment variable for API base URL, fallback to localhost for development
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

      // Ensure the base URL doesn't end with a slash to avoid double slashes
      const normalizedBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;

      // Construct the full URL - MUST resolve to http://localhost:8000/api/v1/{user_id}/chat
      const chatEndpointUrl = `${normalizedBaseUrl}/api/v1/${user.id}/chat`;

      // Validate the constructed URL doesn't contain 'undefined'
      if (chatEndpointUrl.includes('/undefined/')) {
        // Handle case where user.id is undefined
        if (isMounted) {
          const errorResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: 'User authentication error. Please log in again.',
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorResponse]);
        }
        setIsLoading(false);
        return;
      }

      // Log for verification
      if (isMounted) {
        console.log('Resolved API Base URL:', normalizedBaseUrl);
        console.log('User ID from auth:', user?.id);
        console.log('Final API endpoint URL:', chatEndpointUrl);
        console.log('Token available:', !!token);
      }

      // Make the API call - this MUST go to http://localhost:8000/api/v1/{user_id}/chat
      const response = await fetch(chatEndpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Same Bearer token used for /tasks
        },
        body: JSON.stringify({
          message: inputValue
        })
      });

      // Log response details
      if (isMounted) {
        console.log('Response status:', response.status);
        console.log('Response URL (after redirects):', response.url);
      }

      if (!response.ok) {
        // Check if response is HTML (indicating a misrouted request) rather than JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          // This indicates the request went to the wrong endpoint/server
          const htmlContent = await response.text();
          console.error('Received HTML response instead of JSON - misrouted request');
          console.error('HTML content preview:', htmlContent.substring(0, 200) + '...');

          const errorMsg = 'ERROR: Request was misrouted. Check that NEXT_PUBLIC_API_BASE_URL is correctly set.';
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        // Try to get detailed error message from JSON response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (e) {
          // If we can't parse the error response, use the status code
          console.error('Could not parse error response:', e);
        }
        console.error('Backend API error response:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Add bot response - render ONLY data.response from backend
      if (isMounted) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response, // Use ONLY the response from backend, no fallback
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error: any) {
      if (!isMounted) return; // Prevent state updates if component unmounted

      console.error('Error sending message:', error);

      // Get more specific error information from the response
      let errorMessageText = 'Sorry, I encountered an error processing your request. Please try again.';

      try {
        // Check if it's a network error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network error occurred:', error.message);
          errorMessageText = 'Network error: Unable to connect to the server. Please check your connection.';
        } else if (error.message?.includes('Authentication token not found') ||
                  error.message?.includes('Invalid authentication token') ||
                  error.message?.includes('Authentication token has expired')) {
          errorMessageText = error.message; // Use the specific authentication error message
        } else if (error.message?.includes('Invalid user ID format')) {
          errorMessageText = error.message; // Use the specific user ID error message
        } else if (error.message?.includes('401')) {
          errorMessageText = 'Authentication error: Please log in again.';
        } else if (error.message?.includes('403')) {
          errorMessageText = 'Access forbidden: You don\'t have permission to access this resource.';
        } else if (error.message?.includes('404')) {
          // For 404, only show "Chat endpoint not found" if backend returns a JSON 404
          // Do not display this error for HTML 404 responses (which indicate misrouted requests)
          errorMessageText = 'Chat endpoint not found. The service may be temporarily unavailable.';
        } else if (error.message?.includes('Network error') || error.message?.includes('Failed to fetch')) {
          errorMessageText = 'Network error: Unable to connect to the server. Please check your connection.';
        } else if (error.message?.includes('500')) {
          errorMessageText = 'Server error: Please try again in a moment.';
        } else if (error.message) {
          errorMessageText = `Error: ${error.message}`;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }

      // Add error message
      if (isMounted) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: errorMessageText,
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };


  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-16 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-bluish-500 to-purplish-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold">TaskMate AI</h3>
            </div>
            <button
              onClick={toggleOpen}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.sender === 'user'
                        ? 'bg-bluish-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm rounded-bl-none max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="border-t border-gray-200 p-3 bg-white">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask TaskMate..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-bluish-500 text-gray-800 bg-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-bluish-500 text-white px-4 py-2 rounded-r-lg text-sm hover:bg-bluish-600 focus:outline-none disabled:opacity-50"
                disabled={isLoading || !inputValue.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleOpen}
          className="bg-gradient-to-r from-bluish-500 to-purplish-500 text-white rounded-full p-3 shadow-lg hover:from-bluish-600 hover:to-purplish-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bluish-500"
          aria-label="Open TaskMate AI Chatbot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TaskMateChatbot;