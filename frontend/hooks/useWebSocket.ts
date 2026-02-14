import { useEffect, useState, useRef } from 'react';

export const useWebSocket = (userId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Construct WebSocket URL - in production this would come from an environment variable
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL 
      ? `${process.env.NEXT_PUBLIC_WS_URL}/ws/${userId}`
      : `ws://localhost:8001/ws/${userId}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages(prev => [...prev, data]);
        
        // Trigger a custom event to notify other parts of the app
        window.dispatchEvent(new CustomEvent('taskUpdate', { detail: data }));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    wsRef.current = ws;

    // Clean up function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [userId]);

  return { isConnected, messages };
};